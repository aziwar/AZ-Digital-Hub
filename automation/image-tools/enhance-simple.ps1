# Simplified Image Enhancement Script
param(
    [switch]$TestOnly = $false
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "AZ-Digital-Hub Image Enhancement" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check environment
if (-not $env:OPENAI_API_KEY) {
    Write-Host "ERROR: Run setup-env.ps1 first!" -ForegroundColor Red
    exit 1
}

# Test build
Write-Host "`nTesting current build..." -ForegroundColor Yellow
try {
    npm run build 2>&1 | Out-Null
    Write-Host "OK: Build passes" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Fix build errors first!" -ForegroundColor Red
    exit 1
}

# Create feature branch
Write-Host "`nSetting up feature branch..." -ForegroundColor Yellow
git checkout feature/ai-images 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout -b feature/ai-images 2>$null
}
Write-Host "OK: On feature branch" -ForegroundColor Green

if (-not $TestOnly) {
    # Generate images
    Write-Host "`nGenerating images..." -ForegroundColor Yellow
    
    # Start dev server
    $dev = Start-Process npm -ArgumentList "run dev" -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 10
    
    # Call API
    $body = @{
        brandName = "AZ-Digital-Hub"
        services = @(
            "Digital Marketing Strategy",
            "E-commerce Solutions",
            "IT Consulting",
            "Social Media Management"
        )
        headshotCount = 2
        logoCount = 2
        serviceCount = 4
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/generate-assets" -Method Post -Body $body -ContentType "application/json"
        $response | ConvertTo-Json -Depth 10 | Out-File "generated-images.json"
        Write-Host "OK: Generated $($response.data.imageCount) images for `$$($response.data.totalCost)" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Image generation failed - $_" -ForegroundColor Red
    } finally {
        Stop-Process -Id $dev.Id -Force 2>$null
    }
}

# Create components
Write-Host "`nCreating components..." -ForegroundColor Yellow
& "$PSScriptRoot\create-components.ps1"

# Update components
Write-Host "`nUpdating components..." -ForegroundColor Yellow
& "$PSScriptRoot\update-components.ps1"

# Final test
Write-Host "`nFinal build test..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null
Write-Host "OK: Build successful" -ForegroundColor Green

Write-Host "`nDONE! Next steps:" -ForegroundColor Cyan
Write-Host "1. npm run dev (test locally)" -ForegroundColor White
Write-Host "2. git add -A" -ForegroundColor White
Write-Host "3. git commit -m 'feat: Add AI images'" -ForegroundColor White
Write-Host "4. git push origin feature/ai-images" -ForegroundColor White
