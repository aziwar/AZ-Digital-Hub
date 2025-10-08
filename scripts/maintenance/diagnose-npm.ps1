# Diagnostic script to identify npm/package issues
Write-Host "Running diagnostics..." -ForegroundColor Cyan
Write-Host ""

# Check npm and node versions
Write-Host "System Information:" -ForegroundColor Yellow
Write-Host "Node.js: $(node --version)" -ForegroundColor Gray
Write-Host "npm: $(npm --version)" -ForegroundColor Gray
Write-Host "PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor Gray
Write-Host ""

# Check npm registry
Write-Host "NPM Configuration:" -ForegroundColor Yellow
Write-Host "Registry: $(npm config get registry)" -ForegroundColor Gray
Write-Host ""

# Check for problematic packages
Write-Host "Checking package versions availability..." -ForegroundColor Yellow
$packages = @{
    "nextjs-toploader" = "3.8.16"
    "@react-three/fiber" = "8.17.10"
    "@react-three/drei" = "9.88.17"
    "react" = "18.2.0"
}

foreach ($pkg in $packages.Keys) {
    Write-Host -NoNewline "Checking $pkg@$($packages[$pkg])... "
    $result = npm view "$pkg@$($packages[$pkg])" version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Available" -ForegroundColor Green
    } else {
        Write-Host "✗ Not found" -ForegroundColor Red
        # Try to find available versions
        Write-Host "  Available versions:" -ForegroundColor Yellow
        npm view $pkg versions --json | ConvertFrom-Json | Select-Object -Last 5 | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
    }
}

Write-Host ""
Write-Host "Diagnostic complete!" -ForegroundColor Green
