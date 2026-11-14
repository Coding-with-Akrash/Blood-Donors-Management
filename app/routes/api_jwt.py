from flask import Blueprint, jsonify, request
from app.neon_auth import token_required
from app.models import DonorProfile, BloodRequest, Donation, BloodInventory, User, RecipientProfile, db, RequestStatus
from app.services.blood_compatibility import BloodCompatibilityService, EligibilityService
from app.auth import log_audit
from datetime import datetime, date
from werkzeug.security import generate_password_hash

api_jwt_bp = Blueprint('api_jwt', __name__, url_prefix='/api/jwt')


def role_check_jwt(*allowed_roles):
    """Check if the JWT user has one of the allowed roles"""
    user_roles = getattr(request, 'neon_user', {}).get('roles', [])
    if not any(role in user_roles for role in allowed_roles):
        return jsonify({"error": "Insufficient permissions"}), 403
    return None


@api_jwt_bp.route('/donors', methods=['GET'])
@token_required
def get_donors():
    """Get list of available donors with filtering"""
    error = role_check_jwt('donor', 'recipient', 'staff', 'admin')
    if error:
        return error
    
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    blood_group = request.args.get('blood_group')
    city = request.args.get('city')
    
    query = DonorProfile.query.filter_by(eligibility_status='Eligible', availability_status='Available')
    if blood_group:
        query = query.filter(DonorProfile.blood_group == blood_group)
    if city:
        query = query.filter(DonorProfile.city.ilike(f'%{city}%'))
    
    donors = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'donors': [{
            'id': d.id,
            'full_name': d.full_name,
            'blood_group': d.blood_group,
            'city': d.city,
            'availability_status': d.availability_status,
            'eligibility_status': d.eligibility_status.value,
            'phone': d.phone,
            'last_donation_date': d.last_donation_date.isoformat() if d.last_donation_date else None
        } for d in donors.items],
        'total': donors.total,
        'pages': donors.pages,
        'page': donors.page
    })


@api_jwt_bp.route('/donors/<int:donor_id>', methods=['GET'])
@token_required
def get_donor(donor_id):
    """Get single donor details"""
    error = role_check_jwt('staff', 'admin')
    if error:
        return error
    
    donor = DonorProfile.query.get_or_404(donor_id)
    return jsonify({
        'id': donor.id,
        'full_name': donor.full_name,
        'blood_group': donor.blood_group,
        'city': donor.city,
        'phone': donor.phone,
        'email': donor.user.email if donor.user else None,
        'availability_status': donor.availability_status,
        'eligibility_status': donor.eligibility_status.value,
        'date_of_birth': donor.date_of_birth.isoformat() if donor.date_of_birth else None,
        'weight': donor.weight,
        'height': donor.height,
        'last_donation_date': donor.last_donation_date.isoformat() if donor.last_donation_date else None,
        'next_eligible_date': donor.next_eligible_date.isoformat() if donor.next_eligible_date else None
    })


@api_jwt_bp.route('/donors/match/<blood_group>', methods=['GET'])
@token_required
def match_donors(blood_group):
    """Find compatible donors for a blood group"""
    error = role_check_jwt('staff', 'admin', 'recipient')
    if error:
        return error
    
    compatible = BloodCompatibilityService.get_compatible_donors(blood_group)
    donors = DonorProfile.query.filter(
        DonorProfile.blood_group.in_(compatible),
        DonorProfile.eligibility_status == 'Eligible',
        DonorProfile.availability_status == 'Available'
    ).limit(20).all()
    return jsonify([{'id': d.id, 'full_name': d.full_name, 'blood_group': d.blood_group, 'city': d.city, 'phone': d.phone} for d in donors])


@api_jwt_bp.route('/blood-compatibility/<blood_group>', methods=['GET'])
@token_required
def blood_compatibility(blood_group):
    """Get blood compatibility information"""
    compatible_recipients = BloodCompatibilityService.get_compatible_recipients(blood_group)
    compatible_donors = BloodCompatibilityService.get_compatible_donors(blood_group)
    return jsonify({
        'can_donate_to': compatible_recipients,
        'can_receive_from': compatible_donors
    })


