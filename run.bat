@echo off
setlocal
cd /d "%~dp0"

REM Quantum V2.0 - run helper
REM   run.bat          start the dev server (hot reload)
REM   run.bat build    build for production into .output
REM   run.bat start    build, then serve the production build

where npm >nul 2>nul
if errorlevel 1 (
  echo [X] npm was not found. Install Node.js 20+ from https://nodejs.org and reopen this window.
  pause
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" (
    echo [*] Creating .env from .env.example ^(Supabase project config^)...
    copy /y ".env.example" ".env" >nul
  )
)

if not exist "node_modules" (
  echo [*] Installing dependencies, this takes a minute the first time...
  call npm install
  if errorlevel 1 (
    echo [X] npm install failed.
    pause
    exit /b 1
  )
)

if /i "%~1"=="build" (
  echo [*] Building for production...
  call npm run build
  if errorlevel 1 ( pause & exit /b 1 )
  echo [OK] Build complete. Deployable output is in the .output folder.
  pause
  exit /b 0
)

if /i "%~1"=="start" (
  echo [*] Building for production...
  call npm run build
  if errorlevel 1 ( pause & exit /b 1 )
  echo [*] Serving the production build on http://localhost:4173 ...
  call npm run preview
  exit /b 0
)

echo [*] Starting the dev server...
echo     Open http://localhost:8080 when it says ready.
call npm run dev
