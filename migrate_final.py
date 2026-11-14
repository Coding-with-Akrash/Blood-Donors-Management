import sqlite3
import psycopg2

# Connect to SQLite
sqlite_conn = sqlite3.connect('blood_donation.db')
sqlite_conn.row_factory = sqlite3.Row
sqlite_cursor = sqlite_conn.cursor()

# Connect to Neon PostgreSQL
pg_conn = psycopg2.connect(
    host='ep-sweet-math-b4bpoi0e-pooler.c-6.us-east-2.aws.neon.tech',
    port=5432,
    database='neondb',
    user='neondb_owner',
    password='npg_zdXQOfxrt6I0',
    sslmode='require'
)
pg_cursor = pg_conn.cursor()

# Migrate users
print("Migrating users...")
sqlite_cursor.execute('SELECT * FROM users')
rows = sqlite_cursor.fetchall()
print(f"Found {len(rows)} rows in users")

for row in rows:
    values = []
    for col in ['username', 'email', 'password_hash', 'role', 'is_active', 'created_at', 'updated_at', 'last_login']:
        val = row[col]
        if isinstance(val, int) and val in (0, 1):
            val = bool(val)
        values.append(val)
    
    query = '''INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at, last_login)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
               ON CONFLICT (username) DO NOTHING'''
    
    try:
        pg_cursor.execute(query, values)
        pg_conn.commit()
    except Exception as e:
        pg_conn.rollback()
        print(f"Error inserting user {row['username']}: {e}")

print("Migrated users")

# Skip blood_groups (already seeded)
print("Skipping blood_groups (already seeded)")

# Migrate donor_profiles
print("Migrating donor_profiles...")
sqlite_cursor.execute('SELECT * FROM donor_profiles')
rows = sqlite_cursor.fetchall()
print(f"Found {len(rows)} rows in donor_profiles")

for row in rows:
    vals = []
    for col in ['user_id', 'full_name', 'date_of_birth', 'gender', 'phone', 'address', 'city', 'blood_group', 'rh_factor', 'weight', 'height', 'emergency_contact', 'last_donation_date', 'next_eligible_date', 'eligibility_status', 'availability_status', 'medical_screening', 'created_at', 'updated_at']:
        val = row[col]
        # Handle string truncation
        if val is not None and isinstance(val, str):
            if col == 'rh_factor' and len(val) > 5:
                val = val[:5]  # Truncate to 5 chars (Posit/Negat)
            elif col == 'blood_group' and len(val) > 5:
                val = val[:5]
            elif col in ['address', 'medical_screening'] and len(val) > 255:
                val = val[:255]
        if isinstance(val, int) and val in (0, 1):
            val = bool(val)
        vals.append(val)
    
    query = '''INSERT INTO donor_profiles (user_id, full_name, date_of_birth, gender, phone, address, city, blood_group, rh_factor, weight, height, emergency_contact, last_donation_date, next_eligible_date, eligibility_status, availability_status, medical_screening, created_at, updated_at)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
    
    try:
        pg_cursor.execute(query, vals)
        pg_conn.commit()
    except Exception as e:
        pg_conn.rollback()
        print(f"Error inserting donor_profile id={row['id']}: {e}")

print("Migrated donor_profiles")

# Migrate other tables (empty)
for table in ['recipient_profiles', 'donations', 'blood_requests', 'blood_inventory', 'notifications', 'audit_logs']:
    print(f"Skipping {table} (empty or needs users)")

print("Migration complete!")