@api_jwt_bp.route('/donations', methods=['GET'])
@token_required
def get_donations():
    """Get donation history"""
    error = role_check_jwt('staff', 'admin', 'donor')
    if error:
        return error
    
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    donor_id = request.args.get('donor_id', type=int)
    
    query = Donation.query
    if donor_id:
        query = query.filter_by(donor_id=donor_id)
    
    donations = query.order_by(Donation.donation_date.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'donations': [{
            'id': d.id,
            'donor': d.donor.full_name if d.donor else None,
            'donor_id': d.donor_id,
            'date': d.donation_date.isoformat() if d.donation_date else None,
            'blood_group': d.blood_group,
            'quantity': d.quantity,
            'collection_location': d.collection_location,
            'status': d.donation_status.value if d.donation_status else None
        } for d in donations.items],
        'total': donations.total,
        'pages': donations.pages,
        'page': donations.page
    })


@api_jwt_bp.route('/donations', methods=['POST'])
@token_required
def create_donation():
    """Record a new donation"""
    error = role_check_jwt('staff', 'admin')
    if error:
        return error
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    
    required_fields = ['donor_id', 'donation_date', 'blood_group', 'quantity', 'collection_location']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    donation = Donation(
        donor_id=data['donor_id'],
        staff_id=request.neon_user['id'],
        donation_date=datetime.fromisoformat(data['donation_date']).date(),
        blood_group=data['blood_group'],
        quantity=data['quantity'],
        collection_location=data['collection_location'],
        donation_status=data.get('donation_status', 'Pending')
    )
    db.session.add(donation)
    db.session.commit()
    log_audit('CREATE', 'Donation', donation.id, f'API: Staff created donation for donor {donation.donor_id}')
    return jsonify({'id': donation.id, 'message': 'Donation created'}), 201


@api_jwt_bp.route('/blood-requests', methods=['GET'])
@token_required
def get_requests():
    """Get blood requests"""
    error = role_check_jwt('staff', 'admin', 'recipient', 'donor')
    if error:
        return error
    
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    status = request.args.get('status')
    blood_group = request.args.get('blood_group')
    
    query = BloodRequest.query
    if status:
        query = query.filter_by(status=status)
    if blood_group:
        query = query.filter_by(required_blood_group=blood_group)
    
    requests = query.order_by(BloodRequest.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'requests': [{
            'id': r.id,
            'blood_group': r.required_blood_group,
            'units_required': r.units_required,
            'urgency': r.urgency.value if r.urgency else None,
            'status': r.status.value if r.status else None,
            'hospital': r.hospital,
            'city': r.city,
            'required_date': r.required_date.isoformat() if r.required_date else None,
            'created_at': r.created_at.isoformat() if r.created_at else None,
            'recipient': r.recipient.full_name if r.recipient else None
        } for r in requests.items],
        'total': requests.total,
        'pages': requests.pages,
        'page': requests.page
    })


@api_jwt_bp.route('/blood-requests', methods=['POST'])
@token_required
def create_request():
    """Create a new blood request"""
    error = role_check_jwt('recipient', 'staff', 'admin')
    if error:
        return error
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    
    required_fields = ['required_blood_group', 'units_required', 'hospital', 'city', 'required_date', 'urgency']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    blood_request = BloodRequest(
        recipient_id=request.neon_user['id'],
        required_blood_group=data['required_blood_group'],
        units_required=data['units_required'],
        hospital=data['hospital'],
        city=data['city'],
        required_date=datetime.fromisoformat(data['required_date']).date(),
        urgency=data['urgency']
    )
    db.session.add(blood_request)
    db.session.commit()
    log_audit('CREATE', 'BloodRequest', blood_request.id, f'API: User {request.neon_user["username"]} created blood request')
    return jsonify({'id': blood_request.id, 'message': 'Request created'}), 201


