# Comprehensive diagnostic script to check all package versions
Write-Host "Running comprehensive package diagnostics..." -ForegroundColor Cyan
Write-Host "This will check every package in your package.json" -ForegroundColor Gray
Write-Host ""

# Read package.json
$packageJson = Get-Content -Path "package.json" | ConvertFrom-Json

# Function to check package version
function Test-PackageVersion {
    param(
        [string]$packageName,
        [string]$version
    )
    
    # Remove any ^ or ~ from version
    $cleanVersion = $version -replace '^[\^~]', ''
    
    Write-Host -NoNewline "  $packageName@$cleanVersion... "
    $result = npm view "$packageName@$cleanVersion" version 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗" -ForegroundColor Red
        
        # Get latest version
        $latest = npm view $packageName version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    Latest available: $latest" -ForegroundColor Yellow
        }
        
        return $false
    }
}

# Check all dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$failedPackages = @()

foreach ($dep in $packageJson.dependencies.PSObject.Properties) {
    $success = Test-PackageVersion -packageName $dep.Name -version $dep.Value
    if (-not $success) {
        $failedPackages += @{
            Name = $dep.Name
            RequestedVersion = $dep.Value
        }
    }
}

Write-Host ""
Write-Host "Checking devDependencies..." -ForegroundColor Yellow

foreach ($dep in $packageJson.devDependencies.PSObject.Properties) {
    $success = Test-PackageVersion -packageName $dep.Name -version $dep.Value
    if (-not $success) {
        $failedPackages += @{
            Name = $dep.Name
            RequestedVersion = $dep.Value
        }
    }
}

Write-Host ""

if ($failedPackages.Count -gt 0) {
    Write-Host "❌ Found $($failedPackages.Count) packages with version issues:" -ForegroundColor Red
    Write-Host ""
    
    foreach ($pkg in $failedPackages) {
        Write-Host "  - $($pkg.Name) @ $($pkg.RequestedVersion)" -ForegroundColor Red
        
        # Get available versions
        Write-Host "    Available versions:" -ForegroundColor Yellow
        $versions = npm view $pkg.Name versions --json 2>&1 | ConvertFrom-Json
        if ($versions) {
            $recentVersions = $versions | Select-Object -Last 10
            foreach ($v in $recentVersions) {
                Write-Host "      $v" -ForegroundColor Gray
            }
        }
        Write-Host ""
    }
    
    Write-Host "Please update the package.json with valid versions for the packages above." -ForegroundColor Yellow
} else {
    Write-Host "✅ All package versions are valid!" -ForegroundColor Green
}

Write-Host ""
Write-Host "System Information:" -ForegroundColor Yellow
Write-Host "  Node.js: $(node --version)" -ForegroundColor Gray
Write-Host "  npm: $(npm --version)" -ForegroundColor Gray
Write-Host "  Registry: $(npm config get registry)" -ForegroundColor Gray
