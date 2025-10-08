# Add Your Images Script
Write-Host "📸 Setting up your profile image and logo..." -ForegroundColor Cyan

# Instructions
Write-Host @"

✅ TO ADD YOUR IMAGES:

1. PROFILE IMAGE:
   - Save your professional photo as: ahmed-ziwar-profile.jpg
   - Copy it to: D:\az-digital-hub-production\AZ-Digital-Hub\public\images\
   
2. AMZ LOGO:
   - Save your logo as: AMZ-logo-tr.png
   - Copy it to: D:\az-digital-hub-production\AZ-Digital-Hub\public\

3. Once copied, refresh your browser at http://localhost:3002

Your images will automatically appear in:
- Profile photo: Hero section + About section
- Logo: Navigation bar

"@ -ForegroundColor Yellow

# Check if files exist
$profilePath = ".\public\images\ahmed-ziwar-profile.jpg"
$logoPath = ".\public\AMZ-logo-tr.png"

if (Test-Path $profilePath) {
    Write-Host "✅ Profile image found!" -ForegroundColor Green
} else {
    Write-Host "❌ Profile image not found at: $profilePath" -ForegroundColor Red
}

if (Test-Path $logoPath) {
    Write-Host "✅ Logo found!" -ForegroundColor Green
} else {
    Write-Host "❌ Logo not found at: $logoPath" -ForegroundColor Red
}

Write-Host "`nPress any key to open the folders..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open the folders for easy access
Start-Process explorer.exe "D:\az-digital-hub-production\AZ-Digital-Hub\public\images"
Start-Process explorer.exe "D:\az-digital-hub-production\AZ-Digital-Hub\public"