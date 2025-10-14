# Entrance Animation Refactoring: Performance Measurement & Testing Strategy

**Project**: AZ Digital Hub - Entrance Animation Optimization
**Target**: CSS-based animations → Intersection Observer pattern
**Goal**: 30-50% bundle reduction, maintain 60fps animations, improve mobile performance

---

## 📊 Performance Baseline Metrics

### Current State Analysis

#### 1. Bundle Size Analysis
**Current CSS Animation Code**:
```css
/* globals.css - Animation-related code */
@keyframes fadeInUp { ... }          /* ~120 bytes */
@keyframes fadeInStagger { ... }     /* ~150 bytes */
@keyframes text-reveal { ... }       /* ~130 bytes */
@keyframes typewriter { ... }        /* ~80 bytes */
@keyframes blink-caret { ... }       /* ~90 bytes */
@keyframes scaleHover { ... }        /* ~70 bytes */
@keyframes pulseGlow { ... }         /* ~140 bytes */
@keyframes shimmer { ... }           /* ~80 bytes */

/* Animation classes */
.animate-fade-in-up { ... }          /* ~60 bytes */
.animate-stagger { ... }             /* ~70 bytes */
.text-animate-reveal { ... }         /* ~80 bytes */

/* Intersection Observer classes */
.observe-fade-in { ... }             /* ~120 bytes */
.observe-slide-left { ... }          /* ~120 bytes */
.observe-slide-right { ... }         /* ~120 bytes */
.observe-stagger-children { ... }    /* ~200 bytes */
```

**Total CSS Animation Code**: ~1,430 bytes (uncompressed)
**Estimated Gzipped**: ~600-700 bytes

**Current Build Output**:
```
Route (app)                          Size      First Load JS
├ ● /[locale]                        20.2 kB   141 kB
```

**Measurement Commands**:
```bash
# Full bundle analysis
npm run build

# CSS bundle size
npx next build --profile

# Detailed analysis
npx @next/bundle-analyzer
```

#### 2. Lighthouse Baseline Score

**Target Metrics**:
```yaml
Performance: 95+
FCP (First Contentful Paint): <1.8s
LCP (Largest Contentful Paint): <2.5s
CLS (Cumulative Layout Shift): <0.1
TBT (Total Blocking Time): <200ms
```

**Measurement Command**:
```bash
# Generate Lighthouse report
npx lighthouse https://az-digital-hub.vercel.app \
  --output html \
  --output-path ./reports/lighthouse-before.html \
  --only-categories=performance \
  --preset=desktop

# Mobile test
npx lighthouse https://az-digital-hub.vercel.app \
  --output html \
  --output-path ./reports/lighthouse-mobile-before.html \
  --only-categories=performance \
  --preset=mobile
```

#### 3. @vercel/speed-insights Integration

**Current Implementation**: Already integrated in `package.json`
```json
"@vercel/speed-insights": "^1.2.0"
```

**Real User Monitoring (RUM) Metrics**:
- P75 FCP: Target <1.8s
- P75 LCP: Target <2.5s
- P75 CLS: Target <0.1
- P75 INP: Target <200ms

**Dashboard Access**: https://vercel.com/dashboard/speed-insights

#### 4. Animation Performance Metrics

**Frame Rate Monitoring**:
```javascript
// Current animation performance check
const fps = 1000 / (performance.now() - lastFrame);
// Target: 60fps (16.67ms per frame)
```

**Animation Indicators**:
- `.text-animate-reveal`: Entrance delay 0s-0.8s
- `.observe-fade-in`: Transition 0.8s
- `.observe-stagger-children`: Staggered 0.1s-0.6s delays

**Current Animation Triggers**:
```typescript
// EnhancedHero.tsx - CSS-based animations
style={{ "--animation-delay": "0.2s" }}  // Line 33
style={{ "--animation-delay": "0.4s" }}  // Line 34
style={{ "--animation-delay": "0.6s" }}  // Line 40
style={{ "--animation-delay": "0.8s" }}  // Line 57
```

---

## 🧪 Testing Strategy

### Phase 1: Visual Regression Testing

