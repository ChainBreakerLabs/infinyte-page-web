import { chromium, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
const output = '/private/tmp/infinyte-visual-qa';
await mkdir(output, { recursive: true });
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(
  existsSync(chrome) ? { executablePath: chrome } : {},
);
const reports = [];
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 390, 844],
    ['small-mobile', 320, 740],
    ['tablet', 768, 1024],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    const missing = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) missing.push(response.url());
    });
    await page.goto('http://127.0.0.1:4180/infinyte-page-web/', {
      waitUntil: 'networkidle',
    });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${output}/${name}-hero.png` });
    for (const section of ['features', 'pricing', 'download']) {
      await page
        .locator(`#${section}`)
        .evaluate((element) =>
          element.scrollIntoView({ behavior: 'instant', block: 'start' }),
        );
      for (const reveal of await page.locator(`#${section} .reveal`).all()) {
        await reveal.scrollIntoViewIfNeeded();
        await expect(reveal).toHaveCSS('opacity', '1');
      }
      await page.locator(`#${section}`).screenshot({
        path: `${output}/${name}-${section}.png`,
        style: '.nav, .skip-link { visibility: hidden !important; }',
      });
    }
    for (const [index, card] of (await page.locator('.feature-card').all()).entries()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card).toHaveCSS('opacity', '1');
      await card.screenshot({
        path: `${output}/${name}-feature-${index + 1}.png`,
        style: '.nav, .skip-link { visibility: hidden !important; }',
      });
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    await page.goto('http://127.0.0.1:4180/infinyte-page-web/privacy.html', {
      waitUntil: 'networkidle',
    });
    await page.screenshot({ path: `${output}/${name}-privacy.png` });
    const legalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    reports.push({ name, overflow, legalOverflow, errors, missing });
    await page.close();
  }
  await writeFile(`${output}/report.json`, JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports));
  if (
    reports.some(
      (report) =>
        report.overflow ||
        report.legalOverflow ||
        report.errors.length ||
        report.missing.length,
    )
  )
    throw new Error('Visual verification detected a layout or resource failure.');
} finally {
  await browser.close();
}
