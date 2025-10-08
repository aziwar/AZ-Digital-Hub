# PowerShell helper to move non-critical files into tidy folders and stage them with git
# Review before running. This script only moves files that are safe-to-move per repository audit.

Write-Host "This script will move logs, backups and generated artifacts into archive/ and backups/ folders." -ForegroundColor Yellow

$moves = @(
    @{ src = 'dev.log'; dest = 'archive/dev.log' },
    @{ src = 'logs/mcp-puppeteer-2025-10-02.log'; dest = 'archive/logs/mcp-puppeteer-2025-10-02.log' },
    @{ src = 'logs/mcp-puppeteer-2025-10-03.log'; dest = 'archive/logs/mcp-puppeteer-2025-10-03.log' },
    @{ src = 'logs/.5f70681b38ce273ede39f332393c9c1e88d662b7-audit.json'; dest = 'archive/logs/.5f70681b38ce273ede39f332393c9c1e88d662b7-audit.json' },
    @{ src = 'generated-images.json'; dest = 'archive/generated-images.json' },
    @{ src = '.validation-results.json'; dest = 'archive/.validation-results.json' },
    @{ src = 'tsconfig.tsbuildinfo'; dest = 'tmp/tsconfig.tsbuildinfo' },
    @{ src = '.eslintrc.json.backup'; dest = 'archive/.eslintrc.json.backup' },
    @{ src = 'tailwind.config.ts.backup'; dest = 'archive/tailwind.config.ts.backup' },
    @{ src = 'public/images/ahmed-zewar-profile-backup-20250904_092237.jpeg'; dest = 'backups/images/ahmed-zewar-profile-backup-20250904_092237.jpeg' },
    @{ src = 'public/images/ahmed-zewar-profile-backup-20250904_093606.jpeg'; dest = 'backups/images/ahmed-zewar-profile-backup-20250904_093606.jpeg' },
    @{ src = 'nul'; dest = 'archive/nul' }
)

foreach ($m in $moves) {
    if (Test-Path $m.src) {
        Write-Host "Moving $($m.src) -> $($m.dest)" -ForegroundColor Green
        git mv $m.src $m.dest 2>$null
        if ($LASTEXITCODE -ne 0) {
            # Fallback: copy and remove so apply_patch shows the change if git mv fails in this environment
            Copy-Item -Path $m.src -Destination $m.dest -Force
            Remove-Item -Path $m.src -Force
        }
    } else {
        Write-Host "Not found: $($m.src)" -ForegroundColor DarkYellow
    }
}

Write-Host "Done. Review 'git status' and 'git diff --staged' before committing." -ForegroundColor Cyan
