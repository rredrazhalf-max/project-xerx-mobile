@echo off
echo 🚀 Starting Project Xerx Mobile Version...
echo ======================================
echo.
echo 📱 Mobile-Optimized AI-Powered Secure Workspace
echo 🔐 Features: Face ID, AI Assistant, Research, Translation
echo 🌐 Access: http://localhost:8000/project-xerx-mobile.html
echo.
echo Starting local server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python server...
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js server...
    npx http-server -p 8000
    goto :end
)

REM Fallback to PHP if available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using PHP server...
    php -S localhost:8000
    goto :end
)

echo ❌ No server found! Please install Python, Node.js, or PHP
echo.
echo Manual installation:
echo 1. Open project-xerx-mobile.html in your browser
echo 2. Or install a local server:
echo    pip install python
echo    npm install -g http-server
echo    Or download PHP
pause
:end
