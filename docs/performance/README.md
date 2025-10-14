# Performance Testing Suite - Entrance Animation Refactoring

**Comprehensive performance measurement and testing strategy for CSS animation → Intersection Observer refactoring**

---

## 📚 Documentation Overview

This directory contains the complete performance testing infrastructure for the entrance animation refactoring project.

### Documents

1. **[ENTRANCE_ANIMATION_PERFORMANCE_STRATEGY.md](./ENTRANCE_ANIMATION_PERFORMANCE_STRATEGY.md)**
   - Complete performance measurement and testing strategy
   - Baseline metrics and success criteria
   - Testing methodologies and tools
   - Performance monitoring plan

2. **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)**
   - Quick reference testing checklist
   - Pre/during/post refactoring steps
   - Deployment validation
   - Troubleshooting guide

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Playwright for visual regression and performance testing
npm install --save-dev @playwright/test playwright

# Install Lighthouse CLI
npm install -g lighthouse
```

### 2. Create Performance Baseline

```bash
# Step 1: Build current version
npm run build

# Step 2: Create baseline metrics
npm run perf:baseline

# Step 3: Generate Lighthouse reports
npm run lighthouse
npm run lighthouse:mobile

# Step 4: Create visual baselines
npm run test:visual:baseline
```

**Baseline files will be created in**:
- `reports/performance/baseline.json`
- `reports/lighthouse.html`
- `reports/lighthouse-mobile.html`
- `tests/visual/__screenshots__/`

### 3. Run Performance Tests

```bash
# Full performance test suite
npm run test:performance

# Individual test commands
npm run perf:compare      # Bundle size comparison
npm run perf:fps          # Frame rate measurement
npm run test:visual       # Visual regression tests
```

---

## 📊 Performance Metrics

### Success Criteria

**Bundle Size**:
- ✅ CSS reduction: 30-50% (400-500 bytes)
- ✅ Gzipped reduction: 200-300 bytes
- ✅ No significant JS increase (<500 bytes)

**Frame Rate**:
- ✅ Maintain 60fps during animations
- ✅ No frame drops on mid-range devices
- ✅ Smooth scroll performance

**Web Vitals**:
- ✅ FCP < 1.8s (P75)
- ✅ LCP < 2.5s (P75)
- ✅ CLS < 0.1 (P75)
- ✅ TBT < 200ms

**Lighthouse**:
- ✅ Performance score: 95+
- ✅ No regressions in other categories
- ✅ Mobile score improvement

---

## 🧪 Testing Infrastructure

### Automated Tests

#### 1. Visual Regression Tests
**Location**: `tests/visual/entrance-animations.spec.ts`

**Coverage**:
- Hero section initial state
- Hero section animated state
- Title/tagline/CTA animations
- Staggered children animations
- Mobile viewport behavior
- Reduced motion support
- RTL (Arabic) animations
- Cross-browser consistency

**Run Tests**:
```bash
# All visual tests
npm run test:visual

# Specific browser
npm run test:visual -- --project=chromium
npm run test:visual -- --project=firefox
npm run test:visual -- --project=webkit

# Update baselines (after intentional changes)
npm run test:visual:baseline
```

#### 2. Performance Tests
**Location**: `tests/performance/animation-fps.spec.ts`

**Coverage**:
- FPS measurement during animations
- Layout stability (CLS)
- Intersection Observer efficiency
- Memory usage
- Web Vitals (FCP, LCP, CLS)
- Scroll performance
- Mobile performance

**Run Tests**:
```bash
# All performance tests
npm run test:performance

