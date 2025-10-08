@echo off
REM force-cleanup.bat - Windows batch file for aggressive cleanup

echo ======================================
echo  FORCE CLEANUP FOR AZ DIGITAL HUB
echo ======================================
echo.

echo [1/5] Closing any Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo [2/5] Removing node_modules...
if exist node_modules (
    echo Attempting to remove node_modules folder...
    rmdir /s /q node_modules >nul 2>&1
    if exist node_modules (
        echo Taking ownership and retrying...
        takeown /f node_modules /r /d y >nul 2>&1
        icacls node_modules /grant %USERNAME%:F /t >nul 2>&1
        rmdir /s /q node_modules >nul 2>&1
    )
)

echo [3/5] Removing other build artifacts...
if exist .next rmdir /s /q .next >nul 2>&1
if exist out rmdir /s /q out >nul 2>&1
if exist package-lock.json del /f /q package-lock.json >nul 2>&1

echo [4/5] Clearing npm cache...
call npm cache clean --force >nul 2>&1

echo [5/5] Creating clean directory structure...
if not exist src\app mkdir src\app
if not exist src\components\sections mkdir src\components\sections
if not exist src\lib mkdir src\lib
if not exist public mkdir public

echo.
echo ======================================
echo  CLEANUP COMPLETED!
echo ======================================
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm install critters --save-dev
echo 3. Run: npm run dev
echo.
pause