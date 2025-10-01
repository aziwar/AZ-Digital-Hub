# 🚨 ZERO-DOWNTIME MIGRATION CHECKLIST
## SuperClaude Framework | Wave Orchestration Implementation

**Project**: AZ Digital Hub ESLint Migration  
**Created**: 2025-01-25  
**Status**: 🔄 IN PROGRESS  
**Risk Level**: 🚨 CRITICAL - Production blocking issues detected

---

## 📋 PRE-FLIGHT SAFETY CHECKLIST

### ✅ Safety Preparations
- [ ] **Create Emergency Backup Branch**
  ```bash
  git checkout -b backup/emergency-20250125
  git push origin backup/emergency-20250125
  ```
- [ ] **Verify Current Production State**
  ```bash
  git log --oneline -5  # Check current commit
  npm run build --if-present  # Verify build works
  ```
- [ ] **Check Deployment Configuration**
  ```bash
  ls .github/workflows/ vercel.json netlify.toml 2>/dev/null
  ```
- [ ] **Document Current Branch State**
  - Current branch: `feature/ai-images`
  - Last commit: `1f37d28`
  - Behind main by: 2 commits

---

## 🚨 EMERGENCY WAVE (30 minutes)
**PRIORITY: Restore deployment capability**

### Wave 1A: Module System Crisis Resolution (15 min)
**Status**: ⏳ PENDING

- [ ] **Convert validate-config.js to ESM**
  - [ ] Replace `const fs = require('fs');` → `import fs from 'fs';`
  - [ ] Replace `const path = require('path');` → `import path from 'path';`
  - [ ] Add ESM __dirname polyfill:
    ```javascript
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    ```
  - [ ] Test: `node scripts/validate-config.js`
  - [ ] Commit if working: `git add scripts/validate-config.js && git commit -m "fix: Convert validate-config.js to ESM - emergency fix"`

- [ ] **Convert validate-typescript.js to ESM**
  - [ ] Apply same ESM transformation pattern
  - [ ] Replace all `require()` statements with `import`
  - [ ] Add __dirname polyfill if needed
  - [ ] Test: `node scripts/validate-typescript.js`
  - [ ] Commit if working

**✅ SUCCESS CRITERIA**: Both scripts run without module errors

### Wave 1B: ESLint Crisis Prevention (15 min)
**Status**: ⏳ PENDING

- [ ] **Create .eslintignore file**
  ```bash
  cat > .eslintignore << 'EOF'
  .next/
  out/
  dist/
  node_modules/
  **/.next/
  **/out/
  **/dist/
  EOF
  ```

- [ ] **Commit critical configuration files**
  ```bash
  git add .eslintignore eslint.config.js .validation-results.json package.json tailwind.config.ts
  git commit -m "fix: Emergency ESLint configuration - restore quality gates

  - Add .eslintignore to exclude build artifacts (eliminates 3,500+ errors)
  - Include uncommitted eslint.config.js flat config
  - Update validation results and package configurations
  - Restore deployment pipeline functionality

  🤖 Generated with Claude Code

  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```

- [ ] **CRITICAL VALIDATION**
  ```bash
  npm run stage-3-eslint  # Should now pass
  npm run quality-gates   # Should complete successfully
  ```

**✅ SUCCESS CRITERIA**: Quality gates pass, deployment pipeline restored

---

## ⚡ STABILIZATION WAVE (1 hour)
**PRIORITY: Complete technical debt resolution**

### Remaining Script Conversions (45 min)
**Status**: ⏳ PENDING

Convert these scripts to ESM (one at a time):
- [ ] `scripts/fix-dependencies.js` ✅ (partially done - complete conversion)
- [ ] `scripts/fix-openai-safety.js`
- [ ] `scripts/fix-type-animation.js`
- [ ] `scripts/fix-typescript-errors.js`
- [ ] `scripts/immediate-fix.js`
- [ ] `scripts/remove-console.js`
- [ ] `scripts/strategic-eslint-fix.js`
- [ ] `scripts/validate-phase1.js`
- [ ] `scripts/complete-fix.js`
- [ ] `scripts/enhanced-fix.js`
- [ ] `scripts/final-eslint-fix.js`

**For each script**:
- [ ] Convert require() → import
- [ ] Add __dirname polyfill if needed
- [ ] Test execution: `node scripts/[filename].js`
- [ ] Commit individually: `git add scripts/[filename].js && git commit -m "fix: Convert [filename] to ESM"`

### TypeScript Quick Fixes (15 min)
**Status**: ⏳ PENDING

- [ ] **Fix unused variables**
  - [ ] `src/app/api/contact/route.ts:21` - `_error` variable
  - [ ] `src/components/sections/EnhancedContact.tsx:54` - `_error` variable

**✅ SUCCESS CRITERIA**: ESLint errors reduced to <100

---

## 🎯 QUALITY WAVE (2 hours)
**PRIORITY: Achieve production-grade code quality**

### Source Code ESLint Compliance (90 min)
**Status**: ⏳ PENDING

- [ ] **Fix @typescript-eslint/no-explicit-any violations**
  - [ ] `src/components/ui/PerformanceMetrics.tsx:33-34`
    ```typescript
    // Fix: (performance as any).memory
    // To: proper typing or unknown
    ```
  - [ ] `src/components/ui/TypeAnimation.tsx:9-11`
    ```typescript
    // Fix: wrapper?: any; speed?: any; deletionSpeed?: any;
    // To: proper component prop types
    ```
  - [ ] `src/lib/utils/index.ts:36,51`
    ```typescript
    // Fix: (...args: unknown[]) => any
    // To: proper generic constraints
    ```

