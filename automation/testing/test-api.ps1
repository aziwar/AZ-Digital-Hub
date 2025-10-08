# Quick API Test
Write-Host "Testing OpenAI API..." -ForegroundColor Cyan

# Set API key
. .\automation\setup-env.ps1

# Start dev server
Write-Host "Starting dev server..." -ForegroundColor Yellow
$dev = Start-Process npm -ArgumentList "run dev" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 15

# Test API endpoint
Write-Host "Testing API endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/generate-assets?headshotCount=1&logoCount=1&serviceCount=1" -Method Get
    Write-Host "API Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "API Error: $_" -ForegroundColor Red
}

# Stop server
Stop-Process -Id $dev.Id -Force 2>$null
Write-Host "Done!" -ForegroundColor Cyan
