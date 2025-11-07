@echo off
echo ========================================
echo RepoResume Desktop - Build Script
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check Node.js version
echo Checking Node.js version...
node --version
echo.

:: Check if Rust is installed
where rustc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ========================================
    echo WARNING: Rust is not installed!
    echo ========================================
    echo.
    echo Rust is required to build the desktop app.
    echo.
    echo To install Rust:
    echo   1. Visit https://rustup.rs/
    echo   2. Download and run rustup-init.exe
    echo   3. Restart PowerShell/Command Prompt after installation
    echo   4. Run this script again
    echo.
    pause
    exit /b 1
)

echo Checking Rust version...
rustc --version
echo.

:: Navigate to project root
cd /d "%~dp0"
echo Current directory: %CD%
echo.

:: Step 1: Install root dependencies
echo ========================================
echo Step 1/5: Installing root dependencies...
echo ========================================
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)
echo.

:: Step 2: Install backend dependencies
echo ========================================
echo Step 2/5: Installing backend dependencies...
echo ========================================
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo.

:: Step 3: Install frontend dependencies
echo ========================================
echo Step 3/5: Installing frontend dependencies...
echo ========================================
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo.

:: Step 4: Install desktop dependencies
echo ========================================
echo Step 4/5: Installing desktop dependencies...
echo ========================================
cd desktop
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install desktop dependencies
    pause
    exit /b 1
)
cd ..
echo.

:: Step 5: Build desktop app
echo ========================================
echo Step 5/5: Building desktop application...
echo ========================================
echo This may take 2-5 minutes on first build...
echo.
call npm run build:desktop:windows
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above for details.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Your executable is located at:
echo desktop\src-tauri\target\release\repo-resume.exe
echo.
echo You can now:
echo   1. Double-click repo-resume.exe to run it
echo   2. Copy it to your Desktop or Program Files
echo   3. Add it to Windows Startup folder
echo.
pause

