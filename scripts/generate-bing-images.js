const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROMPTS = [
  { name: 'onze', prompt: 'Number 11, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'dotze', prompt: 'Number 12, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'tretze', prompt: 'Number 13, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'catorze', prompt: 'Number 14, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'quinze', prompt: 'Number 15, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'setze', prompt: 'Number 16, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'disset', prompt: 'Number 17, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'divuit', prompt: 'Number 18, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'dinou', prompt: 'Number 19, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'vint', prompt: 'Number 20, 3D cartoon style, big colorful digits with confetti and stars around, white background, 512x512px, cheerful, for children ages 5-8' },
  { name: 'bosc', prompt: 'Forest scene with green trees and bushes, 3D cartoon style, white background with decorative hearts and stars, 512x512px, cheerful, for children ages 5-8' },
  { name: 'muntanya', prompt: 'Mountain with snow-capped peak, 3D cartoon style, white background with decorative hearts and stars, 512x512px, cheerful, for children ages 5-8' },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'Ilustracije');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'illustrations');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImages() {
  // Ensure output directories exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Launch browser with persistent context to keep login
  const userDataDir = path.join(process.env.HOME, '.playwright-bing-session');
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1280, height: 900 },
  });

  const page = await browser.newPage();

  console.log('Opening Bing Image Creator...');
  await page.goto('https://www.bing.com/images/create');

  // Wait for user to log in if needed
  console.log('Please log in to Bing if prompted. Press Enter when ready...');
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  for (const item of PROMPTS) {
    console.log(`\nGenerating: ${item.name}`);

    // Check if already exists
    const outputPath = path.join(OUTPUT_DIR, `${item.name}.png`);
    if (fs.existsSync(outputPath)) {
      console.log(`  Skipping ${item.name} - already exists`);
      continue;
    }

    try {
      // Clear and type prompt
      const textarea = await page.locator('textarea[name="q"], input[name="q"]').first();
      await textarea.clear();
      await textarea.fill(item.prompt);

      // Click create button
      await page.locator('button[type="submit"], #create_btn_c').first().click();

      // Wait for images to generate (can take 30-60 seconds)
      console.log('  Waiting for image generation...');
      await page.waitForSelector('.mimg, .imgpt img', { timeout: 120000 });
      await sleep(3000); // Extra wait for all images to load

      // Click first image
      const firstImage = await page.locator('.mimg, .imgpt img').first();
      await firstImage.click();

      // Wait for modal/larger image
      await sleep(2000);

      // Try to download the image
      const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);

      // Look for download/save button
      const saveBtn = await page.locator('a[download], button:has-text("Download"), button:has-text("Save")').first();
      if (await saveBtn.isVisible()) {
        await saveBtn.click();
        const download = await downloadPromise;
        if (download) {
          await download.saveAs(outputPath);
          console.log(`  Saved: ${outputPath}`);
        }
      } else {
        // Fallback: screenshot the image
        const img = await page.locator('.overlay img, .imgContainer img').first();
        await img.screenshot({ path: outputPath });
        console.log(`  Screenshot saved: ${outputPath}`);
      }

      // Go back to create more
      await page.goto('https://www.bing.com/images/create');
      await sleep(2000);

    } catch (error) {
      console.error(`  Error generating ${item.name}:`, error.message);
      // Continue with next image
      await page.goto('https://www.bing.com/images/create');
      await sleep(2000);
    }
  }

  console.log('\nDone! Press Enter to close browser...');
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  await browser.close();
}

generateImages().catch(console.error);
