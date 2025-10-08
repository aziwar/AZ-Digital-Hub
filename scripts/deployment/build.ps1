#!/usr/bin/env pwsh
# AZ-Digital-Hub Unified Build Script
# Replaces: clean-install.ps1, force-cleanup.js, cleanup-and-setup.js

param(
    [switch]$Clean,
    [switch]$Force,
    [switch]$Production
)

Write-Host "🚀 AZ-Digital-Hub Build System v3.0" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# Clean installation if requested
if ($Clean -or $Force) {
    Write-Host "🧹 Cleaning previous installation..." -ForegroundColor Yellow
    
    if (Test-Path "node_modules") {
        Remove-Item "node_modules" -Recurse -Force
        Write-Host "   ✅ Removed node_modules" -ForegroundColor Green
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json" -Force
        Write-Host "   ✅ Removed package-lock.json" -ForegroundColor Green
    }
    
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-Host "   ✅ Removed .next cache" -ForegroundColor Green
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependency installation failed" -ForegroundColor Red
    exit 1
}

# Build application
if ($Production) {
    Write-Host "🏗️  Building for production..." -ForegroundColor Yellow
    npm run build
} else {
    Write-Host "🔍 Type checking..." -ForegroundColor Yellow
    npm run type-check
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "🚀 Ready for deployment to Vercel" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}