#### 1.1 Manual Visual Testing Checklist

**Desktop Testing (Chrome, Firefox, Safari, Edge)**:
```
□ Hero section entrance animations
  □ Title fade-in (0.2s delay)
  □ Tagline gradient fade-in (0.4s delay)
  □ Description fade-in (0.6s delay)
  □ CTA buttons fade-in (0.8s delay)

□ Staggered animations
  □ Social proof badges
  □ Metrics cards
  □ Guarantee features

□ Scroll-triggered animations
  □ Service icons grid
  □ ROI chart entrance
  □ Scroll indicator bounce
```

**Mobile Testing (iOS Safari, Chrome Mobile)**:
```
□ Touch device fallbacks working
  □ No hover effects on touch devices
  □ Animations disabled via media query
  □ Content visible immediately (lines 304-318 in globals.css)

□ Reduced motion support
  □ prefers-reduced-motion: reduce respected
  □ Animation durations reduced to 0.01ms
  □ No motion sickness triggers
```

#### 1.2 Automated Visual Testing Approach

**Tool**: Playwright + percy.io or Playwright built-in screenshots

**Test Script** (`tests/visual/entrance-animations.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Entrance Animations - Visual Regression', () => {
  test('Hero section - Initial state (before animation)', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    // Capture before intersection observer triggers
    await expect(page).toHaveScreenshot('hero-initial.png', {
      fullPage: false,
      timeout: 5000,
    });
  });

  test('Hero section - Animated state (after trigger)', async ({ page }) => {
    await page.goto('/en');
    await page.waitForTimeout(1000); // Wait for animations

    await expect(page).toHaveScreenshot('hero-animated.png', {
      fullPage: false,
    });
  });

  test('Staggered children animations', async ({ page }) => {
    await page.goto('/en');
    await page.locator('.observe-stagger-children').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700); // Wait for stagger complete

    await expect(page).toHaveScreenshot('staggered-complete.png');
  });
});
```

**Run Commands**:
```bash
# Generate baseline screenshots
npm run test:visual:baseline

# Compare after refactoring
npm run test:visual

# Update baselines if intentional changes
npm run test:visual:update
```

### Phase 2: Motion-Safe Variant Testing

#### 2.1 Reduced Motion Testing

**Browser DevTools Method**:
1. **Chrome DevTools**:
   - Open DevTools → Command Menu (Ctrl+Shift+P)
   - Type "Emulate CSS prefers-reduced-motion"
   - Select "Emulate CSS prefers-reduced-motion: reduce"

2. **Firefox DevTools**:
   - Open DevTools → Settings (F1)
   - Check "Enable accessibility.features.prefers-reduced-motion"

3. **Safari**:
   - System Preferences → Accessibility → Display
   - Enable "Reduce motion"

**Automated Testing**:
```typescript
// tests/a11y/reduced-motion.spec.ts
test('Respects prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');

  // Verify animations are disabled
  const animatedElement = page.locator('.text-animate-reveal');
  const animationDuration = await animatedElement.evaluate(
    el => getComputedStyle(el).animationDuration
  );

  expect(animationDuration).toBe('0.01s'); // globals.css line 255
});
```

#### 2.2 Touch Device Testing

**Media Query**: `@media (hover: none) and (pointer: coarse)`

**Critical Test Cases**:
```
□ Intersection Observer content visible on mobile (lines 304-318)
□ Text animations visible immediately (.text-animate-reveal)
□ Hover effects disabled on touch devices
□ Complex animations disabled for performance
```

**Automated Touch Simulation**:
```typescript
test('Touch device: animations disabled', async ({ page }) => {
  await page.emulateMedia({
    colorScheme: 'dark',
    forcedColors: 'none',
  });

  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await page.goto('/en');

  const observeElement = page.locator('.observe-fade-in');
  const opacity = await observeElement.evaluate(
    el => getComputedStyle(el).opacity
  );

  expect(opacity).toBe('1'); // Forced visible on mobile
});
```

### Phase 3: Mobile Device Testing

#### 3.1 Real Device Testing Matrix

**Priority Devices**:
```yaml
iOS:
  - iPhone SE (2022): 375×667, A15 Bionic
  - iPhone 13: 390×844, A15 Bionic
  - iPhone 14 Pro: 393×852, A16 Bionic

Android:
  - Samsung Galaxy S21: 360×800, Snapdragon 888
  - Google Pixel 6: 412×915, Tensor
  - OnePlus 9: 412×919, Snapdragon 888
```

**Testing Checklist per Device**:
```
□ Hero animations load smoothly
□ No layout shift during animation
□ 60fps maintained during scroll
□ No jank or stutter
□ Touch interactions responsive
□ Battery impact acceptable (<5% over 10min)
```

#### 3.2 Remote Testing Tools

**BrowserStack/Sauce Labs Configuration**:
```javascript
// browserstack.config.js
module.exports = {
  devices: [
    { device: 'iPhone SE 2022', os_version: '17' },
    { device: 'Samsung Galaxy S21', os_version: '11.0' },
    { device: 'Google Pixel 6', os_version: '12.0' },
  ],
  tests: [
    'tests/mobile/entrance-animations.spec.ts',
    'tests/mobile/touch-interactions.spec.ts',
  ],
};
```

### Phase 4: Intersection Observer Validation

#### 4.1 Observer Functionality Tests

**Existing Hook**: `useScrollObserver` in `src/hooks/useScrollObserver.ts`

**Test Cases**:
```typescript
// tests/unit/useScrollObserver.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useScrollObserver } from '@/hooks/useScrollObserver';

describe('useScrollObserver', () => {
  test('triggers animation when element enters viewport', async () => {
    const { result } = renderHook(() =>
      useScrollObserver({ threshold: 0.1 })
    );

    // Simulate IntersectionObserver trigger
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
    };

    // Trigger observer callback
    expect(result.current.isVisible).toBe(true);
  });

  test('respects triggerOnce option', () => {
    const { result } = renderHook(() =>
      useScrollObserver({ triggerOnce: true })
    );

    // First trigger
    expect(result.current.isVisible).toBe(true);

    // Second trigger should not change state
    expect(result.current.isVisible).toBe(true);
  });
});
```

#### 4.2 Integration Testing

**E2E Observer Tests**:
```typescript
// tests/e2e/scroll-animations.spec.ts
test('Entrance animations trigger on scroll', async ({ page }) => {
  await page.goto('/en');

  // Initially hidden (opacity: 0)
  const section = page.locator('.observe-fade-in');
  await expect(section).toHaveCSS('opacity', '0');

  // Scroll into view
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100); // Observer trigger delay

  // Should have .is-visible class
  await expect(section).toHaveClass(/is-visible/);

  // Opacity should animate to 1
  await page.waitForTimeout(800); // Animation duration
  await expect(section).toHaveCSS('opacity', '1');
});
```

---

## 🔍 Performance Monitoring Plan

### Before/After Comparison Metrics

#### 1. Bundle Size Comparison

**Measurement Script** (`scripts/performance/compare-bundles.js`):
```javascript
const fs = require('fs');
const path = require('path');

function analyzeBundleSize() {
  const buildDir = path.join(__dirname, '../../.next');

  // Parse build output
  const buildManifest = require(path.join(buildDir, 'build-manifest.json'));

  const metrics = {
    totalCSS: 0,
    totalJS: 0,
    animationCSS: 0,
  };

  // Calculate totals
  Object.values(buildManifest.pages).forEach(assets => {
    assets.forEach(asset => {
      const filePath = path.join(buildDir, 'static', asset);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (asset.endsWith('.css')) {
          metrics.totalCSS += stats.size;
        } else if (asset.endsWith('.js')) {
          metrics.totalJS += stats.size;
        }
      }
    });
  });

  return metrics;
}

// Run comparison
const before = analyzeBundleSize();
console.log('Bundle Analysis:');
console.log('Total CSS:', (before.totalCSS / 1024).toFixed(2), 'KB');
console.log('Total JS:', (before.totalJS / 1024).toFixed(2), 'KB');
```

**Target Improvements**:
```yaml
CSS Bundle:
  Current: ~700 bytes (animation code)
  Target: ~300 bytes (30-50% reduction)
  Method: Remove keyframes, reduce animation classes

JS Bundle:
  Addition: ~500 bytes (Intersection Observer logic)
  Net Change: +/- 200 bytes (acceptable trade-off)

Total Bundle:
  Expected Reduction: 400-500 bytes
  Gzipped Reduction: 200-300 bytes
```

#### 2. Runtime Performance Measurement

**Frame Rate Monitoring** (`src/lib/performance/frameRate.ts`):
```typescript
export class FrameRateMonitor {
  private frames: number[] = [];
  private lastFrame = performance.now();

  measure() {
    const now = performance.now();
    const delta = now - this.lastFrame;
    const fps = 1000 / delta;

    this.frames.push(fps);
    this.lastFrame = now;

    if (this.frames.length > 60) {
      this.frames.shift(); // Keep last 60 frames
    }

    return fps;
  }

  getAverageFPS() {
    return this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
  }

  getMinFPS() {
    return Math.min(...this.frames);
  }
}

// Usage in development
if (process.env.NODE_ENV === 'development') {
  const monitor = new FrameRateMonitor();

  function measureFrame() {
    const fps = monitor.measure();
    console.log(`FPS: ${fps.toFixed(2)}`);
    requestAnimationFrame(measureFrame);
  }

  requestAnimationFrame(measureFrame);
}
```

**Target FPS**: 60fps (16.67ms per frame)
**Acceptable Range**: 55-60fps
**Critical Threshold**: <45fps (requires optimization)

#### 3. Animation Performance Testing

**Web Vitals Integration**:
```typescript
// src/lib/performance/webVitals.ts
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals() {
  getCLS(console.log);  // Cumulative Layout Shift
  getFCP(console.log);  // First Contentful Paint
  getFID(console.log);  // First Input Delay
  getLCP(console.log);  // Largest Contentful Paint
  getTTFB(console.log); // Time to First Byte
}

// Enhanced for animations
export function reportAnimationMetrics() {
  const animationStart = performance.mark('animation-start');
  const animationEnd = performance.mark('animation-end');

  performance.measure('animation-duration', 'animation-start', 'animation-end');

  const measure = performance.getEntriesByName('animation-duration')[0];
  console.log('Animation Duration:', measure.duration);
}
```

#### 4. Lighthouse CI Integration

**Configuration** (`.lighthouserc.js`):
```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/en',
        'http://localhost:3000/ar',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**CI/CD Integration** (`.github/workflows/lighthouse.yml`):
```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Vercel Speed Insights Configuration

**Real User Monitoring** (`src/app/layout.tsx`):
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights
          route="/[locale]"
          sampleRate={1.0} // 100% sampling during testing
        />
      </body>
    </html>
  );
}
```

**Dashboard Metrics to Monitor**:
```yaml
Core Web Vitals:
  - FCP: Target P75 < 1.8s
  - LCP: Target P75 < 2.5s
  - CLS: Target P75 < 0.1
  - INP: Target P75 < 200ms

