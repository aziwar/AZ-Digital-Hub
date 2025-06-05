const { chromium } = require('playwright');
const { injectAxe, checkA11y } = require('@axe-core/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await injectAxe(page);
  const results = await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
  if (results.violations.length > 0) {
    console.error('Accessibility violations detected');
    console.error(results.violations);
    await browser.close();
    process.exit(1);
  }
  await browser.close();
})();
