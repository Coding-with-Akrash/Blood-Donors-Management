import os
import jwt
import requests
from functools import wraps
from flask import Blueprint, request, jsonify, redirect, url_for, current_app, flash, render_template
from flask_login import login_user, logout_user, current_user, login_required
from jwt import PyJWKClient

from app import db
from app.models import User, UserRole

NEON_AUTH_URL = os.environ.get('NEON_AUTH_URL', 'https://ep-sweet-math-b4bpoi0e.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth')
NEON_API_KEY = os.environ.get('NEON_API_KEY')

JWKS_URL = "https://ep-sweet-math-b4bpoi0e.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth/.well-known/jwks.json"
_jwks_client = PyJWKClient(JWKS_URL)

neon_auth_bp = Blueprint('neon_auth', __name__)


def verify_token(token: str, audience: str = None) -> dict:
    signing_key = _jwks_client.get_signing_key_from_jwt(token).key
    return jwt.decode(
        token,
        signing_key,
        algorithms=["EdDSA"],
        options={"verify_exp": True}
    )


def get_user_from_token(token: str) -> dict:
    signing_key = _jwks_client.get_signing_key_from_jwt(token).key
    payload = jwt.decode(
        token,
        signing_key,
        algorithms=["EdDSA"],
        options={"verify_exp": True}
    )
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "username": payload.get("username", payload.get("email", "").split("@")[0]),
        "roles": payload.get("roles", []),
    }


def get_or_create_user(neon_user_data: dict) -> User:
    email = neon_user_data.get("email")
    username = neon_user_data.get("username", email.split("@")[0] if email else "user")

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User.query.filter_by(username=username).first()

    if not user:
        user = User(
            username=username,
            email=email,
            role="donor",
            is_active=True
        )
        user.set_password(os.urandom(24).hex())
        db.session.add(user)
        db.session.commit()
    else:
        if user.username != username:
            user.username = username
        if user.email != email:
            user.email = email
        db.session.commit()

    return user


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = _verify_token_internal(token)
            user_data = {
                "id": payload.get("sub"),
                "email": payload.get("email"),
                "username": payload.get("username", payload.get("email", "").split("@")[0]),
                "roles": payload.get("roles", []),
            }
            request.neon_user = user_data
        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401

        return f(*args, **kwargs)
    return decorated_function


def _verify_token_internal(token: str) -> dict:
    # Try Neon Auth EdDSA first
    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token).key
        return jwt.decode(
            token,
            signing_key,
            algorithms=["EdDSA"],
            options={"verify_exp": True}
        )
    except (jwt.InvalidTokenError, jwt.PyJWKClientError):
        # Fall back to our custom HS256 tokens
        secret_key = os.environ.get('JWT_SECRET_KEY') or os.environ.get('SECRET_KEY') or 'dev-secret-key'
        return jwt.decode(
            token,
            secret_key,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )


