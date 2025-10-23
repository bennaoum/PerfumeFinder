# 🌸 Perfume Finder

A modern web application to help you discover your perfect scent. Browse perfumes, search by notes, and get personalized recommendations.

![Perfume Finder](https://img.shields.io/badge/React-18.2.0-blue) ![Flask](https://img.shields.io/badge/Flask-3.0-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🔍 **Smart Search** - Find perfumes by name, brand, or notes
- 🎯 **Note-Based Discovery** - Search by fragrance notes (floral, woody, citrus, etc.)
- 💝 **Personalized Recommendations** - Get suggestions based on your preferences
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Fast & Modern** - Built with React and Vite

## 🚀 Live Demo

**Frontend:** [https://YOUR_USERNAME.github.io/REPO_NAME/](https://YOUR_USERNAME.github.io/REPO_NAME/)

> **Note:** The live demo on GitHub Pages is frontend-only. For full functionality with backend features, see [Backend Deployment](#backend-deployment).

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation

### Backend
- **Flask** - Python web framework
- **SQLite** - Database
- **Flask-CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Quick Start (Windows)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
   cd REPO_NAME
   ```

2. **Run setup:**
   ```bash
   setup.bat
   ```

3. **Start the application:**
   ```bash
   start.bat
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors

# Initialize database
python init_db.py

# Start server
python app.py
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Deployment

### Deploy to GitHub Pages

See detailed instructions in [DEPLOYMENT.md](DEPLOYMENT.md)

**Quick steps:**
1. Create a GitHub repository
2. Push your code
3. Enable GitHub Pages in repository settings
4. GitHub Actions will automatically deploy

### Backend Deployment

The backend requires a separate hosting service. See [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md) for options:

- **Render** (Recommended) - Free, easy setup
- **Railway** - Fast deployment
- **PythonAnywhere** - Python-focused hosting
- **Vercel** - Serverless option

## 📁 Project Structure

```
windsurf-project-2/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js       # Vite configuration
├── backend/                  # Flask backend
│   ├── app.py               # Main Flask application
│   ├── init_db.py           # Database initialization
│   ├── perfumes.db          # SQLite database
│   └── .env.example         # Environment variables template
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment
├── setup.bat                # Windows setup script
├── start.bat                # Windows start script
├── DEPLOYMENT.md            # Deployment guide
├── BACKEND_DEPLOYMENT.md    # Backend deployment guide
└── README.md                # This file
```

## 🎯 Usage

### Search for Perfumes
1. Use the search bar to find perfumes by name or brand
2. Browse the results with detailed information

### Find by Notes
1. Click "Find by Notes" in the navigation
2. Select fragrance notes you like (e.g., rose, vanilla, sandalwood)
3. Get perfumes that match your preferences

### Get Recommendations
1. Select a perfume you like
2. Click "Get Recommendations"
3. Discover similar fragrances

## 🔧 Configuration

### Frontend Configuration

Edit `frontend/.env` (create from `.env.example`):
```env
VITE_API_URL=http://localhost:5000
```

### Backend Configuration

Edit `backend/.env` (create from `.env.example`):
```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///perfumes.db
```

## 🧪 Testing

### Test Backend API
```bash
cd backend
python test_api.py
```

### Test Database
```bash
cd backend
python test_db.py
```

### Build Frontend
```bash
cd frontend
npm run build
```

## 📝 API Documentation

### Endpoints

#### Get All Perfumes
```http
GET /api/perfumes
```

#### Get Perfume by ID
```http
GET /api/perfume/<id>
```

#### Search Perfumes
```http
GET /api/search?q=<query>
```

#### Find by Notes
```http
POST /api/find-by-notes
Content-Type: application/json

{
  "notes": ["rose", "vanilla", "musk"]
}
```

#### Get Recommendations
```http
GET /api/recommendations/<perfume_id>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

### Common Issues

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database not found:**
```bash
cd backend
python init_db.py
```

**Module not found:**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- Perfume data sourced from various fragrance databases
- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by modern design principles

---

**Made with ❤️ for perfume enthusiasts**
