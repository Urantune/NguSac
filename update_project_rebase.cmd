@echo off
setlocal

cd /d "%~dp0"

set "REMOTE=origin"
set "BRANCH=main"

echo ========================================
echo Update project from Git with full rebase
echo Repo: %CD%
echo Source: %REMOTE%/%BRANCH%
echo ========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo This folder is not a Git repository.
  pause
  exit /b 1
)

echo Fetching all remotes and pruning deleted branches...
git fetch --all --prune
if errorlevel 1 (
  echo Fetch failed.
  pause
  exit /b 1
)

echo.
echo Switching to %BRANCH%...
git checkout %BRANCH%
if errorlevel 1 (
  echo Checkout failed.
  pause
  exit /b 1
)

echo.
echo Rebasing local changes on top of %REMOTE%/%BRANCH%...
git pull --rebase --autostash %REMOTE% %BRANCH%
if errorlevel 1 (
  echo Rebase failed. Resolve conflicts, then run:
  echo   git rebase --continue
  echo Or cancel with:
  echo   git rebase --abort
  pause
  exit /b 1
)

echo.
echo Cleaning stale remote-tracking references...
git remote prune %REMOTE%
if errorlevel 1 (
  echo Remote prune failed.
  pause
  exit /b 1
)

echo.
git status --short
echo.
echo Done. Project updated and rebased successfully.
pause
