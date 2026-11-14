import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = 'neon_auth.login'
login_manager.login_message_category = 'info'

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    
    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    from app.routes.donor import donor_bp
    from app.routes.recipient import recipient_bp
    from app.routes.staff import staff_bp
    from app.routes.admin import admin_bp
    from app.routes.api import api_bp
    from app.routes.api_jwt import api_jwt_bp
    from app.routes.reports import reports_bp
    from app.neon_auth import neon_auth_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(neon_auth_bp, url_prefix='/neon-auth')
    app.register_blueprint(donor_bp, url_prefix='/donor')
    app.register_blueprint(recipient_bp, url_prefix='/recipient')
    app.register_blueprint(staff_bp, url_prefix='/staff')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(api_jwt_bp)
    app.register_blueprint(reports_bp, url_prefix='/reports')
    
    from app.utils.errors import register_error_handlers
    register_error_handlers(app)
    
    @login_manager.user_loader
    def load_user(user_id):
        from app.models import User
        return User.query.get(int(user_id))
    
    return app