import kagglehub
import pandas as pd
import sqlite3
import os
import re
import requests
from bs4 import BeautifulSoup
import time

DATABASE = 'perfumes.db'

print("=" * 70)
print("IMPORTING FRAGRANTICA WITH REAL PERFUME IMAGES")
print("=" * 70)

# Download dataset
print("\n[Step 1/7] Downloading dataset...")
path = kagglehub.dataset_download("olgagmiufana1/fragrantica-com-fragrance-dataset")
print(f"[OK] Dataset ready")

# Load CSV
print("\n[Step 2/7] Loading dataset...")
csv_file = os.path.join(path, 'fra_cleaned.csv')
df = pd.read_csv(csv_file, encoding='latin-1', delimiter=';')
df = df.dropna(subset=['Perfume', 'Brand'])
df = df.drop_duplicates(subset=['Perfume', 'Brand'])
print(f"[OK] Loaded {len(df)} unique perfumes")

# Function to get real perfume image
def get_perfume_image(perfume_name, brand_name, fragrantica_url=None):
    """
    Try to get real perfume image from Fragrantica or other sources
    """
    # Clean names
    perfume_clean = perfume_name.lower().replace(' ', '-').replace("'", "")
    brand_clean = brand_name.lower().replace(' ', '-').replace("'", "")
    
    # Try Fragrantica URL first
    if fragrantica_url and isinstance(fragrantica_url, str) and fragrantica_url.startswith('http'):
        try:
            response = requests.get(fragrantica_url, timeout=5, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Look for perfume bottle image
                img_tags = soup.find_all('img', {'itemprop': 'image'})
                if img_tags:
                    img_url = img_tags[0].get('src')
                    if img_url:
                        return img_url
                
                # Fallback: look for any large image
                img_tags = soup.find_all('img')
                for img in img_tags:
                    src = img.get('src', '')
                    if 'bottle' in src or 'perfume' in src or '200x200' in src:
                        return src
        except Exception as e:
            pass
    
    # Construct Fragrantica image URL pattern
    # Many Fragrantica images follow this pattern
    fragrantica_img = f"https://fimgs.net/mdimg/perfume/375x500.{perfume_clean.replace('-', '')}.jpg"
    
    # Try the constructed URL
    try:
        response = requests.head(fragrantica_img, timeout=3)
        if response.status_code == 200:
            return fragrantica_img
    except:
        pass
    
    # Generic fallback based on gender/type
    fallback_images = {
        'Men': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        'Women': 'https://images.unsplash.com/photo-1588405748879-acb0738e1466?w=400',
        'Unisex': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'
    }
    
    return fallback_images.get('Unisex')

# Map functions
def map_gender(gender_val):
    if pd.isna(gender_val):
        return 'Unisex'
    gender_val = str(gender_val).lower().strip()
    if 'women' in gender_val or 'female' in gender_val:
        return 'Women'
    elif 'men' in gender_val or 'male' in gender_val:
        return 'Men'
    else:
        return 'Unisex'

def map_family(row):
    accord1 = str(row.get('mainaccord1', '')).lower()
    accord2 = str(row.get('mainaccord2', '')).lower()
    
    if 'woody' in accord1 or 'woody' in accord2:
        if 'aromatic' in accord1 or 'aromatic' in accord2:
            return 'Woody Aromatic'
        elif 'spicy' in accord1 or 'spicy' in accord2:
            return 'Woody Spicy'
        return 'Woody'
    elif 'floral' in accord1 or 'floral' in accord2:
        if 'fruity' in accord1 or 'fruity' in accord2:
            return 'Floral Fruity'
        elif 'oriental' in accord1:
            return 'Floral Oriental'
        return 'Floral'
    elif 'oriental' in accord1:
        if 'vanilla' in accord2:
            return 'Oriental Vanilla'
        elif 'spicy' in accord2:
            return 'Oriental Spicy'
        return 'Oriental'
    elif 'fresh' in accord1 or 'citrus' in accord1 or 'aquatic' in accord1:
        return 'Fresh Aquatic'
    elif 'fruity' in accord1:
        return 'Fruity'
    elif 'aromatic' in accord1:
        return 'Aromatic'
    else:
        return 'Other'

def parse_notes(notes_str):
    if pd.isna(notes_str):
        return []
    notes = re.split(r'[,;]', str(notes_str))
    notes = [n.strip().title() for n in notes if n.strip() and len(n.strip()) > 2]
    return notes[:5]

# Connect to database
print("\n[Step 3/7] Connecting to database...")
conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

cursor.execute("SELECT COUNT(*) FROM perfumes")
initial_count = cursor.fetchone()[0]
print(f"[OK] Current: {initial_count} perfumes")

# Prepare data
print("\n[Step 4/7] Preparing perfumes...")
df_filtered = df[df['Rating Count'] > 50].copy()
df_filtered = df_filtered.sort_values('Rating Count', ascending=False)
# Import NEXT 100 perfumes (rows 100-200)
df_import = df_filtered.iloc[100:200]

print(f"\nWill import NEXT 100 popular perfumes (rows 100-200)")
print("This will fetch REAL images from Fragrantica!")
print(f"\nCurrent: {initial_count} perfumes")
print(f"After: ~{initial_count + 100} perfumes")

response = input("\nProceed with import? (yes/no): ").lower()
if response != 'yes':
    print("Import cancelled.")
    conn.close()
    exit(0)

# Install beautifulsoup4 if needed
print("\n[Step 5/7] Checking dependencies...")
try:
    from bs4 import BeautifulSoup
except:
    print("Installing beautifulsoup4...")
    os.system('py -m pip install beautifulsoup4 -q')
    from bs4 import BeautifulSoup

print("[OK] Dependencies ready")

# Import perfumes with real images
print("\n[Step 6/7] Importing perfumes with real images...")
print("(This may take a few minutes - fetching images from web)")

cursor.execute("SELECT name, id FROM notes")
note_id_map = {row[0]: row[1] for row in cursor.fetchall()}

imported = 0
skipped = 0
errors = 0

for idx, row in df_import.iterrows():
    try:
        name = str(row['Perfume']).strip()
        brand = str(row['Brand']).strip()
        
        # Skip if exists
        cursor.execute("SELECT id FROM perfumes WHERE name = ? AND brand = ?", (name, brand))
        if cursor.fetchone():
            skipped += 1
            continue
        
        year = int(row['Year']) if not pd.isna(row['Year']) and str(row['Year']).isdigit() else 2020
        gender = map_gender(row['Gender'])
        family = map_family(row)
        
        # Create description
        accords = [row.get(f'mainaccord{i}', '') for i in range(1, 4)]
        accords = [str(a).title() for a in accords if not pd.isna(a) and str(a) != 'nan']
        description = f"A {', '.join(accords[:3])} fragrance." if accords else "A captivating fragrance."
        
        # Get REAL image URL
        fragrantica_url = row.get('url', None)
        print(f"\n  [{imported+1}/100] {name} by {brand}")
        print(f"    Fetching image...", end='', flush=True)
        
        image_url = get_perfume_image(name, brand, fragrantica_url)
        
        if image_url and 'unsplash' not in image_url:
            print(f" [REAL IMAGE]")
        else:
            print(f" [Generic]")
        
        # Insert perfume
        cursor.execute('''
            INSERT INTO perfumes (name, brand, year, gender, family, description, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (name, brand, year, gender, family, description, image_url))
        
        perfume_id = cursor.lastrowid
        
        # Add notes
        top_notes = parse_notes(row.get('Top', ''))
        middle_notes = parse_notes(row.get('Middle', ''))
        base_notes = parse_notes(row.get('Base', ''))
        
        for note_name in top_notes:
            if note_name not in note_id_map:
                cursor.execute("INSERT INTO notes (name, type) VALUES (?, ?)", (note_name, 'top'))
                note_id_map[note_name] = cursor.lastrowid
            cursor.execute('INSERT OR IGNORE INTO perfume_notes (perfume_id, note_id, weight) VALUES (?, ?, ?)',
                         (perfume_id, note_id_map[note_name], 1.0))
        
        for note_name in middle_notes:
            if note_name not in note_id_map:
                cursor.execute("INSERT INTO notes (name, type) VALUES (?, ?)", (note_name, 'middle'))
                note_id_map[note_name] = cursor.lastrowid
            cursor.execute('INSERT OR IGNORE INTO perfume_notes (perfume_id, note_id, weight) VALUES (?, ?, ?)',
                         (perfume_id, note_id_map[note_name], 0.8))
        
        for note_name in base_notes:
            if note_name not in note_id_map:
                cursor.execute("INSERT INTO notes (name, type) VALUES (?, ?)", (note_name, 'base'))
                note_id_map[note_name] = cursor.lastrowid
            cursor.execute('INSERT OR IGNORE INTO perfume_notes (perfume_id, note_id, weight) VALUES (?, ?, ?)',
                         (perfume_id, note_id_map[note_name], 0.6))
        
        imported += 1
        
        if imported % 10 == 0:
            conn.commit()
        
        # Small delay to be respectful to Fragrantica
        time.sleep(0.5)
    
    except Exception as e:
        errors += 1
        print(f"    [ERROR] {e}")
        continue

conn.commit()

cursor.execute("SELECT COUNT(*) FROM perfumes")
final_count = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM notes")
notes_count = cursor.fetchone()[0]

conn.close()

print(f"\n[Step 7/7] Import complete!")
print(f"\n{'=' * 70}")
print("IMPORT SUMMARY")
print(f"{'=' * 70}")
print(f"[OK] Successfully imported: {imported} perfumes")
print(f"[SKIP] Already existed: {skipped} perfumes")
print(f"[ERROR] Failed imports: {errors} perfumes")
print(f"\nDatabase stats:")
print(f"  - Total perfumes: {final_count} (was {initial_count})")
print(f"  - Total notes: {notes_count}")
print(f"\n[SUCCESS] Perfumes imported with REAL images from Fragrantica!")
print(f"{'=' * 70}")
