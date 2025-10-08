# Generate AI Images - Final Test
Write-Host "🎨 Generating AI Images for AZ-Digital-Hub" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$body = @{
    brandName = "AZ-Digital-Hub"
    services = @(
        "Digital Marketing Strategy",
        "E-commerce Solutions",
        "IT Consulting",
        "Social Media Management"
    )
    headshotCount = 2    # Professional headshots
    logoCount = 2        # Brand logos
    serviceCount = 4     # One icon per service
} | ConvertTo-Json

try {
    Write-Host "`nCalling DALL-E 3 API..." -ForegroundColor Yellow
    Write-Host "This may take 30-60 seconds..." -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/generate-assets" -Method Post -Body $body -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "`n✅ SUCCESS! Images generated!" -ForegroundColor Green
        
        # Save to file
        $response | ConvertTo-Json -Depth 10 | Out-File "generated-images.json" -Encoding UTF8
        
        Write-Host "`nGeneration Summary:" -ForegroundColor Cyan
        Write-Host "- Total Images: $($response.data.imageCount)" -ForegroundColor White
        Write-Host "- Total Cost: `$$($response.data.totalCost)" -ForegroundColor White
        Write-Host "- Headshots: $($response.data.headshots.Count)" -ForegroundColor White
        Write-Host "- Logos: $($response.data.logos.Count)" -ForegroundColor White
        Write-Host "- Service Icons: $($response.data.serviceGraphics.PSObject.Properties.Count)" -ForegroundColor White
        
        Write-Host "`nImages saved to: generated-images.json" -ForegroundColor Green
        Write-Host "`nNext step: Update components with these images!" -ForegroundColor Yellow
    } else {
        Write-Host "Generation failed: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ ERROR: $_" -ForegroundColor Red
}