@neon_auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        if current_user.is_authenticated:
            return redirect(url_for("main.index"))
        return render_template("neon_auth/login.html")

    email = request.form.get("email") or (request.get_json().get("email") if request.is_json else None)
    password = request.form.get("password") or (request.get_json().get("password") if request.is_json else None)

    if not email or not password:
        if request.is_json:
            return jsonify({"error": "Email and password required"}), 400
        flash("Email and password required", "danger")
        return redirect(url_for("neon_auth.login"))

    try:
        token_response = requests.post(
            f"{NEON_AUTH_URL}/api/token",
            json={"email": email, "password": password},
            headers={"Authorization": f"Bearer {NEON_API_KEY}"} if NEON_API_KEY else {},
            timeout=10
        )

        if token_response.status_code != 200:
            error_msg = "Invalid credentials"
            if token_response.status_code == 401:
                error_msg = "Invalid email or password"
            if request.is_json:
                return jsonify({"error": error_msg}), 401
            flash(error_msg, "danger")
            return redirect(url_for("neon_auth.login"))

        token_data = token_response.json()
        session_token = token_data.get("session_token") or token_data.get("access_token")

        if not session_token:
            if request.is_json:
                return jsonify({"error": "No session token received"}), 401
            flash("Authentication failed", "danger")
            return redirect(url_for("neon_auth.login"))

        user_response = requests.get(
            f"{NEON_AUTH_URL}/api/user",
            headers={"Authorization": f"Bearer {session_token}"},
            timeout=10
        )

        if user_response.status_code != 200:
            if request.is_json:
                return jsonify({"error": "Failed to get user info"}), 401
            flash("Failed to get user info", "danger")
            return redirect(url_for("neon_auth.login"))

        user_data = user_response.json().get("user")
        if not user_data:
            if request.is_json:
                return jsonify({"error": "No user data returned"}), 401
            flash("No user data returned", "danger")
            return redirect(url_for("neon_auth.login"))

        user = get_or_create_user(user_data)
        login_user(user)

        if request.is_json:
            return jsonify({"success": True, "token": session_token, "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.value if user.role else None
            }})

        return redirect(url_for("main.index"))

    except requests.Timeout:
        error_msg = "Authentication service timeout"
    except requests.RequestException as e:
        current_app.logger.error(f"Neon Auth login error: {e}")
        error_msg = "Authentication service unavailable"
    except Exception as e:
        current_app.logger.error(f"Login error: {e}")
        error_msg = "Login failed"

    if request.is_json:
        return jsonify({"error": error_msg}), 500
    flash(error_msg, "danger")
    return redirect(url_for("neon_auth.login"))


@neon_auth_bp.route("/callback")
def callback():
    code = request.args.get("code")
    error = request.args.get("error")

    if error:
        return f"Authentication error: {error}", 400

    if not code:
        return "No authorization code provided", 400

    try:
        token_response = requests.post(
            f"{NEON_AUTH_URL}/api/token",
            json={"code": code},
            headers={"Authorization": f"Bearer {NEON_API_KEY}"} if NEON_API_KEY else {},
            timeout=10
        )

        if token_response.status_code == 200:
            token_data = token_response.json()
            session_token = token_data.get("session_token") or token_data.get("access_token")

            if session_token:
                user_response = requests.get(
                    f"{NEON_AUTH_URL}/api/user",
                    headers={"Authorization": f"Bearer {session_token}"},
                    timeout=10
                )

                if user_response.status_code == 200:
                    user_data = user_response.json().get("user")
                    if user_data:
                        user = get_or_create_user(user_data)
                        login_user(user)
                        return redirect(url_for("main.index"))
    except Exception as e:
        current_app.logger.error(f"Neon Auth callback error: {e}")

    return "Authentication failed", 401


@neon_auth_bp.route("/logout")
def logout():
    logout_user()
    logout_url = f"{NEON_AUTH_URL}/logout"
    return redirect(logout_url)


@neon_auth_bp.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    token = data.get("token") if data else None

    if not token:
        return jsonify({"error": "Token required"}), 400

    try:
        payload = _verify_token_internal(token)
        user_data = {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "username": payload.get("username", payload.get("email", "").split("@")[0]),
            "roles": payload.get("roles", []),
        }
        return jsonify({"valid": True, "user": user_data})
    except jwt.InvalidTokenError as e:
        return jsonify({"valid": False, "error": str(e)}), 401


@neon_auth_bp.route("/me")
def me():
    if current_user.is_authenticated:
        return jsonify({
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "role": current_user.role.value if current_user.role else None
        })
    return jsonify({"error": "Not authenticated"}), 401


def neon_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for("neon_auth.login"))
        return f(*args, **kwargs)
    return decorated_function


def neon_role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return redirect(url_for("neon_auth.login"))
            if current_user.role.value not in roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            return f(*args, **kwargs)
        return decorator
    return decorator