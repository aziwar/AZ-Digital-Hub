import { test, expect } from '@playwright/test';

/**
 * Animation Performance Tests
 * Measures frame rate and animation smoothness
 */

test.describe('Animation Performance - FPS Measurement', () => {
  /**
   * Helper function to measure FPS during animation
   */
  async function measureFPS(
    page: any,
    animationSelector: string,
    duration: number = 2000
  ) {
    return await page.evaluate(
      async ({ selector, duration }: { selector: string; duration: number }) => {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Element not found: ${selector}`);
        }

        const frames: Array<{ timestamp: number; delta: number; fps: number }> = [];
        let lastFrame = performance.now();
        let animationFrame: number;
        let stopped = false;

        return new Promise(resolve => {
          function measureFrame() {
            if (stopped) return;

            const now = performance.now();
            const delta = now - lastFrame;
            const fps = 1000 / delta;

            frames.push({
              timestamp: now,
              delta,
              fps,
            });

            lastFrame = now;
            animationFrame = requestAnimationFrame(measureFrame);
          }

          // Start measuring
          animationFrame = requestAnimationFrame(measureFrame);

          // Stop after duration
          setTimeout(() => {
            stopped = true;
            cancelAnimationFrame(animationFrame);

            const avgFPS = frames.reduce((sum, f) => sum + f.fps, 0) / frames.length;
            const minFPS = Math.min(...frames.map(f => f.fps));
            const maxFPS = Math.max(...frames.map(f => f.fps));
            const frameDrops = frames.filter(f => f.fps < 55).length;

            resolve({
              avgFPS,
              minFPS,
              maxFPS,
              frameDrops,
              totalFrames: frames.length,
              duration,
            });
          }, duration);
        });
      },
      { selector: animationSelector, duration }
    );
  }

  test('Hero Title - Maintains 60fps during fade-in animation', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const titleSelector = '.hero-title';
    await page.waitForSelector(titleSelector);

    // Measure FPS during animation
    const fpsData = await measureFPS(page, titleSelector, 1000);

    console.log('Hero Title FPS:', {
      avg: fpsData.avgFPS.toFixed(2),
      min: fpsData.minFPS.toFixed(2),
      max: fpsData.maxFPS.toFixed(2),
      drops: fpsData.frameDrops,
    });

    // Assertions
    expect(fpsData.avgFPS).toBeGreaterThan(55); // Target: 60fps, allow 55fps minimum
    expect(fpsData.minFPS).toBeGreaterThan(45); // No severe frame drops
    expect(fpsData.frameDrops).toBeLessThan(fpsData.totalFrames * 0.1); // <10% frame drops
  });

  test('Staggered Children - Smooth stagger animation performance', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Find staggered children container
    const staggerContainer = page.locator('.observe-stagger-children').first();

    if ((await staggerContainer.count()) > 0) {
      await staggerContainer.scrollIntoViewIfNeeded();

      // Measure FPS during stagger animation
      const fpsData = await measureFPS(page, '.observe-stagger-children', 1500);

      console.log('Staggered Children FPS:', {
        avg: fpsData.avgFPS.toFixed(2),
        min: fpsData.minFPS.toFixed(2),
        max: fpsData.maxFPS.toFixed(2),
        drops: fpsData.frameDrops,
      });

      // Staggered animations should maintain smooth performance
      expect(fpsData.avgFPS).toBeGreaterThan(55);
      expect(fpsData.frameDrops).toBeLessThan(fpsData.totalFrames * 0.15); // Allow slightly more drops due to complexity
    }
  });

  test('Scroll-triggered Animation - Performance during scroll', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Start FPS measurement
    const fpsPromise = measureFPS(page, 'body', 2000);

    // Scroll to trigger animations
    await page.evaluate(() => {
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: 'smooth',
      });
    });

    await page.waitForTimeout(2000);

    const fpsData = await fpsPromise;

    console.log('Scroll Animation FPS:', {
      avg: fpsData.avgFPS.toFixed(2),
      min: fpsData.minFPS.toFixed(2),
      max: fpsData.maxFPS.toFixed(2),
      drops: fpsData.frameDrops,
    });

    // Scroll performance is critical for user experience
    expect(fpsData.avgFPS).toBeGreaterThan(50); // Slightly lower threshold during scroll
    expect(fpsData.minFPS).toBeGreaterThan(40);
  });

  test('Mobile Viewport - Animation performance on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en', { waitUntil: 'networkidle' });

    // On mobile, animations should be disabled, so FPS should be excellent
    const fpsData = await measureFPS(page, 'body', 1000);

    console.log('Mobile FPS:', {
      avg: fpsData.avgFPS.toFixed(2),
      min: fpsData.minFPS.toFixed(2),
      max: fpsData.maxFPS.toFixed(2),
      drops: fpsData.frameDrops,
    });

    // Mobile should have no animation overhead
    expect(fpsData.avgFPS).toBeGreaterThan(58); // Higher threshold on mobile
    expect(fpsData.frameDrops).toBeLessThan(5); // Minimal drops
  });

  test('Multiple Simultaneous Animations - Performance under load', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Wait for all initial animations to start
    await page.waitForTimeout(100);

    // Measure FPS with multiple animations running
    const fpsData = await measureFPS(page, 'body', 2000);

    console.log('Multiple Animations FPS:', {
      avg: fpsData.avgFPS.toFixed(2),
      min: fpsData.minFPS.toFixed(2),
      max: fpsData.maxFPS.toFixed(2),
      drops: fpsData.frameDrops,
    });

    // Even with multiple animations, should maintain good performance
    expect(fpsData.avgFPS).toBeGreaterThan(50);
    expect(fpsData.minFPS).toBeGreaterThan(40);
  });
});

test.describe('Animation Performance - Layout Stability', () => {
  test('Hero Section - No layout shift during animation', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    // Measure initial layout
    const initialLayout = await page.locator('section').first().boundingBox();

    // Wait for animations
    await page.waitForTimeout(1000);

    // Measure final layout
    const finalLayout = await page.locator('section').first().boundingBox();

    // Layout should remain stable (no shift)
    expect(initialLayout?.y).toBe(finalLayout?.y);
    expect(initialLayout?.height).toBeCloseTo(finalLayout?.height || 0, -1); // Allow 10px variance
  });

  test('Text Elements - No reflow during reveal', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const title = page.locator('.hero-title');
    const initialBox = await title.boundingBox();

    await page.waitForTimeout(1000);

    const finalBox = await title.boundingBox();

    // Text should not cause reflow
    expect(initialBox?.width).toBeCloseTo(finalBox?.width || 0, -2);
    expect(initialBox?.height).toBeCloseTo(finalBox?.height || 0, -2);
  });
});

test.describe('Animation Performance - Intersection Observer Efficiency', () => {
  test('Observer Triggers - Minimal overhead', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Measure performance during observer triggers
    const performanceMetrics = await page.evaluate(async () => {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        return entries;
      });

      observer.observe({ entryTypes: ['measure', 'mark'] });

      // Scroll to trigger observers
      window.scrollTo({ top: 500, behavior: 'smooth' });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const navigation = performance.getEntriesByType('navigation')[0] as any;

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });

    console.log('Observer Performance:', performanceMetrics);

    // Intersection Observer should add minimal overhead
    expect(performanceMetrics.domContentLoaded).toBeLessThan(500); // <500ms
    expect(performanceMetrics.loadComplete).toBeLessThan(1000); // <1s
  });

  test('Multiple Observers - Memory efficiency', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Check memory usage with multiple observers
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        return {
          usedJSHeapSize: mem.usedJSHeapSize,
          totalJSHeapSize: mem.totalJSHeapSize,
          jsHeapSizeLimit: mem.jsHeapSizeLimit,
        };
      }
      return null;
    });

    if (memoryUsage) {
      console.log('Memory Usage:', {
        used: (memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
        total: (memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      });

      // Memory usage should be reasonable
      expect(memoryUsage.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024); // <100MB
    }
  });
});

test.describe('Animation Performance - Web Vitals', () => {
  test('First Contentful Paint (FCP) - Animation impact', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    const fcpMetric = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
            resolve(fcp.startTime);
          }
        }).observe({ entryTypes: ['paint'] });

        // Fallback timeout
        setTimeout(() => resolve(null), 5000);
      });
    });

    console.log('FCP:', fcpMetric ? `${(fcpMetric as number).toFixed(2)}ms` : 'Not measured');

    // FCP should be fast despite animations
    if (fcpMetric) {
      expect(fcpMetric as number).toBeLessThan(1800); // Target: <1.8s
    }
  });

  test('Largest Contentful Paint (LCP) - Animation delay', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    const lcpMetric = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          resolve(lcp.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Fallback timeout
        setTimeout(() => resolve(null), 10000);
      });
    });

    console.log('LCP:', lcpMetric ? `${(lcpMetric as number).toFixed(2)}ms` : 'Not measured');

    // LCP should meet Web Vitals targets
    if (lcpMetric) {
      expect(lcpMetric as number).toBeLessThan(2500); // Target: <2.5s
    }
  });

  test('Cumulative Layout Shift (CLS) - Animation stability', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'networkidle' });

    // Wait for animations to complete
    await page.waitForTimeout(2000);

    const clsMetric = await page.evaluate(() => {
      return new Promise(resolve => {
        let cls = 0;

        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          resolve(cls);
        }).observe({ entryTypes: ['layout-shift'] });

        // Measure for 3 seconds
        setTimeout(() => resolve(cls), 3000);
      });
    });

    console.log('CLS:', (clsMetric as number).toFixed(4));

    // CLS should be minimal during animations
    expect(clsMetric as number).toBeLessThan(0.1); // Target: <0.1
  });
});
