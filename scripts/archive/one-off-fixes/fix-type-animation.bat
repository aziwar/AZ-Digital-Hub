@echo off
echo === AZ Digital Hub - TypeAnimation Fix ===
echo.

node scripts/fix-type-animation.js

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Fix script encountered an error. Please check the output above.
  exit /b %ERRORLEVEL%
)

echo.
echo === Fix completed successfully! ===
echo To verify, run: npm run dev
