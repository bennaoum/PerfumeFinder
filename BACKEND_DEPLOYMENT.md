# Backend Deployment Guide

Since GitHub Pages only hosts static files, you'll need a separate service for your Flask backend. Here are the best free options:

## Option 1: Render (Recommended)

**Pros:** Free tier, easy setup, automatic deployments
**Cons:** May sleep after inactivity (takes ~30s to wake up)

### Steps:

1. **Create a `requirements.txt`** (if not exists):
   ```bash
   cd backend
   pip freeze > requirements.txt
   ```

2. **Create `render.yaml`** in project root:
   ```yaml
   services:
     - type: web
       name: perfume-finder-api
       env: python
       buildCommand: "cd backend && pip install -r requirements.txt"
       startCommand: "cd backend && gunicorn app:app"
       envVars:
         - key: PYTHON_VERSION
           value: 3.11.0
         - key: FLASK_ENV
           value: production
   ```

3. **Add gunicorn** to `backend/requirements.txt`:
   ```
   gunicorn==21.2.0
   ```

4. **Sign up and deploy:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Render will auto-detect the configuration
   - Your API will be at: `https://perfume-finder-api.onrender.com`

5. **Update frontend API URL:**
   - Create `frontend/src/config.js`:
     ```javascript
     export const API_URL = import.meta.env.PROD 
       ? 'https://perfume-finder-api.onrender.com'
       : 'http://localhost:5000';
     ```
   - Update API calls to use this URL

## Option 2: Railway

**Pros:** Generous free tier, fast deployment
**Cons:** Requires credit card (won't charge on free tier)

### Steps:

1. **Create `Procfile`** in backend directory:
   ```
   web: gunicorn app:app
   ```

2. **Create `runtime.txt`** in backend directory:
   ```
   python-3.11.0
   ```

3. **Deploy:**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Select the backend directory
   - Railway will auto-deploy
   - Get your URL from the deployment settings

## Option 3: PythonAnywhere

**Pros:** Python-focused, free tier available
**Cons:** Manual setup, more complex configuration

### Steps:

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload your backend files
3. Create a web app with Flask
4. Configure WSGI file
5. Set up database path
6. Reload the web app

Detailed guide: [PythonAnywhere Flask Tutorial](https://help.pythonanywhere.com/pages/Flask/)

## Option 4: Vercel (Serverless)

**Pros:** Fast, free tier, same platform as frontend option
**Cons:** Requires code modifications for serverless

### Steps:

1. **Create `vercel.json`** in backend directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "app.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "app.py"
       }
     ]
   }
   ```

2. **Modify `app.py`** to export app:
   ```python
   # At the end of app.py
   if __name__ == '__main__':
       app.run(debug=True, host='0.0.0.0', port=5000)
   
   # For Vercel
   app = app
   ```

3. **Deploy:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `cd backend && vercel`
   - Follow prompts

## Updating Frontend to Use Deployed Backend

### Method 1: Environment Variables

1. **Create `frontend/.env.production`:**
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

2. **Create `frontend/src/config.js`:**
   ```javascript
   export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

3. **Update all API calls:**
   ```javascript
   import { API_URL } from './config';
   
   // Instead of: fetch('/api/perfumes')
   fetch(`${API_URL}/api/perfumes`)
   ```

### Method 2: Proxy Configuration

Update `frontend/vite.config.js` for production:
```javascript
export default defineConfig({
  // ... other config
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:5000'
    )
  }
})
```

## CORS Configuration

Your backend needs to allow requests from GitHub Pages:

**Update `backend/app.py`:**

```python
from flask_cors import CORS

app = Flask(__name__)

# Allow your GitHub Pages domain
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://YOUR_USERNAME.github.io"
        ]
    }
})
```

Install flask-cors:
```bash
pip install flask-cors
pip freeze > requirements.txt
```

## Database Considerations

### SQLite Limitations
- SQLite files may not persist on some platforms (Render, Railway)
- Consider migrating to PostgreSQL for production

### PostgreSQL Migration

1. **Update `requirements.txt`:**
   ```
   psycopg2-binary==2.9.9
   ```

2. **Modify database connection in `app.py`:**
   ```python
   import os
   from sqlalchemy import create_engine
   
   DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///perfumes.db')
   # Fix for Render/Railway PostgreSQL URL
   if DATABASE_URL.startswith('postgres://'):
       DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
   
   engine = create_engine(DATABASE_URL)
   ```

3. **Platform provides free PostgreSQL:**
   - Render: Add PostgreSQL service
   - Railway: Add PostgreSQL plugin
   - Both auto-set `DATABASE_URL` environment variable

## Testing Your Deployed Backend

```bash
# Test API endpoint
curl https://your-backend-url.com/api/perfumes

# Test specific endpoint
curl https://your-backend-url.com/api/perfume/1
```

## Recommended Setup

For the best free setup:

1. **Frontend:** GitHub Pages (free, fast, reliable)
2. **Backend:** Render (free, easy, auto-deploy)
3. **Database:** PostgreSQL on Render (free, persistent)

This combination gives you:
- ✅ Automatic deployments
- ✅ Custom domain support
- ✅ HTTPS by default
- ✅ No credit card required
- ✅ Persistent database

## Quick Start with Render

```bash
# 1. Create requirements.txt
cd backend
pip freeze > requirements.txt

# 2. Add to requirements.txt
echo "gunicorn==21.2.0" >> requirements.txt
echo "flask-cors==4.0.0" >> requirements.txt

# 3. Commit and push
git add .
git commit -m "Add backend deployment config"
git push

# 4. Go to render.com and connect your repo
# 5. Create new Web Service
# 6. Point to backend directory
# 7. Deploy!
```

Your backend will be live in ~2 minutes! 🚀