- [ ] **Fix react-hooks/exhaustive-deps**
  - [ ] `src/components/ui/TypeAnimationFramer.tsx:88`
    ```typescript
    // Add 'sequence.length' to useEffect dependency array
    ```

- [ ] **Complete console.log cleanup in remaining scripts**
  - [ ] Comment out or remove all remaining console.log statements
  - [ ] Ensure logging uses proper logging method instead

### Final ESLint Validation (30 min)
**Status**: ⏳ PENDING

- [ ] **Run comprehensive ESLint check**
  ```bash
  npx eslint . --max-warnings 0
  ```
- [ ] **Validate all quality gates**
  ```bash
  npm run stage-1-safety    # Configuration validation
  npm run stage-2-typescript # TypeScript compilation
  npm run stage-3-eslint     # ESLint validation
  npm run stage-4-dependencies # Dependency audit
  npm run stage-5-build      # Next.js build
  npm run quality-gates      # All gates combined
  ```

**✅ SUCCESS CRITERIA**: Zero ESLint errors, all quality gates pass

---

## 🚀 PRODUCTION WAVE (30 minutes)
**PRIORITY: Safe production deployment**

### Pre-Deployment Validation (20 min)
**Status**: ⏳ PENDING

- [ ] **Sync with main branch**
  ```bash
  git fetch origin
  git checkout main
  git pull origin main
  git checkout feature/ai-images
  git rebase main  # Handle any conflicts
  ```

- [ ] **Final production readiness check**
  ```bash
  npm run build          # Verify production build
  npm run quality-gates  # All quality gates pass
  git status            # Ensure clean working directory
  ```

- [ ] **Create merge commit with proper message**
  ```bash
  git checkout main
  git merge feature/ai-images --no-ff -m "feat: Complete ESLint flat config migration and quality improvements

  Major changes:
  - Migrated from .eslintrc.json to eslint.config.js (ESLint v9 flat config)
  - Converted all scripts from CommonJS to ESM modules
  - Added comprehensive .eslintignore for build artifacts
  - Fixed TypeScript compliance issues across components
  - Updated dependencies to latest versions
  - Implemented systematic console.log cleanup
  - Achieved zero ESLint errors and warnings

  Quality gates: All passing
  Build status: ✅ Successful
  Deployment safety: ✅ Validated

  🤖 Generated with Claude Code

  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```

### Production Deployment (10 min)
**Status**: ⏳ PENDING

- [ ] **Push to production**
  ```bash
  git push origin main
  ```

- [ ] **Monitor deployment pipeline**
  - [ ] Check build status (CI/CD, Vercel, Netlify, etc.)
  - [ ] Verify production site loads correctly
  - [ ] Test key user journeys
  - [ ] Monitor error logs for first 10 minutes

**✅ SUCCESS CRITERIA**: Production site functional, no new errors detected

---

## 📊 ROLLBACK PROCEDURES

### Emergency Rollback Commands
```bash
# For any wave failure - return to backup
git reset --hard backup/emergency-20250125

# For production issues - rollback main branch
git checkout main
git reset --hard f03b029  # Last known good commit
git push --force-with-lease origin main
```

### Rollback Decision Matrix
| Issue Type | Rollback Level | Command |
|------------|----------------|---------|
| Script conversion fails | File level | `git checkout HEAD~1 -- scripts/filename.js` |
| Quality gates fail | Wave level | `git reset --hard HEAD~3` |
| Production breaks | Full rollback | Use emergency rollback |

---

## 📈 PROGRESS TRACKING

### Wave Completion Status
- [ ] 🚨 Emergency Wave (30 min) - **CRITICAL PRIORITY**
- [ ] ⚡ Stabilization Wave (1 hour) - **HIGH PRIORITY** 
- [ ] 🎯 Quality Wave (2 hours) - **MEDIUM PRIORITY**
- [ ] 🚀 Production Wave (30 min) - **DEPLOYMENT READY**

### Success Metrics
- **ESLint Errors**: 4,834 → Target: 0
- **Quality Gates**: ❌ Failed → Target: ✅ All Pass  
- **Build Status**: ⚠️ Issues → Target: ✅ Clean
- **Deployment**: 🚫 Blocked → Target: ✅ Ready

---

## 🔍 VALIDATION CHECKLIST

### After Each Wave
- [ ] All tests pass: `npm test --if-present`
- [ ] Build succeeds: `npm run build`
- [ ] Quality gates pass: `npm run quality-gates`
- [ ] No new runtime errors
- [ ] Git working directory clean

### Final Production Validation
- [ ] Production site loads correctly
- [ ] Key user journeys functional
- [ ] No console errors in browser
- [ ] Performance metrics maintained
- [ ] Search functionality works
- [ ] Contact forms submit properly
- [ ] Navigation links work
- [ ] Mobile responsiveness maintained

---

## 📝 NOTES & LEARNINGS

### Key Insights
- Module system mismatch (CommonJS vs ESM) was the primary blocking issue
- Build artifacts in .next/ were causing majority of ESLint errors
- Systematic approach prevents cascading failures
- Git backup strategy essential for confidence

### Post-Migration Improvements
- [ ] Set up pre-commit hooks for ESLint
- [ ] Implement conventional commit standards
- [ ] Configure automated dependency updates
- [ ] Add performance monitoring alerts

---

**Last Updated**: 2025-01-25  
**Next Review**: After each wave completion  
**Emergency Contact**: Repository maintainer  

> This checklist follows SuperClaude framework principles: Evidence > assumptions | Code > documentation | Efficiency > verbosity