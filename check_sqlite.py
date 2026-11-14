import sqlite3
conn = sqlite3.connect('blood_donation.db')
cursor = conn.cursor()
cursor.execute('SELECT name FROM sqlite_master WHERE type="table"')
tables = cursor.fetchall()
print('Tables:', tables)
for table in tables:
    cursor.execute('SELECT COUNT(*) FROM ' + table[0])
    count = cursor.fetchone()[0]
    print(table[0] + ': ' + str(count) + ' rows')
conn.close()