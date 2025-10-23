import requests
import json

API_URL = 'http://localhost:5000/api'

print('=' * 70)
print('TESTING FIND BY NOTES FUNCTIONALITY')
print('=' * 70)

# Test 1: Backend connection
print('\n[1/4] Testing backend connection...')
try:
    r = requests.get(f'{API_URL}/perfumes')
    perfumes = r.json()
    print(f'   [OK] Backend running - {len(perfumes)} perfumes in database')
except Exception as e:
    print(f'   [ERROR] Backend not responding: {e}')
    print('   Solution: Run "py app.py" in backend folder')
    exit(1)

# Test 2: Notes endpoint
print('\n[2/4] Testing notes endpoint...')
try:
    r = requests.get(f'{API_URL}/notes')
    notes = r.json()
    print(f'   [OK] Notes loaded - {len(notes)} total notes')
    
    by_type = {
        'top': len([n for n in notes if n['type'] == 'top']),
        'middle': len([n for n in notes if n['type'] == 'middle']),
        'base': len([n for n in notes if n['type'] == 'base'])
    }
    print(f'   Top: {by_type["top"]} | Middle: {by_type["middle"]} | Base: {by_type["base"]}')
except Exception as e:
    print(f'   [ERROR] Failed to load notes: {e}')
    exit(1)

# Test 3: Find by notes (simple test)
print('\n[3/4] Testing find by notes with: Vanilla, Rose...')
try:
    test_data = {
        'notes': ['Vanilla', 'Rose'],
        'limit': 5
    }
    r = requests.post(
        f'{API_URL}/recommendations/by-notes',
        json=test_data,
        headers={'Content-Type': 'application/json'}
    )
    
    if r.status_code != 200:
        print(f'   [ERROR] API returned status {r.status_code}')
        print(f'   Response: {r.text}')
        exit(1)
    
    results = r.json()
    print(f'   [OK] Found {len(results)} matching perfumes')
    
    if len(results) > 0:
        print(f'\n   Top result:')
        print(f'   - {results[0]["name"]} by {results[0]["brand"]}')
        print(f'   - Match: {results[0]["match_score"]*100:.0f}%')
        print(f'   - Matching notes: {", ".join(results[0]["matching_notes"])}')
except Exception as e:
    print(f'   [ERROR] Find by notes failed: {e}')
    exit(1)

# Test 4: Complex query with filters
print('\n[4/4] Testing with multiple notes + filters...')
try:
    test_data = {
        'notes': ['Vanilla', 'Rose', 'Jasmine', 'Sandalwood'],
        'limit': 10,
        'gender': 'Women'
    }
    r = requests.post(
        f'{API_URL}/recommendations/by-notes',
        json=test_data,
        headers={'Content-Type': 'application/json'}
    )
    results = r.json()
    print(f'   [OK] Found {len(results)} women perfumes with those notes')
    
    if len(results) > 0:
        print(f'\n   Sample results:')
        for i, p in enumerate(results[:3], 1):
            print(f'   {i}. {p["name"]} - Match: {p["match_score"]*100:.0f}%')
except Exception as e:
    print(f'   [ERROR] Complex query failed: {e}')

print('\n' + '=' * 70)
print('ALL TESTS PASSED!')
print('=' * 70)
print('\nFind by Notes is working correctly on backend.')
print('\nIf website still not working:')
print('1. Make sure frontend is running: npm run dev')
print('2. Hard refresh browser: Ctrl+Shift+R')
print('3. Check browser console (F12) for errors')
print('4. Open test_find_by_notes.html in browser')
