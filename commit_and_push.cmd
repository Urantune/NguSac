@echo off
cd /d "%~dp0"
set /p message=Enter commit message: 

git add .
git commit -m "%message%"
if errorlevel 1 (
  echo Commit failed.
  exit /b 1
)

git push origin main
if errorlevel 1 (
  echo Push failed.
  exit /b 1
)

echo Commit and push completed successfully.
pause
