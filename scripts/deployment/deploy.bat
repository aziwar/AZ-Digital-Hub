@echo off
setlocal enabledelayedexpansion

echo 🚀 AZ Digital Hub Deployment Script
echo ======================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Check Node.js installation
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check npm installation
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

echo.
echo Select deployment option:
echo 1) Development server (local testing)
echo 2) Production build (test locally)
echo 3) Deploy to Vercel
echo 4) Static export (for traditional hosting)
echo 5) Deploy to Netlify

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo 🔧 Starting development server...
    call npm install
    call npm run dev
) else if "%choice%"=="2" (
    echo 🏗️ Building for production...
    call npm install
    call npm run build
    echo ✅ Production build complete!
    echo 💡 You can test the production build with: npm start
) else if "%choice%"=="3" (
    echo ☁️ Deploying to Vercel...
    
    REM Check if Vercel CLI is installed
    vercel --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo 📦 Installing Vercel CLI...
        call npm install -g vercel
    )
    
    REM Check if project is connected to Vercel
    if not exist ".vercel\project.json" (
        echo 🔗 Setting up Vercel project...
        call vercel
    ) else (
        echo 🚀 Deploying to Vercel...
        call vercel --prod
    )
) else if "%choice%"=="4" (
    echo 📦 Creating static export...
    
    REM Backup original config
    if exist "next.config.js" (
        copy "next.config.js" "next.config.js.backup" >nul
    )
    
    REM Create static export config
    echo ⚙️ Configuring for static export...
    (
        echo /** @type {import('next'^).NextConfig} */
        echo const nextConfig = {
        echo   output: 'export',
        echo   trailingSlash: true,
        echo   images: {
        echo     unoptimized: true,
        echo   },
        echo   env: {
        echo     SITE_URL: process.env.SITE_URL ^|^| 'https://ahmedziwar.com',
        echo     SITE_NAME: 'AZ Digital Hub',
        echo     SITE_DESCRIPTION: 'Ahmed Ziwar - Digital Marketing Manager ^& IT Consultant',
        echo   },
        echo }
        echo.
        echo module.exports = nextConfig
    ) > next.config.js
    
    REM Build static export
    call npm install
    call npm run build
    
    REM Restore original config
    if exist "next.config.js.backup" (
        move "next.config.js.backup" "next.config.js" >nul
    )
    
    echo ✅ Static export created in 'out' directory
    echo 📁 Upload the 'out' directory to your web hosting service
) else if "%choice%"=="5" (
    echo 🌐 Preparing for Netlify deployment...
    
    REM Create netlify.toml if it doesn't exist
    if not exist "netlify.toml" (
        (
            echo [build]
            echo   publish = "out"
            echo   command = "npm run build"
            echo.
            echo [[redirects]]
            echo   from = "/*"
            echo   to = "/index.html"
            echo   status = 200
            echo.
            echo [build.environment]
            echo   NODE_VERSION = "18"
        ) > netlify.toml
        echo 📝 Created netlify.toml configuration
    )
    
    echo ✅ Netlify configuration ready
    echo 💡 Now you can:
    echo    1. Push your code to GitHub
    echo    2. Connect your GitHub repo to Netlify
    echo    3. Deploy automatically
) else (
    echo ❌ Invalid choice. Please run the script again and select 1-5.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo.
echo 📚 Need help? Check the README.md for detailed instructions.
echo 📧 Questions? Contact: ahmed@zewar.xyz

pause
