from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import json

app = Flask(__name__)
CORS(app)

DATABASE = 'perfumes.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def dict_from_row(row):
    return dict(zip(row.keys(), row))

@app.route('/api/perfumes', methods=['GET'])
def get_perfumes():
    """Get all perfumes or search by name"""
    search = request.args.get('search', '')
    gender = request.args.get('gender', '')
    family = request.args.get('family', '')
    
    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM perfumes WHERE 1=1"
    params = []
    
    if search:
        query += " AND (name LIKE ? OR brand LIKE ?)"
        params.extend([f'%{search}%', f'%{search}%'])
    
    if gender and gender != 'All':
        query += " AND gender = ?"
        params.append(gender)
    
    if family and family != 'All':
        query += " AND family = ?"
        params.append(family)
    
    cursor.execute(query, params)
    perfumes = [dict_from_row(row) for row in cursor.fetchall()]
    
    # Get notes for each perfume
    for perfume in perfumes:
        cursor.execute("""
            SELECT n.id, n.name, n.type, pn.weight
            FROM notes n
            JOIN perfume_notes pn ON n.id = pn.note_id
            WHERE pn.perfume_id = ?
            ORDER BY n.type, pn.weight DESC
        """, (perfume['id'],))
        perfume['notes'] = [dict_from_row(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(perfumes)

@app.route('/api/perfumes/<int:perfume_id>', methods=['GET'])
def get_perfume(perfume_id):
    """Get a single perfume by ID"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM perfumes WHERE id = ?", (perfume_id,))
    perfume = cursor.fetchone()
    
    if not perfume:
        conn.close()
        return jsonify({'error': 'Perfume not found'}), 404
    
    perfume = dict_from_row(perfume)
    
    # Get notes
    cursor.execute("""
        SELECT n.id, n.name, n.type, pn.weight
        FROM notes n
        JOIN perfume_notes pn ON n.id = pn.note_id
        WHERE pn.perfume_id = ?
        ORDER BY n.type, pn.weight DESC
    """, (perfume_id,))
    perfume['notes'] = [dict_from_row(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(perfume)

@app.route('/api/recommendations/<int:perfume_id>', methods=['GET'])
def get_recommendations(perfume_id):
    """Get perfume recommendations based on similarity"""
    limit = int(request.args.get('limit', 10))
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Get the target perfume
    cursor.execute("SELECT * FROM perfumes WHERE id = ?", (perfume_id,))
    target_perfume = cursor.fetchone()
    
    if not target_perfume:
        conn.close()
        return jsonify({'error': 'Perfume not found'}), 404
    
    target_perfume = dict_from_row(target_perfume)
    
    # Get all perfumes with their notes
    cursor.execute("SELECT * FROM perfumes WHERE id != ?", (perfume_id,))
    all_perfumes = [dict_from_row(row) for row in cursor.fetchall()]
    
    # Get notes for target perfume
    cursor.execute("""
        SELECT n.id, n.name, n.type, pn.weight
        FROM notes n
        JOIN perfume_notes pn ON n.id = pn.note_id
        WHERE pn.perfume_id = ?
    """, (perfume_id,))
    target_notes = [dict_from_row(row) for row in cursor.fetchall()]
    target_note_ids = set(note['id'] for note in target_notes)
    
    # Calculate similarity for each perfume
    similarities = []
    for perfume in all_perfumes:
        cursor.execute("""
            SELECT n.id, n.name, n.type, pn.weight
            FROM notes n
            JOIN perfume_notes pn ON n.id = pn.note_id
            WHERE pn.perfume_id = ?
        """, (perfume['id'],))
        perfume_notes = [dict_from_row(row) for row in cursor.fetchall()]
        perfume_note_ids = set(note['id'] for note in perfume_notes)
        
        # Calculate Jaccard similarity for notes
        intersection = len(target_note_ids & perfume_note_ids)
        union = len(target_note_ids | perfume_note_ids)
        note_similarity = intersection / union if union > 0 else 0
        
        # Bonus for same family
        family_bonus = 0.2 if perfume['family'] == target_perfume['family'] else 0
        
        # Bonus for same gender
        gender_bonus = 0.1 if perfume['gender'] == target_perfume['gender'] else 0
        
        # Total similarity score
        similarity_score = note_similarity + family_bonus + gender_bonus
        
        # Find shared notes
        shared_notes = [note['name'] for note in perfume_notes if note['id'] in target_note_ids]
        
        perfume['notes'] = perfume_notes
        perfume['similarity_score'] = round(similarity_score, 3)
        perfume['shared_notes'] = shared_notes
        
        similarities.append(perfume)
    
    # Sort by similarity and return top N
    similarities.sort(key=lambda x: x['similarity_score'], reverse=True)
    recommendations = similarities[:limit]
    
    conn.close()
    return jsonify(recommendations)

@app.route('/api/notes', methods=['GET'])
def get_notes():
    """Get all notes"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT DISTINCT name, type FROM notes ORDER BY type, name")
    notes = [dict_from_row(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(notes)

@app.route('/api/recommendations/by-notes', methods=['POST'])
def recommendations_by_notes():
    """Get perfume recommendations based on selected notes"""
    data = request.json
    selected_notes = data.get('notes', [])
    limit = data.get('limit', 10)
    gender = data.get('gender', '')
    family = data.get('family', '')
    
    if not selected_notes:
        return jsonify({'error': 'No notes provided'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Get all perfumes
    query = "SELECT * FROM perfumes WHERE 1=1"
    params = []
    
    if gender and gender != 'All':
        query += " AND gender = ?"
        params.append(gender)
    
    if family and family != 'All':
        query += " AND family = ?"
        params.append(family)
    
    cursor.execute(query, params)
    all_perfumes = [dict_from_row(row) for row in cursor.fetchall()]
    
    # Calculate match score for each perfume
    matches = []
    for perfume in all_perfumes:
        cursor.execute("""
            SELECT n.id, n.name, n.type, pn.weight
            FROM notes n
            JOIN perfume_notes pn ON n.id = pn.note_id
            WHERE pn.perfume_id = ?
        """, (perfume['id'],))
        perfume_notes = [dict_from_row(row) for row in cursor.fetchall()]
        perfume_note_names = [note['name'].lower() for note in perfume_notes]
        
        # Count matching notes
        matching_notes = [note for note in selected_notes if note.lower() in perfume_note_names]
        match_score = len(matching_notes) / len(selected_notes) if selected_notes else 0
        
        if match_score > 0:  # Only include perfumes with at least one matching note
            perfume['notes'] = perfume_notes
            perfume['match_score'] = round(match_score, 3)
            perfume['matching_notes'] = matching_notes
            matches.append(perfume)
    
    # Sort by match score
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    recommendations = matches[:limit]
    
    conn.close()
    return jsonify(recommendations)

@app.route('/api/random', methods=['GET'])
def get_random_perfume():
    """Get a random perfume (Surprise Me feature)"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM perfumes ORDER BY RANDOM() LIMIT 1")
    perfume = cursor.fetchone()
    
    if perfume:
        perfume = dict_from_row(perfume)
        cursor.execute("""
            SELECT n.id, n.name, n.type, pn.weight
            FROM notes n
            JOIN perfume_notes pn ON n.id = pn.note_id
            WHERE pn.perfume_id = ?
            ORDER BY n.type, pn.weight DESC
        """, (perfume['id'],))
        perfume['notes'] = [dict_from_row(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(perfume)

@app.route('/api/filters', methods=['GET'])
def get_filters():
    """Get available filter options"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT DISTINCT family FROM perfumes ORDER BY family")
    families = [row[0] for row in cursor.fetchall()]
    
    cursor.execute("SELECT DISTINCT gender FROM perfumes ORDER BY gender")
    genders = [row[0] for row in cursor.fetchall()]
    
    conn.close()
    return jsonify({'families': families, 'genders': genders})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
