@echo off
setlocal

cd /d "%~dp0"

set "REMOTE=origin"
set "BRANCH=main"

echo ========================================
echo Commit all changes and force-push safely
echo Repo: %CD%
echo Target: %REMOTE%/%BRANCH%
echo ========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo This folder is not a Git repository.
  pause
  exit /b 1
)

git status --short
echo.
set /p "message=Enter commit message (default: Update project): "
if "%message%"=="" set "message=Update project"

echo.
echo Staging files...
git add -A
if errorlevel 1 (
  echo Git add failed.
  pause
  exit /b 1
)

git diff --cached --quiet
if errorlevel 1 (
  echo Creating commit...
  git commit -m "%message%"
  if errorlevel 1 (
    echo Commit failed.
    pause
    exit /b 1
  )
) else (
  echo No staged changes. Skipping commit.
)

echo.
echo Force pushing with lease to %REMOTE%/%BRANCH%...
git push --force-with-lease %REMOTE% %BRANCH%
if errorlevel 1 (
  echo Push failed. Remote may have new commits, or network/auth failed.
  pause
  exit /b 1
)

echo.
echo Done. Commit and force-push completed successfully.
pause