# Individual metrics
npm run perf:fps          # Frame rate measurement
npm run perf:compare      # Bundle size comparison
```

### Manual Testing

#### Browser Testing Matrix

**Desktop Browsers**:
- Chrome (latest)
- Firefox (latest)
- Safari (macOS)
- Edge (latest)

**Mobile Browsers**:
- iOS Safari (iPhone SE, iPhone 13, iPhone 14 Pro)
- Chrome Mobile (Android)
- Samsung Internet

**Special Cases**:
- Reduced motion (accessibility)
- Touch devices (tablets)
- RTL layout (Arabic)

#### Testing Tools

**Chrome DevTools**:
- Performance tab → Record animation sequence
- Rendering → Frame Rendering Stats
- Emulate CSS media → prefers-reduced-motion

**Firefox DevTools**:
- Performance profiler
- Accessibility inspector

**Safari Web Inspector**:
- Timeline recording
- Responsive Design Mode

---

## 📈 Performance Measurement Scripts

### 1. Bundle Size Comparison
**Script**: `scripts/performance/compare-bundles.js`

**Purpose**: Analyzes Next.js build output and compares bundle sizes before/after refactoring

**Usage**:
```bash
npm run perf:baseline    # Create baseline
npm run perf:compare     # Compare with baseline
```

**Output**:
```
📊 Bundle Analysis Report

Total CSS: 45.23 KB (12.34 KB gzipped)
Total JS: 128.45 KB (42.56 KB gzipped)

🎬 Animation CSS:
Estimated Size: 1.43 KB (0.62 KB gzipped)

📈 Comparison with Baseline
CSS Bundle:
  Before: 12.34 KB
  After:  11.92 KB
  Change: -420 B (-3.41%)

✅ Success Criteria:
  Target: 30-50% animation CSS reduction
  Actual: 42.3%
  Status: ✅ Target met!
```

### 2. Frame Rate Measurement
**Script**: `scripts/performance/measure-fps.js`

**Purpose**: Uses Playwright to measure real-world animation performance in browser

**Usage**:
```bash
# Start dev server first
npm run dev

# In another terminal
npm run perf:fps
```

**Output**:
```
🎬 Frame Rate Performance Testing

📊 Testing: Hero Section - Initial Load
  Average FPS: 59.82
  Min FPS: 57.41
  Max FPS: 60.12
  Frame Drops (<55fps): 0/120
  Status: ✅ Excellent

📈 Test Summary:
  Total Tests: 4
  Passed: 4
  Warnings: 0
  Failed: 0
```

---

## 🔍 Monitoring & Reporting

### Vercel Speed Insights

**Real User Monitoring (RUM)**:
- Automatic data collection from real users
- Core Web Vitals tracking
- Geographic performance breakdown
- Device/browser performance analysis

**Dashboard**: https://vercel.com/dashboard/speed-insights

**Key Metrics**:
- P75 FCP: Target <1.8s
- P75 LCP: Target <2.5s
- P75 CLS: Target <0.1
- P75 INP: Target <200ms

### Lighthouse CI

**Configuration**: `.lighthouserc.js` (to be created)

**Continuous Integration**:
```yaml
# .github/workflows/lighthouse.yml
- Runs on every PR
- Compares before/after metrics
- Fails if performance regresses
- Generates HTML reports
```

**Manual Lighthouse**:
```bash
npm run lighthouse         # Desktop
npm run lighthouse:mobile  # Mobile
```

### Custom Performance Reports

**Reports Directory**: `reports/performance/`

**Generated Files**:
- `baseline.json` - Initial metrics snapshot
- `bundle-analysis-*.json` - Bundle size comparisons
- `fps-analysis-*.json` - Frame rate measurements
- Lighthouse HTML reports

---

## 🎯 Implementation Workflow

### Phase 1: Pre-Refactoring (Baseline)
```bash
1. npm run build
2. npm run perf:baseline
3. npm run lighthouse && npm run lighthouse:mobile
4. npm run test:visual:baseline
5. Review and document baseline metrics
```

### Phase 2: Refactoring
```bash
1. Implement Intersection Observer hook
2. Replace CSS animations with observer triggers
3. Update animation timing logic
4. Test locally during development
5. Run unit tests for hooks
```

### Phase 3: Validation
```bash
1. npm run build
2. npm run test:visual
3. npm run test:performance
4. npm run perf:compare
5. Review all test results
```

### Phase 4: Deployment
```bash
1. vercel deploy --preview
2. Test preview deployment
3. Monitor Vercel Speed Insights
4. Deploy to production
5. Continue monitoring for 1 week
```

---

## 🔧 Configuration Files

### package.json Scripts

```json
{
  "scripts": {
    "perf:baseline": "npm run build && node scripts/performance/compare-bundles.js",
    "perf:compare": "npm run build && node scripts/performance/compare-bundles.js",
    "perf:fps": "npm run dev & sleep 5 && node scripts/performance/measure-fps.js",
    "lighthouse": "lighthouse http://localhost:3000/en --output html --output-path reports/lighthouse.html",
    "lighthouse:mobile": "lighthouse http://localhost:3000/en --output html --output-path reports/lighthouse-mobile.html --preset=mobile",
    "test:visual:baseline": "playwright test --update-snapshots",
    "test:visual": "playwright test",
    "test:performance": "npm run perf:compare && npm run perf:fps"
  }
}
```

### Playwright Configuration

**File**: `playwright.config.ts`

**Projects**:
- `chromium` - Desktop Chrome
- `firefox` - Desktop Firefox
- `webkit` - Desktop Safari
- `mobile-chrome` - Pixel 5
- `mobile-safari` - iPhone 13
- `reduced-motion` - Accessibility testing
- `tablet` - iPad Pro

### Test Directories

```
tests/
├── visual/
│   └── entrance-animations.spec.ts    # Visual regression tests
├── performance/
│   └── animation-fps.spec.ts          # Performance tests
└── unit/
    └── useScrollObserver.test.ts      # Hook unit tests (to be created)
