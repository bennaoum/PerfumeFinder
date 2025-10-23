import requests

try:
    r = requests.get('http://localhost:5000/api/perfumes')
    print(f'API Status: {r.status_code}')
    
    if r.status_code == 200:
        data = r.json()
        print(f'Perfumes returned: {len(data)}')
        print(f'\nSample perfumes:')
        for p in data[:5]:
            print(f'  - {p["name"]} by {p["brand"]} ({p["year"]})')
        print('\n[SUCCESS] API is working with expanded database!')
    else:
        print(f'[ERROR] API returned status {r.status_code}')
except Exception as e:
    print(f'[ERROR] Could not connect to API: {e}')
    print('\nMake sure backend is running: py app.py')
