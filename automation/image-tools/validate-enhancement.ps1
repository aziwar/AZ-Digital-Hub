# Validation Script
# Validates the enhancement without pushing to GitHub

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "🔍 Running Enhancement Validation" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$issues = @()

# Check 1: Build Success
Write-Host "`nChecking build..." -ForegroundColor Gray
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    $issues += "Build failed"
    Write-Host "❌ Build failed" -ForegroundColor Red
} else {
    Write-Host "✅ Build passes" -ForegroundColor Green
}

# Check 2: TypeScript
Write-Host "Checking TypeScript..." -ForegroundColor Gray
$tsResult = npm run type-check 2>&1
if ($LASTEXITCODE -ne 0) {
    $issues += "TypeScript errors"
    Write-Host "❌ TypeScript errors" -ForegroundColor Red
} else {
    Write-Host "✅ TypeScript valid" -ForegroundColor Green
}

# Check 3: Generated Images
Write-Host "Checking generated images..." -ForegroundColor Gray
if (Test-Path "$projectRoot\generated-images.json") {
    $images = Get-Content "$projectRoot\generated-images.json" | ConvertFrom-Json
    if ($images.success -and $images.data.imageCount -gt 0) {
        Write-Host "✅ Images generated: $($images.data.imageCount) images, cost: `$$($images.data.totalCost)" -ForegroundColor Green
    } else {
        $issues += "Image generation incomplete"
        Write-Host "❌ Image generation incomplete" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  No images generated yet" -ForegroundColor Yellow
}

# Check 4: Git Status
Write-Host "Checking Git status..." -ForegroundColor Gray
$gitStatus = git status --porcelain
if ($gitStatus) {
    $fileCount = ($gitStatus -split "`n").Count
    Write-Host "✅ $fileCount files modified" -ForegroundColor Green
} else {
    Write-Host "⚠️  No changes detected" -ForegroundColor Yellow
}

# Summary
Write-Host "`n📊 VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

if ($issues.Count -eq 0) {
    Write-Host "✅ All checks passed!" -ForegroundColor Green
    Write-Host "`nReady for manual review and push to GitHub." -ForegroundColor Gray
} else {
    Write-Host "❌ Issues found:" -ForegroundColor Red
    $issues | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nFix issues before pushing to GitHub." -ForegroundColor Yellow
}

# Show next steps
Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review changes: npm run dev" -ForegroundColor Gray
Write-Host "2. Test all pages locally" -ForegroundColor Gray
Write-Host "3. Commit when ready: git commit -m 'feat: Add AI-generated images'" -ForegroundColor Gray
Write-Host "4. Push to GitHub: git push origin feature/ai-images-local" -ForegroundColor Gray
