@echo off
echo 🚀 Setting up Context7 MCP Server for AZ Digital Hub
echo ================================================

echo.
echo Step 1: Installing Context7 for Claude Desktop...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install Context7 using Smithery (automatic)
echo Installing Context7 automatically...
npx -y @smithery/cli install @upstash/context7-mcp --client claude

if %errorlevel% equ 0 (
    echo ✅ Context7 installed successfully!
    echo.
    echo 🎯 Next steps:
    echo 1. Restart Claude Desktop
    echo 2. Try this prompt: "Update my Next.js portfolio with latest features. use context7"
    echo.
) else (
    echo ⚠️ Automatic installation failed. Setting up manually...
    
    REM Find Claude Desktop config directory
    set CLAUDE_CONFIG_DIR=%APPDATA%\Claude
    
    if not exist "%CLAUDE_CONFIG_DIR%" (
        mkdir "%CLAUDE_CONFIG_DIR%"
    )
    
    set CONFIG_FILE=%CLAUDE_CONFIG_DIR%\claude_desktop_config.json
    
    REM Create or update config file
    echo Creating/updating Claude Desktop configuration...
    (
        echo {
        echo   "mcpServers": {
        echo     "Context7": {
        echo       "command": "npx",
        echo       "args": ["-y", "@upstash/context7-mcp@latest"]
        echo     }
        echo   }
        echo }
    ) > "%CONFIG_FILE%"
    
    echo ✅ Configuration file created at: %CONFIG_FILE%
    echo.
    echo 🎯 Next steps:
    echo 1. Restart Claude Desktop
    echo 2. Try this prompt: "Update my Next.js portfolio with latest features. use context7"
    echo.
)

echo 📚 Context7 is now ready for your AZ Digital Hub project!
echo.
echo 💡 Example prompts for your portfolio:
echo - "Add a blog section to my Next.js portfolio. use context7"
echo - "Implement advanced Framer Motion animations. use context7"  
echo - "Set up Vercel deployment with environment variables. use context7"
echo - "Add form validation with React Hook Form. use context7"
echo.

pause
