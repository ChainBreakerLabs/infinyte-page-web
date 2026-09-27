import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import legalContent from './fixtures/legal-content.json' with { type: 'json' };

const base = 'http://127.0.0.1:4180/infinyte-page-web/';

test('loads the dashboard and six complete screenshots inside iPhone frames', async ({
  page,
}) => {
  const errors: string[] = [];
  const missing: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) missing.push(response.url());
  });
  page.on('request', (request) => {
    if (!request.url().startsWith(base)) external.push(request.url());
  });
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Tu dinero,con intención.',
  );
  await expect(page.locator('.hero .iphone img')).toHaveAttribute(
    'src',
    /images\/dashboard.webp$/,
  );
  await expect(page.locator('.feature-device .iphone')).toHaveCount(6);
  const screens = ['accounts', 'budgets', 'planner', 'calendar', 'debts', 'goals'];
  for (const name of screens) {
    const image = page.locator(`.feature-device img[src$="/${name}.webp"]`);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element) =>
            element instanceof HTMLImageElement &&
            element.complete &&
            element.naturalWidth === 828 &&
            element.naturalHeight === 1792,
        ),
      )
      .toBe(true);
    const ratio = await image.evaluate((element) => {
      const styles = getComputedStyle(element);
      return parseFloat(styles.width) / parseFloat(styles.height);
    });
    expect(ratio).toBeCloseTo(828 / 1792, 2);
    await expect(image.locator('..').locator('.iphone-island')).toHaveCount(1);
  }
  expect(missing).toEqual([]);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  await expect(page.locator('audio, video')).toHaveCount(0);
  await expect(page.locator('.company-link')).toHaveAttribute(
    'href',
    'https://chainbreakerlabs.com/',
  );
});

test('the deleted section has no remaining links or controls and the hero reaches features', async ({
  page,
}) => {
  for (const path of ['./', 'privacy.html', 'terms.html', 'delete-account.html']) {
    await page.goto(path);
    await expect(
      page.locator('#experience, #preview-gallery, #gallery-prev, #gallery-next'),
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Por dentro', includeHidden: true }),
    ).toHaveCount(0);
    await expect(page.locator('a[href*="#experience"]')).toHaveCount(0);
  }
  await page.goto('./');
  await page.getByRole('link', { name: 'Explora Infinyte' }).click();
  await expect(page).toHaveURL(/#features$/);
  await expect(page.locator('#intro-title')).toBeInViewport();
});

test('mobile menu closes with Escape and follows an anchor after history restoration', async ({
  page,
  isMobile,
}) => {
  await page.goto('./');
  const menu = page.locator('#menuBtn');
  if (!isMobile) {
    await expect(menu).toBeHidden();
    await page
      .locator('#navigation-links')
      .getByRole('link', { name: 'Planes' })
      .click();
    await expect(page).toHaveURL(/#pricing$/);
    return;
  }
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toHaveAttribute('aria-label', 'Cerrar menú');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('#navigation-links').getByRole('link', { name: 'Planes' }).click();
  await expect(page).toHaveURL(/#pricing$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('all legal documents preserve their original text and deletion contact', async ({
  page,
}) => {
  for (const [path, text] of Object.entries(legalContent)) {
    await page.goto(path);
    const actual = (await page.locator('main').textContent())
      ?.replace(/\s+/g, ' ')
      .trim();
    expect(actual).toBe(text);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (path === 'delete-account.html') {
      await expect(page.locator('.delete-cta__btn')).toHaveAttribute(
        'href',
        'mailto:infinyte.app+delete@gmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta',
      );
    }
    await page.locator('.legal__back').click();
    await expect(page).toHaveURL(/index.html$/);
  }
});

test('reduced motion and 320px screens retain readable content without clipping', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.is-pending')).toHaveCount(0);
  const clipping = await page.locator('h1').evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return Array.from(range.getClientRects()).some(
      (bounds) => bounds.left < 0 || bounds.right > window.innerWidth,
    );
  });
  expect(clipping).toBe(false);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
  ).toBe(false);
  for (const path of Object.keys(legalContent)) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    ).toBe(false);
  }
});

test('the framed screenshots and legal routes remain accessible without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto(base);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page
      .locator('#navigation-links')
      .getByRole('link', { name: 'La app' })
      .click();
    await expect(page).toHaveURL(/#features$/);
    await expect(page.locator('.feature-device .iphone')).toHaveCount(6);
    const privacy = page
      .locator('.footer__links')
      .getByRole('link', { name: 'Privacidad', exact: true });
    await privacy.focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('heading', { name: 'Política de Privacidad' }),
    ).toBeVisible();
    await page
      .locator('#navigation-links')
      .getByRole('link', { name: 'La app' })
      .click();
    await expect(page).toHaveURL(/index.html#features$/);
  } finally {
    await context.close();
  }
});

test('all four pages satisfy automated WCAG A and AA rules', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['./', 'privacy.html', 'terms.html', 'delete-account.html']) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});
