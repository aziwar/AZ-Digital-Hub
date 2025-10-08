@echo off
echo ========================================
echo AZ Digital Hub - Comprehensive Fix Tool
echo ========================================
echo.

echo [1/5] Installing missing critical dependency...
call npm install react-type-animation
if %errorlevel% neq 0 (
    echo ERROR: Failed to install react-type-animation
    pause
    exit /b 1
)

echo.
echo [2/5] Updating Next.js to latest version...
call npm install next@latest
if %errorlevel% neq 0 (
    echo WARNING: Failed to update Next.js, continuing...
)

echo.
echo [3/5] Cleaning build cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo [4/5] Running type check...
call npm run type-check
if %errorlevel% neq 0 (
    echo WARNING: TypeScript errors found, check output above
)

echo.
echo [5/5] Testing build...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed! Check errors above
    echo.
    echo Attempting clean reinstall...
    rmdir /s /q node_modules
    del package-lock.json
    call npm install
    call npm run build
    if %errorlevel% neq 0 (
        echo CRITICAL: Build still failing after clean install
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo ✅ SUCCESS: All fixes applied!
echo ========================================
echo.
echo Your website should now build without errors.
echo Next steps:
echo   1. Test locally: npm run dev
echo   2. Test production: npm run build
echo   3. Deploy when ready
echo.
pause
