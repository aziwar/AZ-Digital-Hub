# Test Generate Assets API
. .\automation\setup-env.ps1

Write-Host "Testing image generation API..." -ForegroundColor Cyan

$body = @{
    brandName = "AZ-Digital-Hub"
    services = @("Digital Marketing", "IT Consulting")
    headshotCount = 1
    logoCount = 1
    serviceCount = 2
} | ConvertTo-Json

try {
    Write-Host "Calling API..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/generate-assets" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "SUCCESS! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Tee-Object -FilePath "generated-images.json"
    
    Write-Host "`nImage URLs generated!" -ForegroundColor Green
    Write-Host "Cost: `$$($response.data.totalCost)" -ForegroundColor Cyan
    Write-Host "Count: $($response.data.imageCount) images" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
}
