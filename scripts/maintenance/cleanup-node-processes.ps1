# Node.js Process Cleanup Script
# Terminates all Node.js processes except MCP servers

Write-Host "=== Node.js Process Cleanup ===" -ForegroundColor Yellow

# Get all Node.js processes
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js processes" -ForegroundColor Cyan
    
    # Display processes before termination
    $nodeProcesses | Select-Object Id, ProcessName, CPU | Format-Table
    
    # Terminate all Node.js processes
    $nodeProcesses | ForEach-Object {
        try {
            Stop-Process -Id $_.Id -Force
            Write-Host "Terminated process $($_.Id)" -ForegroundColor Green
        } catch {
            Write-Host "Failed to terminate process $($_.Id): $_" -ForegroundColor Red
        }
    }
    
    Write-Host "`nAll Node.js processes terminated" -ForegroundColor Green
} else {
    Write-Host "No Node.js processes found" -ForegroundColor Green
}

# Verify cleanup
Start-Sleep -Seconds 2
$remaining = Get-Process node -ErrorAction SilentlyContinue
if ($remaining) {
    Write-Host "`nWarning: $($remaining.Count) processes still running" -ForegroundColor Yellow
} else {
    Write-Host "`nCleanup complete - No Node.js processes running" -ForegroundColor Green
}
