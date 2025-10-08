# 🚀 AZ-Digital-Hub Automation Guide
## Token-Efficient Execution Instructions

### Quick Start (Copy & Paste)
```powershell
# Option 1: Full Enhancement (generates images + updates code)
.\automation\enhance-images.ps1

# Option 2: Test Only (skip generation, just validate)
.\automation\enhance-images.ps1 -TestOnly

# Option 3: Skip Generation (use existing images)
.\automation\enhance-images.ps1 -SkipGeneration
```

### For Claude Sonnet 4 or Future Sessions
Just say: **"Run enhance-images.ps1"** and report results.

### What It Does
1. ✅ Creates safety backup
2. ✅ Generates AI images ($0.96)
3. ✅ Updates components
4. ✅ Tests everything locally
5. ✅ Prepares Git (no push)

### Token Usage
- **Old way:** ~35,000 tokens
- **New way:** ~500 tokens
- **Savings:** 98.5%

### Troubleshooting
```powershell
# If images fail to generate
$env:OPENAI_API_KEY = "your-key-here"

# Validate without running
.\automation\validate-enhancement.ps1

# Emergency rollback
git checkout main
git branch -D feature/ai-images-local
```

### Files Created
- `automation/enhance-images.ps1` - Main script
- `automation/create-components.ps1` - Component creator
- `automation/update-components.ps1` - Safe updater
- `automation/validate-enhancement.ps1` - Validator

### Future Pattern
All future enhancements will follow this pattern:
1. Create automation script
2. Test locally first
3. Manual GitHub push only after validation
