@echo off
echo ========================================
echo  Perfume Finder - Initial Setup
echo ========================================
echo.
echo This script will:
echo 1. Install Python dependencies
echo 2. Install Node.js dependencies
echo 3. Initialize the database
echo.
echo This may take 3-5 minutes...
echo.
pause

echo.
echo [1/3] Installing Python dependencies...
echo ========================================
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Python dependencies
    echo Please ensure Python is installed and in PATH
    pause
    exit /b 1
)

echo.
echo [2/3] Installing Node.js dependencies...
echo ========================================
cd ..\frontend
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Node.js dependencies
    echo Please ensure Node.js and npm are installed
    pause
    exit /b 1
)

echo.
echo [3/3] Initializing database...
echo ========================================
cd ..\backend
python init_db.py
if errorlevel 1 (
    echo.
    echo ERROR: Failed to initialize database
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo  Setup Complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Run 'start.bat' to launch the application
echo 2. Or manually run:
echo    - Backend: cd backend ^&^& python app.py
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo Then open: http://localhost:3000
echo.
pause
