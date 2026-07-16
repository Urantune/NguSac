@echo off
cd /d "%~dp0"
echo Pulling latest changes from GitHub...
git pull origin main
if errorlevel 1 (
  echo Pull failed.
  exit /b 1
)
echo Pull completed successfully.
pause
