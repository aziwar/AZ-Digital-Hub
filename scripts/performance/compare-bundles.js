#!/usr/bin/env node

/**
 * Bundle Size Comparison Script
 * Analyzes Next.js build output and compares before/after bundle sizes
 */

const fs = require('fs');
const path = require('path');
const { gzipSync } = require('zlib');

const BUILD_DIR = path.join(__dirname, '../../.next');
const REPORTS_DIR = path.join(__dirname, '../../reports/performance');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Calculate gzipped size of file
 */
function getGzippedSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = gzipSync(content);
    return gzipped.length;
  } catch (error) {
    console.warn(`Failed to read ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Analyze CSS bundle for animation-related code
 */
function analyzeAnimationCSS() {
  const cssFiles = [];
  const staticDir = path.join(BUILD_DIR, 'static');

  if (!fs.existsSync(staticDir)) {
    console.error('Build directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Find all CSS files
  function findCSSFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findCSSFiles(filePath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(filePath);
      }
    });
  }

  findCSSFiles(staticDir);

  // Analyze animation code in CSS
  let totalAnimationBytes = 0;
  const animationPatterns = [
    '@keyframes fadeInUp',
    '@keyframes fadeInStagger',
    '@keyframes text-reveal',
    '@keyframes typewriter',
    '@keyframes blink-caret',
    '@keyframes scaleHover',
    '@keyframes pulseGlow',
    '@keyframes shimmer',
    '@keyframes shake',
    '@keyframes slideInUp',
    '@keyframes magneticPull',
    '@keyframes successPulse',
    '@keyframes fadeInSection',
    '@keyframes parallaxFloat',
    '@keyframes sectionDivider',
    '.animate-fade-in-up',
    '.animate-stagger',
    '.text-animate-reveal',
    '.observe-fade-in',
    '.observe-slide-left',
    '.observe-slide-right',
    '.observe-stagger-children',
  ];

  cssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    animationPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        // Rough estimation of pattern size
        const regex = new RegExp(`${pattern}[\\s\\S]*?}`, 'g');
        const matches = content.match(regex);
        if (matches) {
          matches.forEach(match => {
            totalAnimationBytes += match.length;
          });
        }
      }
    });
  });

  return {
    totalAnimationBytes,
    totalAnimationBytesGzipped: Math.floor(totalAnimationBytes * 0.4), // Rough gzip estimate
  };
}

/**
 * Main bundle analysis
 */
function analyzeBundleSize() {
  console.log('🔍 Analyzing bundle size...\n');

  // Read build manifest
  const buildManifestPath = path.join(BUILD_DIR, 'build-manifest.json');
  if (!fs.existsSync(buildManifestPath)) {
    console.error('Build manifest not found. Run `npm run build` first.');
    process.exit(1);
  }

  const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));

  const metrics = {
    totalCSS: 0,
    totalCSSGzipped: 0,
    totalJS: 0,
    totalJSGzipped: 0,
    files: [],
  };

  // Analyze all page assets
  Object.entries(buildManifest.pages).forEach(([page, assets]) => {
    assets.forEach(asset => {
      const assetPath = path.join(BUILD_DIR, asset);

      if (fs.existsSync(assetPath)) {
        const stats = fs.statSync(assetPath);
        const gzippedSize = getGzippedSize(assetPath);

        const fileInfo = {
          path: asset,
          size: stats.size,
          gzippedSize,
          page,
        };

        if (asset.endsWith('.css')) {
          metrics.totalCSS += stats.size;
          metrics.totalCSSGzipped += gzippedSize;
        } else if (asset.endsWith('.js')) {
          metrics.totalJS += stats.size;
          metrics.totalJSGzipped += gzippedSize;
        }

        metrics.files.push(fileInfo);
      }
    });
  });

  // Analyze animation-specific CSS
  const animationMetrics = analyzeAnimationCSS();

  return {
    ...metrics,
    animation: animationMetrics,
  };
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Generate report
 */
function generateReport(metrics) {
  const report = {
    timestamp: new Date().toISOString(),
    bundleSize: {
      totalCSS: metrics.totalCSS,
      totalCSSGzipped: metrics.totalCSSGzipped,
      totalCSSFormatted: formatBytes(metrics.totalCSS),
      totalCSSGzippedFormatted: formatBytes(metrics.totalCSSGzipped),
      totalJS: metrics.totalJS,
      totalJSGzipped: metrics.totalJSGzipped,
      totalJSFormatted: formatBytes(metrics.totalJS),
      totalJSGzippedFormatted: formatBytes(metrics.totalJSGzipped),
    },
    animation: {
      estimatedBytes: metrics.animation.totalAnimationBytes,
      estimatedBytesGzipped: metrics.animation.totalAnimationBytesGzipped,
      estimatedBytesFormatted: formatBytes(metrics.animation.totalAnimationBytes),
      estimatedBytesGzippedFormatted: formatBytes(metrics.animation.totalAnimationBytesGzipped),
    },
    files: metrics.files.map(file => ({
      path: file.path,
      size: formatBytes(file.size),
      gzippedSize: formatBytes(file.gzippedSize),
      page: file.page,
    })),
  };

  // Save report
  const reportPath = path.join(REPORTS_DIR, `bundle-analysis-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('📊 Bundle Analysis Report\n');
  console.log('Total CSS:', report.bundleSize.totalCSSFormatted, `(${report.bundleSize.totalCSSGzippedFormatted} gzipped)`);
  console.log('Total JS:', report.bundleSize.totalJSFormatted, `(${report.bundleSize.totalJSGzippedFormatted} gzipped)`);
  console.log('\n🎬 Animation CSS:');
  console.log('Estimated Size:', report.animation.estimatedBytesFormatted, `(${report.animation.estimatedBytesGzippedFormatted} gzipped)`);
  console.log(`\n✅ Report saved to: ${reportPath}\n`);

  return report;
}

