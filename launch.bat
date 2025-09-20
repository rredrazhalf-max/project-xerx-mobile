@echo off
echo Starting Secure File Upload Application...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP server...
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js HTTP server...
    npx http-server -p 8000
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using PHP built-in server...
    php -S localhost:8000
    goto :end
)

echo No suitable server found. Please install Python, Node.js, or PHP.
echo Or open index.html directly in your browser.
pause

:end
