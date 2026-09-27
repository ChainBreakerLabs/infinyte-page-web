import { chromium, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(
  existsSync(chrome) ? { executablePath: chrome } : {},
);
const destination = 'public/images/exports';
await mkdir(destination, { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 600, height: 1150 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  for (const name of [
    'dashboard',
    'accounts',
    'budgets',
    'planner',
    'calendar',
    'debts',
    'goals',
  ]) {
    await page.goto('http://127.0.0.1:4180/infinyte-page-web/', {
      waitUntil: 'networkidle',
    });
    await page.evaluate((screen) => {
      const image = document.querySelector(`.iphone img[src$="/${screen}.webp"]`);
      const frame = image?.closest('.iphone');
      if (!frame)
        throw new Error(`The public ${screen} iPhone composition is missing.`);
      const stage = document.createElement('div');
      stage.id = 'export-stage';
      stage.append(frame.cloneNode(true));
      document.body.replaceChildren(stage);
    }, name);
    await page.addStyleTag({
      content:
        'html,body { background: transparent !important; } #export-stage { width: 478px; padding: 32px; background: transparent; } #export-stage .iphone { box-shadow: 0 10px 20px rgb(32 37 28 / 18%); border-radius: 59px; padding: 7px; } #export-stage .iphone img { border-radius: 49px; } #export-stage .iphone-island { top: 23px; height: 29px; } #export-stage .iphone-buttons { top: 145px; height: 54px; box-shadow: 0 65px #777c73; }',
    });
    await expect
      .poll(() =>
        page
          .locator('#export-stage img')
          .evaluate(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    const png = `${destination}/infinyte-${name}-iphone.png`;
    await page.locator('#export-stage').screenshot({ path: png, omitBackground: true });
    await sharp(png)
      .webp({ quality: 90 })
      .toFile(`${destination}/infinyte-${name}-iphone.webp`);
  }
} finally {
  await browser.close();
}
