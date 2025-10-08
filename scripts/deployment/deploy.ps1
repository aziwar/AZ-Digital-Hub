#!/usr/bin/env pwsh
# AZ-Digital-Hub Unified Deployment Script
# Replaces: deploy.bat, git-push-update.ps1, push-to-github.ps1

param(
    [string]$Message = "🚀 Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
    [switch]$Force,
    [switch]$SkipBuild
)

Write-Host "🚀 AZ-Digital-Hub Deployment System" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# Pre-deployment build (unless skipped)
if (-not $SkipBuild) {
    Write-Host "🏗️  Running pre-deployment build..." -ForegroundColor Yellow
    & "./scripts/build.ps1" -Production
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed - deployment aborted" -ForegroundColor Red
        exit 1
    }
}

# Git operations
Write-Host "📝 Committing changes..." -ForegroundColor Yellow

# Add all changes
git add .

# Check if there are changes to commit
$changes = git status --porcelain
if (-not $changes) {
    Write-Host "ℹ️  No changes to deploy" -ForegroundColor Blue
    exit 0
}

# Commit changes
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Yellow

if ($Force) {
    git push --force-with-lease origin main
} else {
    git push origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Vercel will auto-deploy from main branch" -ForegroundColor Cyan
    Write-Host "📊 Check deployment status at: https://vercel.com/dashboard" -ForegroundColor Blue
} else {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}