# Script to automatically fix package versions in package.json
Write-Host "Package Version Auto-Fixer" -ForegroundColor Cyan
Write-Host "This script will update package.json with the latest available versions" -ForegroundColor Gray
Write-Host ""

# Read package.json
$packageJsonPath = "package.json"
$packageJson = Get-Content -Path $packageJsonPath | ConvertFrom-Json

# Function to get latest version of a package
function Get-LatestVersion {
    param(
        [string]$packageName,
        [string]$currentVersion
    )
    
    # Remove any ^ or ~ from version
    $cleanVersion = $currentVersion -replace '^[\^~]', ''
    
    # First check if current version exists
    $checkCurrent = npm view "$packageName@$cleanVersion" version 2>&1
    if ($LASTEXITCODE -eq 0) {
        return $currentVersion  # Keep current version if it exists
    }
    
    # Get latest version
    $latest = npm view $packageName version 2>&1
    if ($LASTEXITCODE -eq 0) {
        return $latest
    }
    
    return $null
}

# Update dependencies
Write-Host "Checking and updating dependencies..." -ForegroundColor Yellow
$updatedCount = 0

foreach ($dep in $packageJson.dependencies.PSObject.Properties) {
    Write-Host -NoNewline "  Checking $($dep.Name)... "
    
    $newVersion = Get-LatestVersion -packageName $dep.Name -currentVersion $dep.Value
    
    if ($newVersion -and $newVersion -ne $dep.Value) {
        $packageJson.dependencies.($dep.Name) = $newVersion
        Write-Host "Updated from $($dep.Value) to $newVersion" -ForegroundColor Green
        $updatedCount++
    } elseif ($newVersion) {
        Write-Host "OK" -ForegroundColor Gray
    } else {
        Write-Host "FAILED - Package not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking and updating devDependencies..." -ForegroundColor Yellow

foreach ($dep in $packageJson.devDependencies.PSObject.Properties) {
    Write-Host -NoNewline "  Checking $($dep.Name)... "
    
    $newVersion = Get-LatestVersion -packageName $dep.Name -currentVersion $dep.Value
    
    if ($newVersion -and $newVersion -ne $dep.Value) {
        $packageJson.devDependencies.($dep.Name) = $newVersion
        Write-Host "Updated from $($dep.Value) to $newVersion" -ForegroundColor Green
        $updatedCount++
    } elseif ($newVersion) {
        Write-Host "OK" -ForegroundColor Gray
    } else {
        Write-Host "FAILED - Package not found" -ForegroundColor Red
    }
}

Write-Host ""

if ($updatedCount -gt 0) {
    # Save updated package.json
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path $packageJsonPath -Encoding UTF8
    Write-Host "✅ Updated $updatedCount packages in package.json" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now run: .\clean-install.ps1" -ForegroundColor Yellow
} else {
    Write-Host "✅ All packages are already at valid versions!" -ForegroundColor Green
}
