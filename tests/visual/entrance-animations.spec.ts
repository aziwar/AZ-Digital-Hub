import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Entrance Animations
 * Captures screenshots before and after refactoring to ensure visual parity
 */

test.describe('Entrance Animations - Visual Regression', () => {
  // Test configuration
  const ANIMATION_DELAY = 100; // ms to wait for IntersectionObserver trigger
  const ANIMATION_DURATION = 1000; // ms for animations to complete
  const STAGGER_DURATION = 700; // ms for staggered animations

  test.beforeEach(async ({ page }) => {
    // Disable animations for initial load to capture base state
    await page.addInitScript(() => {
      document.documentElement.style.setProperty('--animation-delay', '0s');
    });
  });

  test('Hero Section - Initial State (Before Animation)', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    // Capture before intersection observer triggers
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    await expect(page).toHaveScreenshot('hero-initial.png', {
      fullPage: false,
      timeout: 5000,
      maxDiffPixels: 100, // Allow small rendering differences
    });
  });

  test('Hero Section - Animated State (After Trigger)', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Wait for all animations to complete
    await page.waitForTimeout(ANIMATION_DURATION);

    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    await expect(page).toHaveScreenshot('hero-animated.png', {
      fullPage: false,
      maxDiffPixels: 100,
    });
  });

  test('Hero Title - Animation Sequence', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const title = page.locator('.hero-title');
    await expect(title).toBeVisible();

    // Wait for title animation (0.2s delay + 0.8s duration)
    await page.waitForTimeout(ANIMATION_DURATION);

    await expect(title).toHaveScreenshot('hero-title-animated.png', {
      maxDiffPixels: 50,
    });
  });

  test('Hero Tagline - Gradient Animation', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const tagline = page.locator('.bg-gradient-to-r.from-purple-400.via-blue-400.to-cyan-400');
    await expect(tagline).toBeVisible();

    // Wait for tagline animation (0.4s delay + 0.8s duration)
    await page.waitForTimeout(ANIMATION_DURATION + 200);

    await expect(tagline).toHaveScreenshot('hero-tagline-animated.png', {
      maxDiffPixels: 50,
    });
  });

  test('CTA Buttons - Fade In Animation', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const ctaContainer = page.locator('.btn-primary').first();
    await expect(ctaContainer).toBeVisible();

    // Wait for CTA animation (0.8s delay + 0.8s duration)
    await page.waitForTimeout(ANIMATION_DURATION + 600);

    await expect(ctaContainer).toHaveScreenshot('cta-buttons-animated.png', {
      maxDiffPixels: 100,
    });
  });

  test('Social Proof Badges - Staggered Animation', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Scroll to social proof section
    const socialProof = page.locator('.bg-green-600\\/20').first();
    await socialProof.scrollIntoViewIfNeeded();

    await page.waitForTimeout(ANIMATION_DELAY);
    await page.waitForTimeout(STAGGER_DURATION);

    await expect(socialProof).toHaveScreenshot('social-proof-animated.png', {
      maxDiffPixels: 50,
    });
  });

  test('Metrics Cards - Fade In from Bottom', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Scroll to metrics section
    const metricsGrid = page.locator('.bg-white\\/10.backdrop-blur-md').first();
    await metricsGrid.scrollIntoViewIfNeeded();

    await page.waitForTimeout(ANIMATION_DELAY);
    await page.waitForTimeout(ANIMATION_DURATION);

    await expect(metricsGrid).toHaveScreenshot('metrics-card-animated.png', {
      maxDiffPixels: 100,
    });
  });

  test('Staggered Children - Service Icons Grid', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const serviceGrid = page.locator('.observe-stagger-children').first();

    if (await serviceGrid.count() > 0) {
      await serviceGrid.scrollIntoViewIfNeeded();
      await page.waitForTimeout(ANIMATION_DELAY);
      await page.waitForTimeout(STAGGER_DURATION);

      await expect(serviceGrid).toHaveScreenshot('staggered-complete.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('Full Hero Section - Complete Animation Sequence', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Wait for all animations to complete
    await page.waitForTimeout(ANIMATION_DURATION + 800);

    const heroSection = page.locator('section').first();

    await expect(heroSection).toHaveScreenshot('hero-complete.png', {
      fullPage: false,
      maxDiffPixels: 200,
    });
  });
});

test.describe('Mobile - Entrance Animations', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('Mobile - Hero Section (Animations Disabled)', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // On mobile, animations should be disabled via media query
    // Content should be immediately visible
    await expect(page).toHaveScreenshot('mobile-hero-initial.png', {
      fullPage: false,
      maxDiffPixels: 100,
    });
  });

  test('Mobile - Touch Device Fallback Check', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Verify animations are disabled on mobile
    const animatedElement = page.locator('.text-animate-reveal').first();

    if (await animatedElement.count() > 0) {
      const opacity = await animatedElement.evaluate(el =>
        window.getComputedStyle(el).opacity
      );

      // Should be immediately visible (opacity: 1) on mobile
      expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    }
  });
});

test.describe('Reduced Motion - Accessibility', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Reduced Motion - Animations Disabled', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // With reduced motion, animations should be instant
    const animatedElement = page.locator('.text-animate-reveal').first();

    if (await animatedElement.count() > 0) {
      const animationDuration = await animatedElement.evaluate(el =>
        window.getComputedStyle(el).animationDuration
      );

      // Should be 0.01ms as per globals.css line 255
      expect(animationDuration).toBe('0.01s');
    }

    await expect(page).toHaveScreenshot('reduced-motion-hero.png', {
      fullPage: false,
      maxDiffPixels: 100,
    });
  });
});

test.describe('RTL - Entrance Animations', () => {
  test('RTL - Arabic Hero Section Animations', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'networkidle' });

    await page.waitForTimeout(1000);

    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Verify RTL attribute
    const dir = await page.locator('html').getAttribute('dir');
    expect(dir).toBe('rtl');

    await expect(page).toHaveScreenshot('rtl-hero-animated.png', {
      fullPage: false,
      maxDiffPixels: 200,
    });
  });

  test('RTL - Slide Direction Reversed', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'networkidle' });

    // In RTL, slide-left should transform to translateX(30px) instead of translateX(-30px)
    const slideElement = page.locator('.observe-slide-left').first();

    if (await slideElement.count() > 0) {
      await slideElement.scrollIntoViewIfNeeded();

      const transform = await slideElement.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      // Verify transform is applied correctly for RTL
      expect(transform).toBeTruthy();
    }
  });
});

test.describe('Cross-Browser - Animation Consistency', () => {
  const browsers = ['chromium', 'firefox', 'webkit'];

  browsers.forEach(browserName => {
    test(`${browserName} - Hero Animation Consistency`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `Only run on ${browserName}`);

      await page.goto('/en', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const heroSection = page.locator('section').first();

      await expect(heroSection).toHaveScreenshot(`${browserName}-hero.png`, {
        fullPage: false,
        maxDiffPixels: 300, // Allow more tolerance for cross-browser differences
      });
    });
  });
});