@api_jwt_bp.route('/blood-requests/<int:request_id>', methods=['GET'])
@token_required
def get_request(request_id):
    """Get single blood request details"""
    error = role_check_jwt('staff', 'admin', 'recipient')
    if error:
        return error
    
    blood_request = BloodRequest.query.get_or_404(request_id)
    return jsonify({
        'id': blood_request.id,
        'blood_group': blood_request.required_blood_group,
        'units_required': blood_request.units_required,
        'urgency': blood_request.urgency.value if blood_request.urgency else None,
        'status': blood_request.status.value if blood_request.status else None,
        'hospital': blood_request.hospital,
        'city': blood_request.city,
        'required_date': blood_request.required_date.isoformat() if blood_request.required_date else None,
        'created_at': blood_request.created_at.isoformat() if blood_request.created_at else None,
        'recipient': blood_request.recipient.full_name if blood_request.recipient else None,
        'assigned_staff': blood_request.assigned_staff.username if blood_request.assigned_staff else None,
        'notes': blood_request.notes
    })


@api_jwt_bp.route('/blood-requests/<int:request_id>', methods=['PUT'])
@token_required
def update_request(request_id):
    """Update a blood request (staff/admin only)"""
    error = role_check_jwt('staff', 'admin')
    if error:
        return error
    
    blood_request = BloodRequest.query.get_or_404(request_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    
    if 'status' in data:
        blood_request.status = RequestStatus(data['status'])
    if 'assigned_staff_id' in data:
        blood_request.assigned_staff_id = data['assigned_staff_id']
    if 'notes' in data:
        blood_request.notes = data['notes']
    
    db.session.commit()
    log_audit('UPDATE', 'BloodRequest', blood_request.id, f'API: Staff {request.neon_user["username"]} updated request')
    return jsonify({'message': 'Request updated'})


@api_jwt_bp.route('/inventory', methods=['GET'])
@token_required
def get_inventory():
    """Get blood inventory"""
    error = role_check_jwt('staff', 'admin')
    if error:
        return error
    
    blood_group = request.args.get('blood_group')
    component = request.args.get('component')
    location = request.args.get('location')
    
    query = BloodInventory.query.filter_by(status='Available')
    if blood_group:
        query = query.filter_by(blood_group=blood_group)
    if component:
        query = query.filter_by(component=component)
    if location:
        query = query.filter(BloodInventory.location.ilike(f'%{location}%'))
    
    inventory = query.order_by(BloodInventory.expiry_date.asc()).all()
    return jsonify([{
        'id': i.id,
        'blood_group': i.blood_group,
        'component': i.component,
        'quantity': i.quantity,
        'location': i.location,
        'expiry_date': i.expiry_date.isoformat() if i.expiry_date else None,
        'status': i.status,
        'donation_id': i.donation_id
    } for i in inventory])


@api_jwt_bp.route('/inventory', methods=['POST'])
@token_required
def add_inventory():
    """Add new inventory item"""
    error = role_check_jwt('staff', 'admin')
    if error:
        return error
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    
    required_fields = ['blood_group', 'component', 'quantity', 'location', 'expiry_date']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    inventory = BloodInventory(
        blood_group=data['blood_group'],
        component=data['component'],
        quantity=data['quantity'],
        location=data['location'],
        expiry_date=datetime.fromisoformat(data['expiry_date']).date(),
        status=data.get('status', 'Available'),
        donation_id=data.get('donation_id')
    )
    db.session.add(inventory)
    db.session.commit()
    log_audit('CREATE', 'BloodInventory', inventory.id, f'API: Staff added inventory')
    return jsonify({'id': inventory.id, 'message': 'Inventory added'}), 201


@api_jwt_bp.route('/inventory/<int:inventory_id>', methods=['PUT'])
@token_required
def update_inventory(inventory_id):
    """Update inventory item"""
    error = role_check_jwt('staff', 'admin')
    if error:
        return error
    
    inventory = BloodInventory.query.get_or_404(inventory_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400
    
    if 'quantity' in data:
        inventory.quantity = data['quantity']
    if 'status' in data:
        inventory.status = data['status']
    if 'location' in data:
        inventory.location = data['location']
    if 'expiry_date' in data:
        inventory.expiry_date = datetime.fromisoformat(data['expiry_date']).date()
    
    db.session.commit()
    log_audit('UPDATE', 'BloodInventory', inventory.id, f'API: Staff updated inventory')
    return jsonify({'message': 'Inventory updated'})


@api_jwt_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user (donor or recipient)"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400

    required_fields = ['username', 'email', 'password', 'role', 'full_name', 'date_of_birth', 'gender', 'phone', 'city']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    role = data['role']
    if role not in ['donor', 'recipient']:
        return jsonify({"error": "Invalid role. Must be 'donor' or 'recipient'"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(
        username=data['username'],
        email=data['email'],
        role=role,
        is_active=True
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.flush()

    if role == 'donor':
        medical_screening = {
            'not_feeling_healthy': data.get('not_feeling_healthy', False),
            'recent_surgery': data.get('recent_surgery', False),
            'medication': data.get('on_medication', False),
            'medical_condition': data.get('medical_condition', False),
            'infections_fever': data.get('infections_fever', False),
            'recent_vaccination': data.get('recent_vaccination', False)
        }
        eligibility = EligibilityService.evaluate_eligibility(medical_screening)

        donor_profile = DonorProfile(
            user_id=user.id,
            full_name=data['full_name'],
            date_of_birth=datetime.fromisoformat(data['date_of_birth']).date(),
            gender=data['gender'],
            phone=data['phone'],
            address=data.get('address', ''),
            city=data['city'],
            blood_group=data.get('blood_group', 'O+'),
            rh_factor=data.get('rh_factor', 'Positive'),
            weight=data.get('weight'),
            height=data.get('height'),
            emergency_contact=data.get('emergency_contact', ''),
            last_donation_date=datetime.fromisoformat(data['last_donation_date']).date() if data.get('last_donation_date') else None,
            eligibility_status=eligibility
        )

        if donor_profile.last_donation_date:
            donor_profile.next_eligible_date = EligibilityService.calculate_next_eligible_date(donor_profile.last_donation_date)

        db.session.add(donor_profile)
    else:
        recipient_profile = RecipientProfile(
            user_id=user.id,
            full_name=data['full_name'],
            date_of_birth=datetime.fromisoformat(data['date_of_birth']).date(),
            gender=data['gender'],
            phone=data['phone'],
            city=data['city'],
            hospital=data.get('hospital', ''),
            emergency_contact=data.get('emergency_contact', '')
        )
        db.session.add(recipient_profile)

    db.session.commit()
    log_audit('REGISTER', 'User', user.id, f'{role.capitalize()} {user.username} registered via JWT API')

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role.value if user.role else role,
        'message': 'Registration successful'
    }), 201


@api_jwt_bp.route('/auth/login', methods=['POST'])
def login():
    """Login with email/username and password - verifies against database"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "JSON body required"}), 400

    email_or_username = data.get('email') or data.get('username')
    password = data.get('password')
    remember_me = data.get('rememberMe', False)

    if not email_or_username or not password:
        return jsonify({"error": "Email/username and password required"}), 400

    # Find user by email or username
    user = User.query.filter(
        (User.email == email_or_username) | (User.username == email_or_username)
    ).first()

    if not user or not user.check_password(password):
        log_audit('LOGIN_FAILED', 'User', None, f'Failed login attempt for {email_or_username}')
        return jsonify({"error": "Invalid email/username or password"}), 401

    if not user.is_active:
        return jsonify({"error": "Account is deactivated"}), 403

    # Generate JWT token (using Neon Auth's token format or create our own)
    import jwt
    import os
    from datetime import datetime, timedelta
    
    # Use a secret key for signing JWT
    secret_key = os.environ.get('JWT_SECRET_KEY') or os.environ.get('SECRET_KEY') or 'dev-secret-key'
    
    token_payload = {
        'sub': str(user.id),
        'email': user.email,
        'username': user.username,
        'roles': [user.role.value] if user.role else ['donor'],
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=30 if remember_me else 1)
    }
    
    token = jwt.encode(token_payload, secret_key, algorithm='HS256')
    
    log_audit('LOGIN', 'User', user.id, f'User {user.username} logged in via JWT API')

    return jsonify({
        'accessToken': token,
        'refreshToken': token,  # Same token for simplicity; in production use separate refresh token
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role.value if user.role else None
        },
        'message': 'Login successful'
    }), 200


@api_jwt_bp.route('/users/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current authenticated user info"""
    return jsonify({
        'id': request.neon_user['id'],
        'email': request.neon_user['email'],
        'username': request.neon_user['username'],
        'roles': request.neon_user['roles']
    })


@api_jwt_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint (no auth required)"""
    return jsonify({"status": "healthy", "service": "blood-donor-api"})