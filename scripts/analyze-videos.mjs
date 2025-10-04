import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

const videos = [
  '/mnt/c/Users/Domno/OneDrive/Desktop/veo30fastgeneratepreview_a_cool_landing_page_for_TONIC_THOUGHT_0.mp4',
  '/mnt/c/Users/Domno/OneDrive/Desktop/f83163eb-7319-4cc3-880b-c3c3910346c6.mp4',
  '/mnt/c/Users/Domno/OneDrive/Desktop/4e0a3392-11c5-41d5-a75f-34a1cf88e9b3.mp4'
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (let i = 0; i < videos.length; i++) {
  const videoPath = videos[i];

  // Create a simple HTML page to load and play the video
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; background: black; display: flex; justify-content: center; align-items: center; height: 100vh;">
      <video id="video" controls autoplay muted style="max-width: 100%; max-height: 100%;">
        <source src="file://${videoPath}" type="video/mp4">
      </video>
    </body>
    </html>
  `);

  // Wait for video to load
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({
    path: `./public/video-ref-${i + 1}.png`,
    fullPage: true
  });

  console.log(`✅ Captured frame from video ${i + 1}`);
}

await browser.close();
console.log('\n✨ All video frames captured! Check /public/video-ref-*.png');
