@echo off
title FocusStack Launcher

:: ─────────────────────────────────────────────
:: FocusStack — One-click launcher
:: Place this file on your Desktop and double-click.
:: ─────────────────────────────────────────────

set PROJECT_DIR=d:\FocusStack
set APP_URL=http://localhost:5173
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set EDGE="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
:: Installed PWA shortcut paths (Chrome and Edge put them here)
set CHROME_APPS=%LOCALAPPDATA%\Google\Chrome\User Data\Default\Web Applications
set EDGE_APPS=%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Web Applications

:: Check if server is already running
curl -s --max-time 1 %APP_URL% >nul 2>&1
if %errorlevel% == 0 (
    echo FocusStack is already running. Opening browser...
    goto :open_browser
)

:: Start the dev server in a minimized background window
echo Starting FocusStack dev server...
start "FocusStack Server" /min cmd /c "cd /d %PROJECT_DIR% && npm run dev"

:: Wait for server to be ready (check every second, up to 30s)
echo Waiting for server to start...
set /a attempts=0
:wait_loop
set /a attempts+=1
if %attempts% gtr 30 (
    echo ERROR: Server did not start in time. Check the FocusStack Server window.
    pause
    exit /b 1
)
timeout /t 1 /nobreak >nul
curl -s --max-time 1 %APP_URL% >nul 2>&1
if %errorlevel% neq 0 goto :wait_loop

echo Server ready!

:open_browser
::
:: IMPORTANT: We launch via the INSTALLED PWA shortcut (Start Menu) so localStorage
:: always matches what the PWA app sees. Using --app= creates a DIFFERENT storage bucket.
::

:: Look for Chrome PWA shortcut in Start Menu
set CHROME_PWA_SHORTCUT=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Chrome Apps\FocusStack.lnk
:: Look for Edge PWA shortcut in Start Menu  
set EDGE_PWA_SHORTCUT=%APPDATA%\Microsoft\Windows\Start Menu\Programs\FocusStack.lnk

if exist "%CHROME_PWA_SHORTCUT%" (
    start "" "%CHROME_PWA_SHORTCUT%"
    echo Opened via installed Chrome PWA.
    exit /b 0
)

if exist "%EDGE_PWA_SHORTCUT%" (
    start "" "%EDGE_PWA_SHORTCUT%"
    echo Opened via installed Edge PWA.
    exit /b 0
)

:: Fallback: PWA not installed — open the normal browser window for the same
:: profile/origin. This keeps localStorage aligned with what you see in tabs.
echo NOTE: PWA not installed. Opening in regular browser window.
echo TIP: Install the PWA in Chrome for a cleaner app-style window.
if exist %CHROME% (
    start "" %CHROME% --new-window %APP_URL%
    echo Opened in Chrome window.
) else if exist %EDGE% (
    start "" %EDGE% --new-window %APP_URL%
    echo Opened in Edge window.
) else (
    start "" %APP_URL%
    echo Opened in default browser.
)

exit /b 0
