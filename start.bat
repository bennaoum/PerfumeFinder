@echo off
echo ========================================
echo  Perfume Finder - Starting Application
echo ========================================
echo.

echo Checking if database exists...
if not exist "backend\perfumes.db" (
    echo Database not found. Initializing...
    cd backend
    python init_db.py
    cd ..
    echo Database created successfully!
    echo.
)

echo Starting backend and frontend servers...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop the servers
echo.

start "Perfume Finder - Backend" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak >nul
start "Perfume Finder - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Servers are starting...
echo  Wait a few seconds then open:
echo  http://localhost:3000
echo ========================================
echo.
echo This window can be closed.
pause
