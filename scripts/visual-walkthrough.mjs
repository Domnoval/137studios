import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = './visual-test-screenshots';

// Create screenshots directory
try {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
} catch (err) {
  // Directory already exists
}

console.log('🎭 Starting Playwright Visual Walkthrough...\n');
console.log('This will open your site in a browser and take screenshots of key pages.\n');

const browser = await chromium.launch({
  headless: false, // Open visible browser
  slowMo: 500, // Slow down actions for visibility
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

const page = await context.newPage();

try {
  // Test 1: Homepage
  console.log('📸 Step 1: Loading homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: join(SCREENSHOTS_DIR, '01-homepage.png'),
    fullPage: true,
  });
  console.log('   ✅ Screenshot saved: 01-homepage.png\n');

  // Test 2: Scroll to gallery
  console.log('📸 Step 2: Scrolling to gallery section...');
  await page.evaluate(() => {
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: join(SCREENSHOTS_DIR, '02-gallery-section.png'),
    fullPage: false,
  });
  console.log('   ✅ Screenshot saved: 02-gallery-section.png\n');

  // Test 3: Click first artwork
  console.log('📸 Step 3: Clicking on first artwork...');
  // Wait for gallery to load
  await page.waitForTimeout(2000);

  // Try to find and click an artwork
  const artworkElements = await page.locator('canvas, img[alt*="Purple"], img[alt*="Cyan"]').all();
  if (artworkElements.length > 0) {
    await artworkElements[0].click({ force: true });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, '03-artwork-detail-page.png'),
      fullPage: true,
    });
    console.log('   ✅ Screenshot saved: 03-artwork-detail-page.png\n');
  } else {
    console.log('   ⚠️  Could not find artwork to click\n');
  }

  // Test 4: Test zoom controls
  console.log('📸 Step 4: Testing zoom functionality...');
  await page.mouse.wheel(0, -500); // Scroll up to zoom in
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(SCREENSHOTS_DIR, '04-zoomed-in.png'),
    fullPage: false,
  });
  console.log('   ✅ Screenshot saved: 04-zoomed-in.png\n');

  // Test 5: Back to gallery
  console.log('📸 Step 5: Navigating back to gallery...');
  const backButton = await page.locator('text="Back to Gallery"').first();
  if (await backButton.isVisible()) {
    await backButton.click();
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: join(SCREENSHOTS_DIR, '05-back-to-gallery.png'),
      fullPage: true,
    });
    console.log('   ✅ Screenshot saved: 05-back-to-gallery.png\n');
  }

  // Test 6: Mobile view
  console.log('📸 Step 6: Testing mobile viewport...');
  await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  await page.goto(BASE_URL);
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: join(SCREENSHOTS_DIR, '06-mobile-homepage.png'),
    fullPage: true,
  });
  console.log('   ✅ Screenshot saved: 06-mobile-homepage.png\n');

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    url: BASE_URL,
    screenshots: [
      '01-homepage.png',
      '02-gallery-section.png',
      '03-artwork-detail-page.png',
      '04-zoomed-in.png',
      '05-back-to-gallery.png',
      '06-mobile-homepage.png',
    ],
    userAgent: await page.evaluate(() => navigator.userAgent),
    viewport: await page.viewportSize(),
  };

  writeFileSync(
    join(SCREENSHOTS_DIR, 'report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\n✨ Visual walkthrough complete!');
  console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log('\n🔍 Review the screenshots to identify UX issues.');
  console.log('🚀 Browser will remain open for 30 seconds for manual testing...\n');

  // Keep browser open for manual testing
  await page.waitForTimeout(30000);

} catch (error) {
  console.error('❌ Error during walkthrough:', error.message);
} finally {
  await browser.close();
  console.log('\n👋 Browser closed. Walkthrough complete.');
}
