# Component Update Script
# Safely updates existing components with image support

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "Updating components with image support..." -ForegroundColor Gray

# Check if generated-images.json exists
if (-not (Test-Path "$projectRoot\generated-images.json")) {
    Write-Host "⚠️  No generated-images.json found. Run with image generation first." -ForegroundColor Yellow
    exit 1
}

# Function to safely insert code into files
function Insert-CodeAtMarker {
    param(
        [string]$FilePath,
        [string]$Marker,
        [string]$NewCode,
        [string]$ImportCode = ""
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "⚠️  File not found: $FilePath" -ForegroundColor Yellow
        return $false
    }
    
    $content = Get-Content $FilePath -Raw
    
    # Add import if provided
    if ($ImportCode -and $content -notmatch [regex]::Escape($ImportCode)) {
        $content = $ImportCode + "`n" + $content
    }
    
    # Insert code at marker
    if ($content -match [regex]::Escape($Marker)) {
        $content = $content -replace [regex]::Escape($Marker), "$Marker`n$NewCode"
        $content | Out-File -FilePath $FilePath -Encoding UTF8
        return $true
    }
    
    return $false
}

# Update About.tsx
Write-Host "Updating About section..." -ForegroundColor Gray
$aboutPath = "$projectRoot\src\components\sections\About.tsx"
$aboutImport = "import OptimizedImage from '@/components/ui/OptimizedImage';"
$aboutCode = @'
        {/* Professional Headshot */}
        <div className="mb-8 flex justify-center">
          <OptimizedImage
            src="/api/placeholder-headshot"
            alt="Ahmed Ziwar - Digital Marketing Expert"
            width={300}
            height={300}
            className="rounded-full border-4 border-purple-500/30 shadow-2xl"
            priority
          />
        </div>
'@

# For safety, we'll just add a comment marker for manual update
$aboutMarker = "// TODO: Add headshot image here"
if ((Get-Content $aboutPath -Raw) -notmatch $aboutMarker) {
    $content = Get-Content $aboutPath -Raw
    $content = $content -replace "(About Ahmed Ziwar</h2>)", "`$1`n        $aboutMarker"
    $content | Out-File -FilePath $aboutPath -Encoding UTF8
}

# Update Services.tsx
Write-Host "Updating Services section..." -ForegroundColor Gray
$servicesPath = "$projectRoot\src\components\sections\Services.tsx"
$servicesMarker = "// TODO: Add service icon here"

# Add marker to services
$content = Get-Content $servicesPath -Raw
if ($content -notmatch $servicesMarker) {
    $content = $content -replace "(className=`"text-4xl mb-4`">)", "`$1`n              $servicesMarker"
    $content | Out-File -FilePath $servicesPath -Encoding UTF8
}

# Update Navigation.tsx
Write-Host "Updating Navigation..." -ForegroundColor Gray
$navPath = "$projectRoot\src\components\Navigation.tsx"
$navMarker = "// TODO: Add logo image here"

# Add marker to navigation
$content = Get-Content $navPath -Raw
if ($content -notmatch $navMarker) {
    $content = $content -replace "(AZ-Digital-Hub</span>)", "$navMarker`n          `$1"
    $content | Out-File -FilePath $navPath -Encoding UTF8
}

Write-Host "✅ Component markers added for manual image integration" -ForegroundColor Green
Write-Host @"

Manual Integration Steps:
1. Open each file and look for "// TODO:" comments
2. Use the generated-images.json file for image URLs
3. Import OptimizedImage component where needed
4. Replace markers with actual image components

Files to update:
- src/components/sections/About.tsx
- src/components/sections/Services.tsx  
- src/components/Navigation.tsx
"@ -ForegroundColor Yellow