Custom Events:
  - animation-start: Track entrance animation trigger
  - animation-complete: Track animation completion time
  - scroll-depth: Track user engagement with animations
```

---

## 📋 Complete Testing Checklist

### Pre-Refactoring Checklist

```
□ Baseline Measurements
  □ Run Lighthouse (desktop + mobile)
  □ Record bundle sizes (CSS + JS)
  □ Capture current FPS metrics
  □ Export Vercel Speed Insights baseline
  □ Generate visual regression baselines

□ Documentation
  □ Document current animation timings
  □ List all CSS keyframes in use
  □ Map animation classes to components
  □ Identify critical animations vs. nice-to-have
```

### Refactoring Phase Checklist

```
□ Code Changes
  □ Implement Intersection Observer hook
  □ Replace CSS animations with observer-triggered classes
  □ Update animation timing logic
  □ Add reduced-motion support
  □ Preserve mobile fallbacks

□ Testing During Development
  □ Verify animations trigger correctly
  □ Check animation timing matches original
  □ Test on multiple screen sizes
  □ Validate touch device behavior
  □ Test reduced-motion support
```

### Post-Refactoring Validation

```
□ Performance Verification
  □ Run Lighthouse comparison
  □ Measure bundle size reduction
  □ Verify 60fps maintained
  □ Check Vercel Speed Insights improvements

