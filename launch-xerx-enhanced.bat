@echo off
echo Starting Project Xerx Enhanced - AI-Powered Secure Workspace...
echo.
echo Features:
echo - PDF/ePub Reader with AI Analysis
echo - Advanced AI Research with Citations
echo - Universal Language Translation
echo - Perplexity-style Search Interface
echo - Enhanced Security Features
echo.
echo Login Credentials:
echo Username: xerx
echo Password: Xerxes79445
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP server...
    echo Opening Project Xerx Enhanced in browser...
    start http://localhost:8000/index-xerx-enhanced.html
    python -m http.server 8000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js HTTP server...
    echo Opening Project Xerx Enhanced in browser...
    start http://localhost:8000/index-xerx-enhanced.html
    npx http-server -p 8000
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using PHP built-in server...
    echo Opening Project Xerx Enhanced in browser...
    start http://localhost:8000/index-xerx-enhanced.html
    php -S localhost:8000
    goto :end
)

echo No suitable server found. Please install Python, Node.js, or PHP.
echo Or open index-xerx-enhanced.html directly in your browser.
echo.
echo Login Credentials:
echo Username: xerx
echo Password: Xerxes79445
echo.
pause

:end
