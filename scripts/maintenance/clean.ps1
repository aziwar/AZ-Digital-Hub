#!/usr/bin/env pwsh
# AZ-Digital-Hub Unified Cleanup Script  
# Replaces: force-cleanup.bat, diagnose-npm.ps1, check-all-packages.ps1

param(
    [switch]$Deep,
    [switch]$Diagnose,
    [switch]$ResetHard
)

Write-Host "🧹 AZ-Digital-Hub Cleanup System" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

if ($Diagnose) {
    Write-Host "🔍 Running project diagnostics..." -ForegroundColor Yellow
    
    # Check Node.js and npm versions
    Write-Host "📋 Environment Information:" -ForegroundColor Blue
    Write-Host "   Node.js: $(node --version)" -ForegroundColor White
    Write-Host "   npm: $(npm --version)" -ForegroundColor White
    Write-Host "   PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor White
    
    # Check package.json and dependencies
    if (Test-Path "package.json") {
        Write-Host "📦 Package Information:" -ForegroundColor Blue
        $package = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "   Name: $($package.name)" -ForegroundColor White
        Write-Host "   Version: $($package.version)" -ForegroundColor White
        Write-Host "   Dependencies: $($package.dependencies.PSObject.Properties.Count)" -ForegroundColor White
        Write-Host "   DevDependencies: $($package.devDependencies.PSObject.Properties.Count)" -ForegroundColor White
    }
    
    # Check for common issues
    Write-Host "⚠️  Potential Issues:" -ForegroundColor Yellow
    if (Test-Path "node_modules/.package-lock.json") {
        Write-Host "   ❌ Corrupted package-lock detected" -ForegroundColor Red
    }
    if (-not (Test-Path "node_modules")) {
        Write-Host "   ⚠️  node_modules missing - run npm install" -ForegroundColor Yellow
    }
}

# Standard cleanup
Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Yellow

$itemsToClean = @(
    ".next",
    "out", 
    "dist",
    "coverage",
    "*.log",
    "*.tgz",
    ".vercel"
)

foreach ($item in $itemsToClean) {
    if (Test-Path $item) {
        Remove-Item $item -Recurse -Force
        Write-Host "   ✅ Removed $item" -ForegroundColor Green
    }
}

# Deep cleanup if requested
if ($Deep -or $ResetHard) {
    Write-Host "🔥 Deep cleanup - removing dependencies..." -ForegroundColor Red
    
    if (Test-Path "node_modules") {
        Remove-Item "node_modules" -Recurse -Force
        Write-Host "   ✅ Removed node_modules" -ForegroundColor Green
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json" -Force  
        Write-Host "   ✅ Removed package-lock.json" -ForegroundColor Green
    }
    
    if ($ResetHard) {
        Write-Host "💥 Hard reset - clearing npm cache..." -ForegroundColor Red
        npm cache clean --force
        Write-Host "   ✅ Cleared npm cache" -ForegroundColor Green
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "✅ Cleanup completed!" -ForegroundColor Green

if ($Deep -or $ResetHard) {
    Write-Host "💡 Next steps: Run './scripts/build.ps1' to reinstall" -ForegroundColor Cyan
}