```

---

## 📋 Common Commands

### Testing
```bash
# Full test suite
npm run test:visual && npm run test:performance

# Individual test suites
npm run test:visual                    # Visual regression
npm run test:performance               # Performance tests
npm run perf:fps                       # FPS measurement

# Specific browser
npm run test:visual -- --project=chromium
npm run test:visual -- --project=mobile-safari

# Update visual baselines
npm run test:visual:baseline
```

### Performance Analysis
```bash
# Create baseline
npm run perf:baseline

# Compare with baseline
npm run perf:compare

# Lighthouse reports
npm run lighthouse
npm run lighthouse:mobile
```

### Development
```bash
# Start dev server
npm run dev

# Build production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

### Deployment
```bash
# Preview deployment
vercel deploy --preview

# Production deployment
vercel deploy --prod
```

---

## 🆘 Troubleshooting

### Tests Failing

**Visual regression tests failing**:
```bash
# Review differences
npx playwright show-report

# If intentional changes
npm run test:visual:baseline
```

**FPS tests failing**:
```
1. Check animation complexity
2. Test on real devices
3. Review Intersection Observer config
4. Verify GPU acceleration enabled
```

**Bundle size not reducing**:
```bash
# Analyze bundle
npx @next/bundle-analyzer

# Check for:
- Duplicate animation code
- Unnecessary imports
- Large polyfills
```

### Common Issues

**Issue**: Playwright not installed
```bash
npm install --save-dev @playwright/test playwright
npx playwright install
```

**Issue**: Lighthouse not found
```bash
npm install -g lighthouse
```

**Issue**: Reports directory not found
```bash
mkdir -p reports/performance reports/playwright
```

---

## 📚 Additional Resources

### Documentation
- [Web Vitals](https://web.dev/vitals/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Playwright Testing](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)

### Tools
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Firefox Performance Tools](https://firefox-source-docs.mozilla.org/devtools-user/performance/)
- [WebPageTest](https://www.webpagetest.org/)
- [BrowserStack](https://www.browserstack.com/)

---

## 📞 Support

For questions or issues with the performance testing suite:

1. Check the troubleshooting section above
2. Review the full strategy document
3. Check Playwright documentation
4. Open an issue on GitHub

---

**Version**: 1.0
**Last Updated**: 2025-10-14
**Maintained By**: Performance Engineering Team
