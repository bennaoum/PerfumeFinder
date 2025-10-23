import sqlite3
import json

DATABASE = 'perfumes.db'

def init_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Drop existing tables
    cursor.execute('DROP TABLE IF EXISTS perfume_notes')
    cursor.execute('DROP TABLE IF EXISTS notes')
    cursor.execute('DROP TABLE IF EXISTS perfumes')
    
    # Create perfumes table
    cursor.execute('''
        CREATE TABLE perfumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            year INTEGER,
            gender TEXT NOT NULL,
            family TEXT NOT NULL,
            description TEXT,
            image_url TEXT
        )
    ''')
    
    # Create notes table
    cursor.execute('''
        CREATE TABLE notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('top', 'middle', 'base'))
        )
    ''')
    
    # Create perfume_notes junction table
    cursor.execute('''
        CREATE TABLE perfume_notes (
            perfume_id INTEGER NOT NULL,
            note_id INTEGER NOT NULL,
            weight REAL DEFAULT 1.0,
            PRIMARY KEY (perfume_id, note_id),
            FOREIGN KEY (perfume_id) REFERENCES perfumes(id),
            FOREIGN KEY (note_id) REFERENCES notes(id)
        )
    ''')
    
    # Seed perfumes data
    perfumes_data = [
        {
            'name': 'Sauvage',
            'brand': 'Dior',
            'year': 2015,
            'gender': 'Men',
            'family': 'Woody Aromatic',
            'description': 'A radically fresh composition, dictated by a name that has become legendary.',
            'image_url': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
            'notes': {
                'top': ['Calabrian Bergamot', 'Pepper'],
                'middle': ['Sichuan Pepper', 'Lavender', 'Pink Pepper', 'Vetiver'],
                'base': ['Ambroxan', 'Cedar', 'Labdanum']
            }
        },
        {
            'name': 'Bleu de Chanel',
            'brand': 'Chanel',
            'year': 2010,
            'gender': 'Men',
            'family': 'Woody Aromatic',
            'description': 'An aromatic-woody fragrance that reveals the spirit of a man who chooses his own destiny.',
            'image_url': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400',
            'notes': {
                'top': ['Grapefruit', 'Lemon', 'Mint', 'Pink Pepper'],
                'middle': ['Ginger', 'Nutmeg', 'Jasmine'],
                'base': ['Incense', 'Vetiver', 'Cedar', 'Sandalwood', 'Patchouli']
            }
        },
        {
            'name': 'La Vie Est Belle',
            'brand': 'Lancôme',
            'year': 2012,
            'gender': 'Women',
            'family': 'Floral Fruity Gourmand',
            'description': 'A fragrance of freedom and happiness, a celebration of life.',
            'image_url': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400',
            'notes': {
                'top': ['Black Currant', 'Pear'],
                'middle': ['Iris', 'Jasmine', 'Orange Blossom'],
                'base': ['Praline', 'Vanilla', 'Patchouli', 'Tonka Bean']
            }
        },
        {
            'name': 'Aventus',
            'brand': 'Creed',
            'year': 2010,
            'gender': 'Men',
            'family': 'Fruity Chypre',
            'description': 'A sophisticated blend for the bold, spirited individual.',
            'image_url': 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
            'notes': {
                'top': ['Pineapple', 'Bergamot', 'Black Currant', 'Apple'],
                'middle': ['Birch', 'Patchouli', 'Moroccan Jasmine', 'Rose'],
                'base': ['Musk', 'Oakmoss', 'Ambergris', 'Vanilla']
            }
        },
        {
            'name': 'Black Opium',
            'brand': 'Yves Saint Laurent',
            'year': 2014,
            'gender': 'Women',
            'family': 'Oriental Vanilla',
            'description': 'The shock of a forbidden fruit entangled with the rich warmth of coffee and vanilla.',
            'image_url': 'https://images.unsplash.com/photo-1588405748879-acb0738e1466?w=400',
            'notes': {
                'top': ['Pear', 'Pink Pepper', 'Orange Blossom'],
                'middle': ['Coffee', 'Jasmine', 'Bitter Almond', 'Licorice'],
                'base': ['Vanilla', 'Patchouli', 'Cedar', 'Cashmere Wood']
            }
        },
        {
            'name': 'Acqua di Giò',
            'brand': 'Giorgio Armani',
            'year': 1996,
            'gender': 'Men',
            'family': 'Aquatic Aromatic',
            'description': 'A fresh and aquatic fragrance inspired by the island of Pantelleria.',
            'image_url': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400',
            'notes': {
                'top': ['Calabrian Bergamot', 'Neroli', 'Green Tangerine'],
                'middle': ['Sea Notes', 'Jasmine', 'Rosemary', 'Persimmon'],
                'base': ['White Musk', 'Cedar', 'Patchouli', 'Amber']
            }
        },
        {
            'name': 'Miss Dior',
            'brand': 'Dior',
            'year': 2017,
            'gender': 'Women',
            'family': 'Floral',
            'description': 'A vibrant, pointillist fragrance with explosive notes of blood orange.',
            'image_url': 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400',
            'notes': {
                'top': ['Blood Orange', 'Mandarin Orange'],
                'middle': ['Rose', 'Peony', 'Lily-of-the-Valley'],
                'base': ['White Musk', 'Patchouli', 'Benzoin']
            }
        },
        {
            'name': 'One Million',
            'brand': 'Paco Rabanne',
            'year': 2008,
            'gender': 'Men',
            'family': 'Woody Spicy',
            'description': 'A fresh and sparkling fragrance for a self-confident man.',
            'image_url': 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400',
            'notes': {
                'top': ['Grapefruit', 'Mint', 'Blood Mandarin'],
                'middle': ['Cinnamon', 'Rose', 'Spice Notes'],
                'base': ['Amber', 'Leather', 'Patchouli', 'White Woods']
            }
        },
        {
            'name': 'Coco Mademoiselle',
            'brand': 'Chanel',
            'year': 2001,
            'gender': 'Women',
            'family': 'Chypre Floral',
            'description': 'An ambery fragrance with a bold character and surprising freshness.',
            'image_url': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
            'notes': {
                'top': ['Orange', 'Mandarin Orange', 'Orange Blossom', 'Bergamot'],
                'middle': ['Mimosa', 'Jasmine', 'Turkish Rose', 'Ylang-Ylang'],
                'base': ['Tonka Bean', 'Patchouli', 'Opoponax', 'Vanilla', 'Vetiver', 'White Musk']
            }
        },
        {
            'name': 'Light Blue',
            'brand': 'Dolce & Gabbana',
            'year': 2001,
            'gender': 'Women',
            'family': 'Fruity Floral',
            'description': 'A fresh, fruity-floral scent that evokes the spirit of sensuality and zest for life.',
            'image_url': 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400',
            'notes': {
                'top': ['Sicilian Lemon', 'Apple', 'Cedar', 'Bluebell'],
                'middle': ['Bamboo', 'Jasmine', 'White Rose'],
                'base': ['Cedar', 'Amber', 'Musk']
            }
        },
        {
            'name': 'Eros',
            'brand': 'Versace',
            'year': 2012,
            'gender': 'Men',
            'family': 'Aromatic Fougere',
            'description': 'A fragrance for a strong, passionate man, master of himself.',
            'image_url': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400',
            'notes': {
                'top': ['Mint', 'Green Apple', 'Lemon'],
                'middle': ['Tonka Bean', 'Ambroxan', 'Geranium'],
                'base': ['Vanilla', 'Vetiver', 'Oakmoss', 'Cedar', 'Atlas Cedar']
            }
        },
        {
            'name': 'Flowerbomb',
            'brand': 'Viktor & Rolf',
            'year': 2005,
            'gender': 'Women',
            'family': 'Floral Oriental',
            'description': 'An explosion of flowers that makes everything seem possible.',
            'image_url': 'https://images.unsplash.com/photo-1588405748879-acb0738e1466?w=400',
            'notes': {
                'top': ['Tea', 'Bergamot', 'Osmanthus'],
                'middle': ['Sambac Jasmine', 'Orchid', 'Freesia', 'Rose'],
                'base': ['Patchouli', 'Musk', 'Amber']
            }
        },
        {
            'name': 'The One',
            'brand': 'Dolce & Gabbana',
            'year': 2006,
            'gender': 'Women',
            'family': 'Oriental Floral',
            'description': 'A sophisticated fragrance that exudes elegance and sensuality.',
            'image_url': 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
            'notes': {
                'top': ['Bergamot', 'Mandarin Orange', 'Lychee', 'Peach'],
                'middle': ['Lily', 'Plum', 'Jasmine', 'Madonna Lily'],
                'base': ['Vanilla', 'Musk', 'Amber', 'Vetiver']
            }
        },
        {
            'name': 'Invictus',
            'brand': 'Paco Rabanne',
            'year': 2013,
            'gender': 'Men',
            'family': 'Woody Aquatic',
            'description': 'A fragrance of victory that embodies two forces: beastly freshness and animal sensuality.',
            'image_url': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400',
            'notes': {
                'top': ['Sea Notes', 'Grapefruit', 'Mandarin Orange'],
                'middle': ['Bay Leaf', 'Jasmine', 'Hedione'],
                'base': ['Ambergris', 'Guaiac Wood', 'Oakmoss', 'Patchouli']
            }
        },
        {
            'name': 'Good Girl',
            'brand': 'Carolina Herrera',
            'year': 2016,
            'gender': 'Women',
            'family': 'Oriental Floral',
            'description': 'A captivating blend that celebrates the duality of the modern woman.',
            'image_url': 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400',
            'notes': {
                'top': ['Almond', 'Coffee', 'Lemon'],
                'middle': ['Tuberose', 'Jasmine', 'Bulgarian Rose'],
                'base': ['Tonka Bean', 'Cacao', 'Vanilla', 'Sandalwood', 'Cedar', 'Cinnamon']
            }
        }
    ]
    
    # Insert perfumes and notes
    note_id_map = {}
    
    for perfume_data in perfumes_data:
        # Insert perfume
        cursor.execute('''
            INSERT INTO perfumes (name, brand, year, gender, family, description, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            perfume_data['name'],
            perfume_data['brand'],
            perfume_data['year'],
            perfume_data['gender'],
            perfume_data['family'],
            perfume_data['description'],
            perfume_data['image_url']
        ))
        
        perfume_id = cursor.lastrowid
        
        # Insert notes and link to perfume
        for note_type, notes in perfume_data['notes'].items():
            for note_name in notes:
                # Check if note already exists
                if note_name not in note_id_map:
                    cursor.execute('''
                        INSERT INTO notes (name, type)
                        VALUES (?, ?)
                    ''', (note_name, note_type))
                    note_id_map[note_name] = cursor.lastrowid
                
                note_id = note_id_map[note_name]
                
                # Link perfume to note (use INSERT OR IGNORE to avoid duplicates)
                weight = 1.0 if note_type == 'top' else 0.8 if note_type == 'middle' else 0.6
                cursor.execute('''
                    INSERT OR IGNORE INTO perfume_notes (perfume_id, note_id, weight)
                    VALUES (?, ?, ?)
                ''', (perfume_id, note_id, weight))
    
    conn.commit()
    conn.close()
    
    print(f"Database initialized successfully!")
    print(f"Added {len(perfumes_data)} perfumes")
    print(f"Added {len(note_id_map)} unique notes")

if __name__ == '__main__':
    init_database()
