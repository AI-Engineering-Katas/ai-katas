@echo off
REM Setup script for Financial Services Knowledge Base on Windows

echo Setting up Financial Services Knowledge Base development environment...

REM Check if podman is installed
where podman >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Podman is not installed. Please install podman before continuing.
    echo Installation instructions: https://podman.io/getting-started/installation
    exit /b 1
)

REM Check if podman-compose is installed
where podman-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Podman-compose is not installed. Please install podman-compose before continuing.
    echo Installation instructions: https://github.com/containers/podman-compose
    exit /b 1
)

REM Create necessary directories
echo Creating directories...
if not exist data\raw mkdir data\raw
if not exist data\processed mkdir data\processed
if not exist data\embeddings mkdir data\embeddings

REM Build and start containers
echo Building and starting containers...
cd podman
podman-compose build
podman-compose up -d
cd ..

echo Setup complete!
echo API is running at: http://localhost:8000
echo Frontend is running at: http://localhost:3000
echo Vector database UI is running at: http://localhost:6333/dashboard

echo.
echo Next steps:
echo 1. Open the frontend in your browser: http://localhost:3000
echo 2. Try asking a question to test the system
echo 3. Start implementing Milestone 2: Document Processing Pipeline

pause
