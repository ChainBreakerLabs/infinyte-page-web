# Infinyte website

The public product website for Infinyte, the personal-finance app by
ChainBreaker Labs. It shares the company's ivory, forest, lime, Manrope, and
Instrument Serif identity. The interface uses the owner's real Dashboard
capture and six supplied app screens, each inside a CSS iPhone frame.
There is no audio, analytics, registration form, or financial-data integration.

## Local development

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5180/infinyte-page-web/`. To inspect the production output:

```sh
npm run build
npm run preview
```

Open `http://127.0.0.1:4180/infinyte-page-web/`. The development and preview
ports differ from the companion company website, so both can run together.

## Verification

```sh
npm run types
npm run format:check
npm run build
npx playwright install chromium
npm test
```

Browser tests run against the production build. Rebuild after changing source.
Tests use installed Google Chrome on macOS when present, otherwise Playwright
Chromium. CI installs Chromium and its system dependencies. Coverage includes
local assets, complete framed screenshots, removed-section navigation, mobile menu, page
restoration, 320px layout, reduced motion, no JavaScript, original legal text,
and automated WCAG A/AA checks on all four pages.

`node scripts/visual-qa.mjs` saves desktop, tablet, mobile, and 320px screenshots
to `/private/tmp/infinyte-visual-qa` while checking resource errors and overflow.
This requires the production preview running. An automated accessibility audit
does not establish full screen-reader or physical-device acceptance.

## GitHub Pages

Vite builds static HTML, CSS, JavaScript, images, and fonts into `dist/`. Node
is needed to build the site, not to serve it on GitHub Pages.

The existing public URL remains
`https://chainbreakerlabs.com/infinyte-page-web/`. The configuration uses
`base: '/infinyte-page-web/'`. All four HTML pages are build entries, preserving
`privacy.html`, `terms.html`, and `delete-account.html` and the remaining
anchor URLs. The removed Por dentro section no longer has a navigation link
or experience anchor.
Do not add a CNAME for this project; it inherits the organization's domain.

**Before publishing this source version, set Settings → Pages → Build and
deployment → Source to GitHub Actions.** The prepared workflow verifies
formatting, builds, runs browser tests, and uploads `dist/`. It deploys only on
an authorized main-branch push or manual run; pull requests only verify.
Raw TypeScript cannot be served directly from a branch-based Pages deployment.
Commit and push to main only when publication is authorized. Inspect the Actions
run and the live site before considering a deployment complete.

Reference: [Vite GitHub Pages deployment](https://vite.dev/guide/static-deploy.html#github-pages).

## Assets and product boundaries

- `public/images/dashboard.webp`: optimized `dashboard.jpeg`, not a reconstructed UI.
- `public/images/screens/`: six optimized raw screenshots supplied by the owner.
- `assets/screens/`: original Dashboard and attached screenshot files.
- `public/images/exports/`: transparent, reusable iPhone exports for all seven screens.
- `public/fonts/`: self-hosted fonts with included SIL OFL licenses.
- `src/main.ts`: menu, scroll response, and resource lifecycle.
- `src/styles.css`: shared tokens, responsive presentation, and CSS iPhone frame.
- `tests/fixtures/legal-content.json`: normalized original legal body text from the pre-redesign commit.

To regenerate the transparent framed iPhone exports, start the production
preview and run `npm run export:iphone`. Each screen is exported as a PNG
and WebP in
`public/images/exports/`.

To replace the supplied assets without cropping or reconstructing their content:

```sh
npm run assets
```

The default source directory is `assets/screens/`: `dashboard.jpeg` plus
`accounts.png`, `budgets.png`, `debts.png`, `goals.png`, `planner.png`, and
`calendar.png`. An optional source directory can be passed explicitly:

```sh
npm run assets -- /absolute/path/to/source-images
```

Sharp resizes/encodes without cropping or reconstructing the UI.
CSS frames preserve each complete image and its aspect ratio. The previous
poster gallery and its published assets are removed. Legacy PNG originals in
`images/` remain as source material and are not included in production output.

Existing pricing and free-plan limits are retained from the previous website;
store availability remains described as upcoming. The interest action opens the
existing support email; it does not register a visitor on a mailing list or
promise an automatic notification. Legal policy wording, effective dates, and
deletion contacts are preserved exactly.

See [design decisions](docs/design.md) and [progress and evidence](docs/progress.md).
