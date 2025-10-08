#!/bin/bash
# git-push-update.sh - Push website updates to GitHub

echo "======================================="
echo "  Pushing AZ Digital Hub to GitHub"
echo "======================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository. Initializing..."
    git init
fi

# Get current branch
BRANCH=$(git branch --show-current)
if [ -z "$BRANCH" ]; then
    BRANCH="main"
    git checkout -b main
fi

echo "📌 Current branch: $BRANCH"
echo ""

# Add all changes
echo "📝 Adding all changes..."
git add -A

# Show status
echo ""
echo "📊 Git status:"
git status --short

# Commit changes
echo ""
echo "💾 Committing changes..."
COMMIT_MSG="Update: Complete website redesign with professional portfolio

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
- Optimized for performance and SEO"

git commit -m "$COMMIT_MSG"

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo ""
    echo "❌ No remote repository configured."
    echo "Please add your GitHub repository URL:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    exit 1
fi

# Get remote URL
REMOTE_URL=$(git remote get-url origin)
echo ""
echo "🔗 Remote repository: $REMOTE_URL"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin $BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your updated website is now on GitHub!"
    echo "Branch: $BRANCH"
    echo "Repository: $REMOTE_URL"
else
    echo ""
    echo "❌ Push failed. Please check your credentials and try again."
    echo ""
    echo "If you haven't set up GitHub credentials, try:"
    echo "1. git config --global user.name 'Your Name'"
    echo "2. git config --global user.email 'your.email@example.com'"
    echo ""
    echo "For authentication issues, you may need a Personal Access Token:"
    echo "https://github.com/settings/tokens"
fi