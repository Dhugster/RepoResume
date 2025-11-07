@echo off
echo ========================================
echo RepoResume - Install All Dependencies
echo ========================================
echo.

:: Navigate to project root
cd /d "%~dp0"

:: Install root dependencies
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

:: Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

:: Install desktop dependencies
echo Installing desktop dependencies...
cd desktop
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install desktop dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo All dependencies installed successfully!
echo ========================================
echo.
echo Next steps:
echo   1. Install Rust from https://rustup.rs/ (if not already installed)
echo   2. Run build-desktop.bat to create the executable
echo.
pause

