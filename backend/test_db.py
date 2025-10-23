import sqlite3

DATABASE = 'perfumes.db'

try:
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Test perfumes
    cursor.execute("SELECT COUNT(*) FROM perfumes")
    perfume_count = cursor.fetchone()[0]
    print(f"[OK] Perfumes in database: {perfume_count}")
    
    # Test notes
    cursor.execute("SELECT COUNT(*) FROM notes")
    note_count = cursor.fetchone()[0]
    print(f"[OK] Notes in database: {note_count}")
    
    # Test relationships
    cursor.execute("SELECT COUNT(*) FROM perfume_notes")
    relation_count = cursor.fetchone()[0]
    print(f"[OK] Perfume-Note relationships: {relation_count}")
    
    # Show sample perfume
    cursor.execute("SELECT id, name, brand FROM perfumes LIMIT 3")
    print("\nSample perfumes:")
    for row in cursor.fetchall():
        print(f"  - {row[1]} by {row[2]} (ID: {row[0]})")
    
    # Show sample notes
    cursor.execute("SELECT name, type FROM notes LIMIT 5")
    print("\nSample notes:")
    for row in cursor.fetchall():
        print(f"  - {row[0]} ({row[1]})")
    
    conn.close()
    print("\n[SUCCESS] Database is working correctly!")
    
except Exception as e:
    print(f"[ERROR] Database error: {e}")