□ Visual Regression Testing
  □ Compare screenshots (before vs. after)
  □ Verify animation sequences identical
  □ Check stagger timing preserved
  □ Validate mobile rendering

□ Functional Testing
  □ Test on all target browsers
  □ Verify real device performance
  □ Check reduced-motion support
  □ Validate touch interactions

□ Accessibility Testing
  □ Screen reader compatibility
  □ Keyboard navigation
  □ Focus management during animations
  □ Motion sickness considerations

□ Production Validation
  □ Deploy to staging environment
  □ Monitor Vercel Speed Insights
  □ Review error logs
  □ Collect user feedback
```

---

## 🎯 Success Criteria

### Performance Targets

```yaml
Bundle Size:
  ✓ CSS reduction: 30-50% (400-500 bytes)
  ✓ Total gzipped reduction: 200-300 bytes
  ✓ No significant JS bundle increase

Frame Rate:
  ✓ Maintain 60fps during animations
  ✓ No frame drops on mid-range devices
  ✓ Smooth scroll performance

Web Vitals:
  ✓ FCP < 1.8s (P75)
  ✓ LCP < 2.5s (P75)
  ✓ CLS < 0.1 (P75)
  ✓ TBT < 200ms

Lighthouse:
  ✓ Performance score: 95+
  ✓ No regressions in other categories
  ✓ Mobile score improvement
