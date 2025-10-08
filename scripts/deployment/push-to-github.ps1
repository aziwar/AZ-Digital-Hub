# Git Push Script for AZ Digital Hub

Write-Host "🚀 Preparing to push AZ Digital Hub to GitHub..." -ForegroundColor Cyan

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Navigate to project directory
Set-Location -Path "D:\Github-work\AZ-Digital-Hub"

# Initialize git if not already initialized
if (!(Test-Path .git)) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
}

# Check current git status
Write-Host "`n📊 Current Git Status:" -ForegroundColor Yellow
git status

# Add all files
Write-Host "`n📝 Adding all files to staging..." -ForegroundColor Yellow
git add .

# Create commit
$commitMessage = "feat: Complete portfolio refactor with Next.js 14 and modern tech stack"
Write-Host "`n💾 Creating commit..." -ForegroundColor Yellow
git commit -m $commitMessage -m "- Migrated to Next.js 14 App Router" -m "- Added Server Components and modern architecture" -m "- Implemented Framer Motion animations" -m "- Added Three.js visualizations" -m "- Created responsive design with Tailwind CSS" -m "- Added contact form with validation" -m "- Optimized for performance (95+ Lighthouse)" -m "- Full TypeScript implementation"

# Check if remote exists
$remoteExists = git remote -v
if (!$remoteExists) {
    Write-Host "`n🔗 No remote repository found." -ForegroundColor Yellow
    Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Cyan
    Write-Host "Format: https://github.com/yourusername/AZ-Digital-Hub.git" -ForegroundColor Gray
    $repoUrl = Read-Host "Repository URL"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✅ Remote added successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ No repository URL provided. Please add remote manually:" -ForegroundColor Red
        Write-Host "git remote add origin https://github.com/yourusername/AZ-Digital-Hub.git" -ForegroundColor Gray
        exit 1
    }
}

# Show remote info
Write-Host "`n📡 Remote Repository:" -ForegroundColor Yellow
git remote -v

# Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🎉 Your portfolio is now on GitHub!" -ForegroundColor Cyan
    
    # Get remote URL
    $remoteUrl = git config --get remote.origin.url
    $webUrl = $remoteUrl -replace '\.git$', ''
    if ($webUrl -match "git@") {
        $webUrl = $webUrl -replace 'git@github.com:', 'https://github.com/'
    }
    
    Write-Host "`n🔗 View your repository at:" -ForegroundColor Yellow
    Write-Host $webUrl -ForegroundColor Blue
} else {
    Write-Host "`n❌ Push failed. Common issues:" -ForegroundColor Red
    Write-Host "1. Authentication - Make sure you're logged in to GitHub" -ForegroundColor Yellow
    Write-Host "2. Repository doesn't exist - Create it on GitHub first" -ForegroundColor Yellow
    Write-Host "3. Branch name - You might need to use 'master' instead of 'main'" -ForegroundColor Yellow
    Write-Host "`nTry: git push -u origin master" -ForegroundColor Gray
}