/**
 * Compare with baseline
 */
function compareWithBaseline(currentMetrics) {
  const baselinePath = path.join(REPORTS_DIR, 'baseline.json');

  if (!fs.existsSync(baselinePath)) {
    console.log('⚠️  No baseline found. Saving current metrics as baseline...');
    fs.writeFileSync(baselinePath, JSON.stringify(currentMetrics, null, 2));
    console.log(`✅ Baseline saved to: ${baselinePath}\n`);
    return;
  }

  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

  console.log('📈 Comparison with Baseline\n');

  // CSS comparison
  const cssDiff = currentMetrics.bundleSize.totalCSSGzipped - baseline.bundleSize.totalCSSGzipped;
  const cssPercent = ((cssDiff / baseline.bundleSize.totalCSSGzipped) * 100).toFixed(2);
  console.log('CSS Bundle:');
  console.log(`  Before: ${baseline.bundleSize.totalCSSGzippedFormatted}`);
  console.log(`  After:  ${currentMetrics.bundleSize.totalCSSGzippedFormatted}`);
  console.log(`  Change: ${cssDiff > 0 ? '+' : ''}${formatBytes(cssDiff)} (${cssPercent > 0 ? '+' : ''}${cssPercent}%)`);

  // JS comparison
  const jsDiff = currentMetrics.bundleSize.totalJSGzipped - baseline.bundleSize.totalJSGzipped;
  const jsPercent = ((jsDiff / baseline.bundleSize.totalJSGzipped) * 100).toFixed(2);
  console.log('\nJS Bundle:');
  console.log(`  Before: ${baseline.bundleSize.totalJSGzippedFormatted}`);
  console.log(`  After:  ${currentMetrics.bundleSize.totalJSGzippedFormatted}`);
  console.log(`  Change: ${jsDiff > 0 ? '+' : ''}${formatBytes(jsDiff)} (${jsPercent > 0 ? '+' : ''}${jsPercent}%)`);

  // Animation comparison
  const animDiff = currentMetrics.animation.estimatedBytesGzipped - baseline.animation.estimatedBytesGzipped;
  const animPercent = ((animDiff / baseline.animation.estimatedBytesGzipped) * 100).toFixed(2);
  console.log('\nAnimation CSS:');
  console.log(`  Before: ${baseline.animation.estimatedBytesGzippedFormatted}`);
  console.log(`  After:  ${currentMetrics.animation.estimatedBytesGzippedFormatted}`);
  console.log(`  Change: ${animDiff > 0 ? '+' : ''}${formatBytes(animDiff)} (${animPercent > 0 ? '+' : ''}${animPercent}%)`);

  // Success criteria check
  console.log('\n✅ Success Criteria:');
  console.log(`  Target: 30-50% animation CSS reduction`);
  console.log(`  Actual: ${Math.abs(animPercent)}%`);

  if (Math.abs(animPercent) >= 30) {
    console.log('  Status: ✅ Target met!');
  } else {
    console.log('  Status: ⚠️  Target not met');
  }

  console.log('');
}

// Run analysis
try {
  const metrics = analyzeBundleSize();
  const report = generateReport(metrics);
  compareWithBaseline(report);
} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message);
  process.exit(1);
}
