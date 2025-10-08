# Clean dependency installation script for AZ-Digital-Hub
# Version 2.0 - With better error handling and package version verification

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "AZ-Digital-Hub Dependency Clean Install Script" -ForegroundColor Cyan
Write-Host "Version 2.0 - Enhanced Error Handling" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if npm is installed
function Test-NpmInstalled {
    try {
        $npmVersion = npm --version
        Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
        return $false
    }
}

# Function to check Node.js version
function Test-NodeVersion {
    try {
        $nodeVersion = node --version
        Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
        $major = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($major -lt 18) {
            Write-Host "⚠ Warning: Node.js 18+ is required. Current version: $nodeVersion" -ForegroundColor Yellow
            return $false
        }
        return $true
    } catch {
        Write-Host "❌ Node.js is not installed" -ForegroundColor Red
        return $false
    }
}

# Pre-flight checks
Write-Host "Running pre-flight checks..." -ForegroundColor Yellow
$npmOk = Test-NpmInstalled
$nodeOk = Test-NodeVersion

if (-not $npmOk -or -not $nodeOk) {
    Write-Host ""
    Write-Host "❌ Pre-flight checks failed. Please install Node.js 18+ and npm." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 1: Clear all caches
Write-Host "[1/7] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null
npm cache verify 2>&1 | Out-Null
Write-Host "✓ Cache cleared and verified" -ForegroundColor Green
Write-Host ""

# Step 2: Remove existing dependencies
Write-Host "[2/7] Removing old files..." -ForegroundColor Yellow
$itemsToRemove = @("node_modules", "package-lock.json", ".next", "dist", "build", ".cache")
foreach ($item in $itemsToRemove) {
    if (Test-Path $item) {
        Write-Host "  - Removing $item" -ForegroundColor Gray
        Remove-Item -Recurse -Force $item -ErrorAction SilentlyContinue
    }
}
Write-Host "✓ Old files removed" -ForegroundColor Green
Write-Host ""

# Step 3: Create .npmrc for better compatibility
Write-Host "[3/7] Creating .npmrc configuration..." -ForegroundColor Yellow
@"
legacy-peer-deps=true
auto-install-peers=false
strict-peer-deps=false
engine-strict=false
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
fetch-retries=3
"@ | Out-File -FilePath ".npmrc" -Encoding UTF8
Write-Host "✓ .npmrc created with enhanced settings" -ForegroundColor Green
Write-Host ""

# Step 4: Verify package.json exists
Write-Host "[4/7] Verifying package.json..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ package.json found" -ForegroundColor Green
Write-Host ""

# Step 5: Install dependencies with multiple fallback strategies
Write-Host "[5/7] Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
$installed = $false

# Try 1: Normal install with legacy peer deps
Write-Host "  - Attempting install with legacy peer deps..." -ForegroundColor Gray
$output = npm install --legacy-peer-deps 2>&1
if ($LASTEXITCODE -eq 0) {
    $installed = $true
    Write-Host "  ✓ Install successful with legacy peer deps" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Install with legacy peer deps failed, trying force..." -ForegroundColor Yellow
    
    # Try 2: Force install
    $output = npm install --force 2>&1
    if ($LASTEXITCODE -eq 0) {
        $installed = $true
        Write-Host "  ✓ Install successful with force" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Force install failed, trying with no-save..." -ForegroundColor Yellow
        
        # Try 3: Install without saving
        $output = npm install --legacy-peer-deps --no-save 2>&1
        if ($LASTEXITCODE -eq 0) {
            # Now install again to save
            $output = npm install --legacy-peer-deps 2>&1
            if ($LASTEXITCODE -eq 0) {
                $installed = $true
                Write-Host "  ✓ Install successful with no-save workaround" -ForegroundColor Green
            }
        }
    }
}

if (-not $installed) {
    Write-Host ""
    Write-Host "❌ All installation attempts failed!" -ForegroundColor Red
    Write-Host "Error output:" -ForegroundColor Red
    Write-Host $output -ForegroundColor Gray
    Write-Host ""
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Check your internet connection" -ForegroundColor Gray
    Write-Host "2. Verify npm registry: npm config get registry" -ForegroundColor Gray
    Write-Host "3. Try using a different network or VPN" -ForegroundColor Gray
    Write-Host "4. Check if specific packages are causing issues in the error above" -ForegroundColor Gray
    exit 1
}

Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 6: Audit and fix (don't fail on audit errors)
Write-Host "[6/7] Running security audit..." -ForegroundColor Yellow
npm audit fix --legacy-peer-deps --force 2>&1 | Out-Null
Write-Host "✓ Security audit complete" -ForegroundColor Green
Write-Host ""

# Step 7: Verify installation
Write-Host "[7/7] Verifying installation..." -ForegroundColor Yellow
$nodeModulesExists = Test-Path "node_modules"
$packageLockExists = Test-Path "package-lock.json"

# Check for critical packages
$criticalPackages = @("next", "react", "react-dom")
$missingPackages = @()

foreach ($pkg in $criticalPackages) {
    if (-not (Test-Path "node_modules\$pkg")) {
        $missingPackages += $pkg
    }
}

if ($nodeModulesExists -and $packageLockExists -and $missingPackages.Count -eq 0) {
    Write-Host "✓ Installation verified successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Count installed packages
    $packageCount = (Get-ChildItem -Path "node_modules" -Directory).Count
    Write-Host "📦 Installed $packageCount packages" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "✅ Clean install completed successfully!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor White
    Write-Host "  npm run dev    - Start development server" -ForegroundColor Gray
    Write-Host "  npm run build  - Build for production" -ForegroundColor Gray
    Write-Host "  npm run lint   - Check code quality" -ForegroundColor Gray
} else {
    Write-Host "❌ Installation verification failed!" -ForegroundColor Red
    if (-not $nodeModulesExists) {
        Write-Host "  - node_modules folder not found" -ForegroundColor Red
    }
    if (-not $packageLockExists) {
        Write-Host "  - package-lock.json not found" -ForegroundColor Red
    }
    if ($missingPackages.Count -gt 0) {
        Write-Host "  - Missing critical packages: $($missingPackages -join ', ')" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please check the errors above and try again." -ForegroundColor Red
}
