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

# Helper function to migrate a table
def migrate_table(table_name, columns, conflict_columns=None):
    """Migrate data from SQLite to PostgreSQL."""
    sqlite_cursor.execute(f'SELECT * FROM {table_name}')
    rows = sqlite_cursor.fetchall()
    print(f"Found {len(rows)} rows in {table_name}")
    
    if not rows:
        return
    
    cols = [col for col in rows[0].keys() if col != 'id']
    
    for row in rows:
        values = [row[col] for col in cols]
        placeholders = ', '.join(['%s'] * len(cols))
        cols_str = ', '.join(cols)
        
        if table_name == 'users':
            # Check for existing user by username or email
            cur = pg_conn.cursor()
            cur.execute('SELECT id FROM users WHERE username = %s OR email = %s', (row['username'], row['email']))
            if cur.fetchone():
                print(f"Skipping existing user: {row['username']}")
                continue
        
        # Build insert query
        conflict_str = ''
        if table_name == 'users':
            conflict_str = ' ON CONFLICT (username, email) DO NOTHING'
        elif table_name == 'blood_groups':
            conflict_str = ' ON CONFLICT (name) DO NOTHING'
        
        query = f'INSERT INTO {table_name} ({", ".join(cols)}) VALUES ({placeholders}){conflict_str}'
        
        try:
            pg_cursor.execute(query, [row[col] for col in row.keys() if col != 'id'])
        except Exception as e:
            print(f"Error inserting into {table_name}: {e}")
    
    pg_conn.commit()
    print(f"Migrated {table_name}")

# Migrate in order of dependencies
tables_order = [
    'users',
    'blood_groups',
    'donor_profiles',
    'recipient_profiles',
    'donations',
    'blood_requests',
    'blood_inventory',
    'notifications',
    'audit_logs'
]

for table in tables_order:
    try:
        migrate_table(table, table)
    except Exception as e:
        print(f"Error migrating {table}: {e}")

print("Migration complete!")