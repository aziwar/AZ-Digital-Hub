#!/usr/bin/env node

/**
 * Frame Rate Measurement Script
 * Uses Playwright to measure animation performance in real browser
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../../reports/performance');
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Measure FPS during animation
 */
async function measureFPS(page, animationSelector, duration = 2000) {
  return await page.evaluate(async ({ selector, duration }) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    const frames = [];
    let lastFrame = performance.now();
    let animationFrame;
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
          frames,
          avgFPS,
          minFPS,
          maxFPS,
          frameDrops,
          totalFrames: frames.length,
          duration,
        });
      }, duration);
    });
  }, { selector: animationSelector, duration });
}

/**
 * Test animation performance for specific scenario
 */
async function testAnimationScenario(page, scenario) {
  console.log(`\n📊 Testing: ${scenario.name}`);

  await page.goto(`${BASE_URL}${scenario.path}`);
  await page.waitForLoadState('networkidle');

  // Wait for initial render
  await page.waitForTimeout(500);

  // Scroll to trigger animation if needed
  if (scenario.scrollTo) {
    await page.locator(scenario.scrollTo).scrollIntoViewIfNeeded();
  }

  // Measure FPS during animation
  const fpsData = await measureFPS(page, scenario.selector, scenario.duration || 2000);

  console.log(`  Average FPS: ${fpsData.avgFPS.toFixed(2)}`);
  console.log(`  Min FPS: ${fpsData.minFPS.toFixed(2)}`);
  console.log(`  Max FPS: ${fpsData.maxFPS.toFixed(2)}`);
  console.log(`  Frame Drops (<55fps): ${fpsData.frameDrops}/${fpsData.totalFrames}`);

  // Performance assessment
  let status = '✅ Excellent';
  if (fpsData.avgFPS < 60 && fpsData.avgFPS >= 55) {
    status = '⚠️  Good';
  } else if (fpsData.avgFPS < 55 && fpsData.avgFPS >= 45) {
    status = '⚠️  Needs Optimization';
  } else if (fpsData.avgFPS < 45) {
    status = '❌ Poor Performance';
  }

  console.log(`  Status: ${status}`);

  return {
    scenario: scenario.name,
    ...fpsData,
    status,
  };
}

/**
 * Main test runner
 */
async function runFPSTests() {
  console.log('🎬 Frame Rate Performance Testing\n');
  console.log(`Testing URL: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu', '--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Test scenarios
  const scenarios = [
    {
      name: 'Hero Section - Initial Load',
      path: '/en',
      selector: '.text-animate-reveal',
      duration: 2000,
    },
    {
      name: 'Hero Section - Scroll Trigger',
      path: '/en',
      selector: '.observe-fade-in',
      scrollTo: '.observe-fade-in',
      duration: 2000,
    },
    {
      name: 'Staggered Children Animation',
      path: '/en',
      selector: '.observe-stagger-children',
      scrollTo: '.observe-stagger-children',
      duration: 2500,
    },
    {
      name: 'Hero Section - Mobile Viewport',
      path: '/en',
      selector: '.text-animate-reveal',
      duration: 2000,
      viewport: { width: 375, height: 667 },
    },
  ];

  const results = [];

  for (const scenario of scenarios) {
    try {
      // Adjust viewport if specified
      if (scenario.viewport) {
        await page.setViewportSize(scenario.viewport);
      }

      const result = await testAnimationScenario(page, scenario);
      results.push(result);

      // Reset viewport
      if (scenario.viewport) {
        await page.setViewportSize({ width: 1920, height: 1080 });
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({
        scenario: scenario.name,
        error: error.message,
      });
    }
  }

  await browser.close();

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    baseURL: BASE_URL,
    results,
    summary: {
      totalTests: results.length,
      passed: results.filter(r => r.status?.includes('✅')).length,
      warnings: results.filter(r => r.status?.includes('⚠️')).length,
      failed: results.filter(r => r.status?.includes('❌') || r.error).length,
    },
  };

  // Save report
  const reportPath = path.join(REPORTS_DIR, `fps-analysis-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n📈 Test Summary:');
  console.log(`  Total Tests: ${report.summary.totalTests}`);
  console.log(`  Passed: ${report.summary.passed}`);
  console.log(`  Warnings: ${report.summary.warnings}`);
  console.log(`  Failed: ${report.summary.failed}`);
  console.log(`\n✅ Report saved to: ${reportPath}\n`);

  // Exit with error if tests failed
  if (report.summary.failed > 0) {
    process.exit(1);
  }
}

// Check if Playwright is installed
try {
  require('playwright');
} catch (error) {
  console.error('❌ Playwright not installed. Run: npm install --save-dev playwright');
  process.exit(1);
}

// Run tests
runFPSTests().catch(error => {
  console.error('❌ FPS testing failed:', error);
  process.exit(1);
});
