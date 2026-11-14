import os
import sys

# Use the old SQLite database
os.environ['DATABASE_URL'] = 'sqlite:///blood_donation.db'

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app import create_app, db
from app.models import (
    User, DonorProfile, RecipientProfile, Donation, BloodRequest,
    BloodInventory, Notification, AuditLog, BloodGroup,
    UserRole, EligibilityStatus, DonationStatus, RequestStatus,
    UrgencyLevel, ComponentType
)

# Create the old app with SQLite - this will create tables
old_app = create_app()

# Create new app with Neon PostgreSQL
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_zdXQOfxrt6I0@ep-sweet-math-b4bpoi0e-pooler.c-6.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
new_app = create_app()

# Create tables in SQLite first
with old_app.app_context():
    db.create_all()
    print("SQLite tables created")

def migrate_table(old_model, new_model, transform_func=None):
    """Migrate data from old model to new model."""
    with old_app.app_context():
        records = old_model.query.all()
        print(f"Found {len(records)} records in {old_model.__name__}")
    
    if not records:
        return
    
    with new_app.app_context():
        for record in records:
            if transform_func:
                new_record = transform_func(record)
            else:
                attrs = {c.name: getattr(record, c.name) for c in record.__table__.columns}
                attrs.pop('id', None)
                new_record = new_model(**attrs)
            
            # Check if record already exists
            unique_cols = [c for c in new_model.__table__.columns if c.unique]
            if unique_cols:
                filter_kwargs = {c.name: getattr(new_record, c.name) for c in unique_cols}
                existing = new_model.query.filter_by(**filter_kwargs).first()
            else:
                existing = None
            
            if not existing:
                db.session.add(new_record)
        
        try:
            db.session.commit()
            print(f"Migrated {len(records)} records to {new_model.__name__}")
        except Exception as e:
            db.session.rollback()
            print(f"Error migrating {new_model.__name__}: {e}")

# Migration order matters due to foreign keys
print("Migrating users...")
migrate_table(User, User)

# BloodGroup already seeded, skip

print("Migrating donor_profiles...")
from app.models import DonorProfile
migrate_table(DonorProfile, DonorProfile)

print("Migrating recipient_profiles...")
from app.models import RecipientProfile
migrate_table(RecipientProfile, RecipientProfile)

print("Migrating donations...")
from app.models import Donation
migrate_table(Donation, Donation)

print("Migrating blood_requests...")
from app.models import BloodRequest
migrate_table(BloodRequest, BloodRequest)

print("Migrating blood_inventory...")
from app.models import BloodInventory
migrate_table(BloodInventory, BloodInventory)

print("Migrating notifications...")
from app.models import Notification
migrate_table(Notification, Notification)

print("Migrating audit_logs...")
from app.models import AuditLog
migrate_table(AuditLog, AuditLog)

print("Migration complete!")