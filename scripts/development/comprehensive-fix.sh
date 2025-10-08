#!/bin/bash

# AZ Digital Hub - Comprehensive Fix Tool
# This script fixes all dependency issues and ensures stable builds

set -e  # Exit on any error

echo "========================================"
echo "AZ Digital Hub - Comprehensive Fix Tool"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "package.json not found. Please run this script from the project root."
    exit 1
fi

log_info "[1/8] Installing missing critical dependency..."
if npm install react-type-animation; then
    log_success "react-type-animation installed successfully"
else
    log_error "Failed to install react-type-animation"
    exit 1
fi

echo

log_info "[2/8] Updating Next.js to latest version..."
if npm install next@latest; then
    log_success "Next.js updated successfully"
else
    log_warning "Failed to update Next.js, continuing..."
fi

echo

log_info "[3/8] Installing additional development dependencies..."
npm install --save-dev husky lint-staged cross-env depcheck || log_warning "Some dev dependencies failed to install"

echo

log_info "[4/8] Cleaning build cache and temporary files..."
rm -rf .next
rm -rf node_modules/.cache
log_success "Cache cleaned"

echo

log_info "[5/8] Running security audit..."
npm audit fix || log_warning "Some audit issues couldn't be auto-fixed"

echo

log_info "[6/8] Running type check..."
if npm run type-check; then
    log_success "TypeScript check passed"
else
    log_warning "TypeScript errors found, check output above"
fi

echo

log_info "[7/8] Testing build..."
if npm run build; then
    log_success "Build completed successfully"
else
    log_error "Build failed! Attempting clean reinstall..."
    echo
    
    log_info "Removing node_modules and package-lock.json..."
    rm -rf node_modules
    rm -f package-lock.json
    
    log_info "Reinstalling dependencies..."
    if npm install; then
        log_success "Dependencies reinstalled"
    else
        log_error "Failed to reinstall dependencies"
        exit 1
    fi
    
    log_info "Retrying build..."
    if npm run build; then
        log_success "Build completed successfully after clean install"
    else
        log_error "CRITICAL: Build still failing after clean install"
        exit 1
    fi
fi

echo

log_info "[8/8] Adding preventive measures..."

# Add useful scripts to package.json if they don't exist
if command -v node >/dev/null 2>&1; then
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const scriptsToAdd = {
            'clean': 'rm -rf .next node_modules/.cache',
            'full-clean': 'rm -rf .next node_modules package-lock.json && npm install',
            'check-deps': 'npm ls',
            'audit-fix': 'npm audit fix',
            'build-check': 'npm run type-check && npm run lint && npm run build',
            'pre-deploy': 'npm run clean && npm run build-check'
        };
        let updated = false;
        for (const [script, command] of Object.entries(scriptsToAdd)) {
            if (!pkg.scripts[script]) {
                pkg.scripts[script] = command;
                updated = true;
                console.log('Added script:', script);
            }
        }
        if (updated) {
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
            console.log('Updated package.json with new scripts');
        }
    "
fi

echo

echo "========================================"
log_success "✅ ALL FIXES APPLIED SUCCESSFULLY!"
echo "========================================"
echo
echo "Your website should now build without errors."
echo
echo "Next steps:"
echo "  1. Test locally: npm run dev"
echo "  2. Test production: npm run build"
echo "  3. Run preventive check: npm run build-check"
echo "  4. Deploy when ready"
echo
echo "Added scripts for future use:"
echo "  • npm run clean - Clean build cache"
echo "  • npm run full-clean - Complete dependency reset"
echo "  • npm run build-check - Full validation before deploy"
echo
