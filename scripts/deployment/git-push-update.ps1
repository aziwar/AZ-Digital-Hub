# git-push-update.ps1 - Push website updates to GitHub

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Pushing AZ Digital Hub to GitHub" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
$gitDir = git rev-parse --git-dir 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not a git repository. Initializing..." -ForegroundColor Red
    git init
}

# Get current branch
$branch = git branch --show-current
if ([string]::IsNullOrEmpty($branch)) {
    $branch = "main"
    git checkout -b main
}

Write-Host "📌 Current branch: $branch" -ForegroundColor Yellow
Write-Host ""

# Add all changes
Write-Host "📝 Adding all changes..." -ForegroundColor Green
git add -A

# Show status
Write-Host ""
Write-Host "📊 Git status:" -ForegroundColor Yellow
git status --short

# Commit changes
Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Green
$commitMsg = @"
Update: Complete website redesign with professional portfolio

- Fixed all build errors and dependencies
- Created new Hero section with professional introduction
- Added About section with experience timeline
- Implemented Services section with 6 core offerings
- Built Portfolio section showcasing key projects
- Created Contact section with form and info
- Added responsive navigation with mobile menu
- Implemented dark theme with modern design
- Fixed Tailwind CSS configuration
- Resolved missing dependencies (critters)
- Optimized for performance and SEO
"@

git commit -m $commitMsg

# Check if remote exists
$remotes = git remote
if ($remotes -notcontains "origin") {
    Write-Host ""
    Write-Host "❌ No remote repository configured." -ForegroundColor Red
    Write-Host "Please add your GitHub repository URL:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Cyan
    exit 1
}

# Get remote URL
$remoteUrl = git remote get-url origin
Write-Host ""
Write-Host "🔗 Remote repository: $remoteUrl" -ForegroundColor Cyan

# Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green
git push -u origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your updated website is now on GitHub!" -ForegroundColor Cyan
    Write-Host "Branch: $branch" -ForegroundColor Yellow
    Write-Host "Repository: $remoteUrl" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Please check your credentials and try again." -ForegroundColor Red
    Write-Host ""
    Write-Host "If you haven't set up GitHub credentials, try:" -ForegroundColor Yellow
    Write-Host "1. git config --global user.name 'Ahmed Ziwar'" -ForegroundColor Cyan
    Write-Host "2. git config --global user.email 'ahmed@zewar.xyz'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "For authentication issues, you may need a Personal Access Token:" -ForegroundColor Yellow
    Write-Host "https://github.com/settings/tokens" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")