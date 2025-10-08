#!/bin/bash

echo "🚀 Preparing to push AZ Digital Hub to GitHub..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Navigate to project directory
cd "D:\Github-work\AZ-Digital-Hub" || exit

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}📁 Initializing Git repository...${NC}"
    git init
fi

# Check current git status
echo -e "\n${YELLOW}📊 Current Git Status:${NC}"
git status

# Add all files
echo -e "\n${YELLOW}📝 Adding all files to staging...${NC}"
git add .

# Create commit
echo -e "\n${YELLOW}💾 Creating commit...${NC}"
git commit -m "feat: Complete portfolio refactor with Next.js 14 and modern tech stack" \
  -m "- Migrated to Next.js 14 App Router" \
  -m "- Added Server Components and modern architecture" \
  -m "- Implemented Framer Motion animations" \
  -m "- Added Three.js visualizations" \
  -m "- Created responsive design with Tailwind CSS" \
  -m "- Added contact form with validation" \
  -m "- Optimized for performance (95+ Lighthouse)" \
  -m "- Full TypeScript implementation"

# Check if remote exists
if ! git remote -v | grep -q origin; then
    echo -e "\n${YELLOW}🔗 No remote repository found.${NC}"
    echo -e "${CYAN}Please enter your GitHub repository URL:${NC}"
    echo -e "Format: https://github.com/yourusername/AZ-Digital-Hub.git"
    read -p "Repository URL: " repo_url
    
    if [ -n "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo -e "${GREEN}✅ Remote added successfully!${NC}"
    else
        echo -e "${RED}❌ No repository URL provided. Please add remote manually:${NC}"
        echo "git remote add origin https://github.com/yourusername/AZ-Digital-Hub.git"
        exit 1
    fi
fi

# Show remote info
echo -e "\n${YELLOW}📡 Remote Repository:${NC}"
git remote -v

# Push to GitHub
echo -e "\n${CYAN}🚀 Pushing to GitHub...${NC}"
if git push -u origin main; then
    echo -e "\n${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo -e "${CYAN}🎉 Your portfolio is now on GitHub!${NC}"
    
    # Get and display repository URL
    remote_url=$(git config --get remote.origin.url)
    web_url=${remote_url%.git}
    web_url=${web_url/git@github.com:/https:\/\/github.com\/}
    
    echo -e "\n${YELLOW}🔗 View your repository at:${NC}"
    echo -e "${CYAN}$web_url${NC}"
else
    echo -e "\n${RED}❌ Push failed. Common issues:${NC}"
    echo -e "${YELLOW}1. Authentication - Make sure you're logged in to GitHub${NC}"
    echo -e "${YELLOW}2. Repository doesn't exist - Create it on GitHub first${NC}"
    echo -e "${YELLOW}3. Branch name - You might need to use 'master' instead of 'main'${NC}"
    echo -e "\nTry: ${CYAN}git push -u origin master${NC}"
fi
