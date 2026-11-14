import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor

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
pg_cursor = pg_conn.cursor(cursor_factory=RealDictCursor)

def migrate_table(table_name, cols_to_insert=None, id_col='id', conflict_cols=None):
    """Migrate data from SQLite to PostgreSQL with type conversions."""
    sqlite_cursor.execute(f'SELECT * FROM {table_name}')
    rows = sqlite_cursor.fetchall()
    print(f"Found {len(rows)} rows in {table_name}")
    
    if not rows:
        return
    
    # Get all columns except id
    all_cols = [col for col in rows[0].keys() if col != 'id']
    
    if cols_to_insert:
        cols = cols_to_insert
    else:
        cols = all_cols
    
    for row in rows:
        # Convert row to dict with type conversions
        values = []
        for col in cols:
            val = row[col]
            # Convert boolean from int to bool
            if isinstance(val, int) and val in (0, 1):
                val = bool(val)
            values.append(val)
        
        # Build insert query
        placeholders = ', '.join(['%s'] * len(cols))
        cols_str = ', '.join(cols)
        
        conflict_str = ''
        if table_name == 'users':
            conflict_str = ' ON CONFLICT (username, email) DO NOTHING'
        elif table_name == 'blood_groups':
            conflict_str = ' ON CONFLICT (name) DO NOTHING'
        
        query = f'INSERT INTO {table_name} ({cols_str}) VALUES ({placeholders}){conflict_str}'
        
        try:
            pg_cursor.execute(query, values)
            pg_conn.commit()
        except Exception as e:
            pg_conn.rollback()
            print(f"Error inserting row {row.get('id', '?')}: {e}")
    
    print(f"Migrated {table_name}")

# Migrate users with boolean conversion
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
               ON CONFLICT (username, email) DO NOTHING'''
    
    try:
        pg_cursor.execute(query, values)
        pg_conn.commit()
    except Exception as e:
        pg_conn.rollback()
        print(f"Error inserting user: {e}")

print("Migrated users")

# Migrate blood_groups (skip, already seeded)
print("Skipping blood_groups (already seeded)")

# Migrate donor_profiles
sqlite_cursor.execute('SELECT * FROM donor_profiles')
rows = sqlite_cursor.fetchall()
print(f"Found {len(rows)} rows in donor_profiles")

for row in rows:
    vals = []
    for col in ['user_id', 'full_name', 'date_of_birth', 'gender', 'phone', 'address', 'city', 'blood_group', 'rh_factor', 'weight', 'height', 'emergency_contact', 'last_donation_date', 'next_eligible_date', 'eligibility_status', 'availability_status', 'medical_screening', 'created_at', 'updated_at']:
        val = row[col]
        if val is not None and isinstance(val, str) and len(val) > 255 and col in ['address', 'medical_screening']:
            val = val[:255]
        if col == 'blood_group' and val and len(val) > 5:
            val = val[:5]
        if col == 'rh_factor' and val and len(val) > 10:
            val = val[:10]
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
        print(f"Error inserting donor_profile {row.get('id')}: {e}")

print("Migrated donor_profiles")

# Migrate recipient_profiles
sqlite_cursor.execute('SELECT * FROM recipient_profiles')
rows = sqlite_cursor.fetchall()
print(f"Found {len(rows)} rows in recipient_profiles")

for row in rows:
    vals = []
    for col in ['user_id', 'full_name', 'date_of_birth', 'gender', 'phone', 'city', 'hospital', 'emergency_contact', 'created_at', 'updated_at']:
        val = row[col]
        if isinstance(val, int) and val in (0, 1):
            val = bool(val)
        vals.append(val)
    
    query = '''INSERT INTO recipient_profiles (user_id, full_name, date_of_birth, gender, phone, city, hospital, emergency_contact, created_at, updated_at)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
    
    try:
        pg_cursor.execute(query, vals)
        pg_conn.commit()
    except Exception as e:
        pg_conn.rollback()
        print(f"Error inserting recipient_profile: {e}")

print("Migrated recipient_profiles")

# Migrate other tables (they're empty)
for table in ['donations', 'blood_requests', 'blood_inventory', 'notifications', 'audit_logs']:
    print(f"Skipping {table} (empty or needs users)")

print("Migration complete!")