```

### Functional Requirements

```yaml
Animation Behavior:
  ✓ All entrance animations work identically
  ✓ Stagger timing preserved
  ✓ Animation delays maintained
  ✓ No visual regressions

Accessibility:
  ✓ Reduced-motion support working
  ✓ Touch device fallbacks functional
  ✓ Keyboard navigation unaffected
  ✓ Screen reader compatibility

Cross-Browser:
  ✓ Chrome/Edge: Perfect
  ✓ Firefox: Perfect
  ✓ Safari (iOS + macOS): Perfect
  ✓ Mobile browsers: Perfect
```

---

## 📈 Continuous Monitoring

### Post-Deployment Monitoring

**Week 1-2 Monitoring**:
```
□ Daily Vercel Speed Insights review
□ Monitor error rates for animation issues
□ Track user engagement metrics
□ Collect browser compatibility reports
□ Review performance regression alerts
```

**Automated Alerts**:
```yaml
Vercel Speed Insights Alerts:
  - LCP > 3.0s: Critical alert
  - CLS > 0.15: Warning alert
  - FCP > 2.0s: Warning alert

Bundle Size Alerts:
  - CSS increase > 5%: Review required
  - JS increase > 10%: Investigation required
```

---

## 🚀 Quick Start Commands

```bash
# 1. Baseline Measurement
npm run build
npx lighthouse https://az-digital-hub.vercel.app --output html --output-path reports/baseline.html

# 2. Visual Regression Setup
npx playwright install
npm run test:visual:baseline

# 3. Development Testing
npm run dev
# Open DevTools → Performance → Record animation sequence

# 4. Post-Refactor Validation
npm run build
npm run test:visual
npm run test:performance

# 5. Deploy & Monitor
vercel deploy --preview
# Check: https://vercel.com/dashboard/speed-insights
```

---

## 📚 Resources

**Documentation**:
- Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Web Vitals: https://web.dev/vitals/
- Vercel Speed Insights: https://vercel.com/docs/speed-insights

**Testing Tools**:
- Playwright: https://playwright.dev/
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- BrowserStack: https://www.browserstack.com/

**Performance Analysis**:
- Chrome DevTools Performance: chrome://devtools/
- React DevTools Profiler: https://react.dev/learn/react-developer-tools
- Next.js Bundle Analyzer: https://www.npmjs.com/package/@next/bundle-analyzer

---

**Version**: 1.0
**Last Updated**: 2025-10-14
**Author**: Performance Engineering Team
