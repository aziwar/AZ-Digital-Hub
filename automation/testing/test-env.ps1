# Quick test to check environment and API key
Write-Host "Checking environment..." -ForegroundColor Cyan

# Check directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir"

# Check if we're in the right project
if (Test-Path ".\package.json") {
    Write-Host "OK: In AZ-Digital-Hub project" -ForegroundColor Green
} else {
    Write-Host "ERROR: Not in project directory!" -ForegroundColor Red
}

# Check API key
if ($env:OPENAI_API_KEY) {
    $keyPreview = $env:OPENAI_API_KEY.Substring(0, [Math]::Min(10, $env:OPENAI_API_KEY.Length)) + "..."
    Write-Host "OK: OpenAI API key is set: $keyPreview" -ForegroundColor Green
} else {
    Write-Host "ERROR: OpenAI API key NOT set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To set it, run:" -ForegroundColor Yellow
    Write-Host '$env:OPENAI_API_KEY = "your-key-here"' -ForegroundColor White
    Write-Host ""
    Write-Host "The key should be in Vercel environment variables." -ForegroundColor Gray
}

# Check if dev server is already running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "OK: Dev server is already running" -ForegroundColor Green
} catch {
    Write-Host "INFO: Dev server is not running (will start when needed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Ready to run enhancement script" -ForegroundColor Cyan
