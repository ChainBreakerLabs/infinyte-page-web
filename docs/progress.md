# Website redesign checklist

- [x] Inspect both repositories, existing routes, policy text, and asset sources.
- [x] Record the baseline: Infinyte site has no build system or existing tests; the companion company suite passes 22 checks before this update.
- [x] Remove company audio and replace its illustrative phone with the real Dashboard.
- [x] Match the company visual identity and introduce the product's editorial content.
- [x] Preserve existing anchors, pricing, policy text, contacts, and store availability state.
- [x] Optimize the supplied Dashboard and ten existing iPhone compositions.
- [x] Complete six correctness/security review passes across both websites.
- [x] Export reusable framed Dashboard images.
- [x] Verify browser behavior, accessibility, responsive layouts, types, and formatting.
- [x] Inspect the final diff and update this evidence ledger.

## Scope and baseline

Both websites are developed locally. The Infinyte app repository is read only.
No user financial data is changed. No commit, push, PR, Pages settings, or remote
deployment is authorized. The previously clean website checkout has no baseline
tests to run. The existing legal document body text is captured before editing
and verified as a public contract after the redesign.

## Review

Three read-only reviewers covered success, consistency, errors, concurrency,
integration, and security. They identified an intermediate empty documentation
directory that would cause the formatting command to fail. The required design,
setup, and progress documents now exist; the complete formatting gate will be
run before finalizing. No other concrete defect was identified by those passes.

## Previous redesign evidence (before gallery removal)

- Strict TypeScript and production compilation: PASS, including all four HTML entries and browser test types.
- Browser suite: 14/14 PASS across desktop and mobile Chrome configurations.
- Companion ChainBreaker Labs suite: 20/20 PASS after complete audio removal and actual Dashboard integration.
- Original privacy, terms, and deletion body text: exact normalized equality with pre-redesign source; effective dates and deletion contact preserved.
- Automated WCAG A/AA audits: zero reported violations on all four pages in both tested configurations.
- Gallery: all ten images loaded; buttons, focused arrow keys, native scroll state, and end boundaries verified.
- Formatting and git diff whitespace checks: PASS in both repositories. The review's empty-docs gate finding is resolved and the complete format command succeeds.
- Screenshots: desktop 1440×1000, tablet 768×1024, mobile 390×844, and narrow mobile 320×740; no document overflow, missing resources, or recorded page errors in the inspected scenarios.
- Optimized Dashboard: about 60 KiB; ten supplied compositions: about 764 KiB total. Images are loaded lazily outside the hero.
- Reusable exports: PNG with transparency and WebP in public/images/exports; inspected visually with the complete Dashboard preserved.
- Compiled JavaScript: 1.64 kB gzip; CSS: 5.56 kB gzip. These are build sizes, not measured runtime performance.
- Dependency installation audit: zero reported vulnerabilities.

No pre-existing test failures existed in this website. Initial test-harness
issues (JSON module attributes, a locator tied to a changing accessible label,
and automatic scrolling with JavaScript disabled) were corrected without
weakening behavior assertions. The no-JavaScript legal-link check now exercises
native keyboard activation. There are zero remaining newly introduced failures
in the completed gates.

No remote workflow, publication, Safari/WebKit, physical-device acceptance,
manual screen-reader certification, or line-coverage percentage is claimed.
Page-history boundary events are exercised; separately observed real BFCache
navigation is not claimed. ESLint is not configured for this previously static
website; strict TypeScript, browser behavior checks, accessibility audits, and
manual code review were completed. The native app's checks do not apply to these
static website repositories and were not run.

## Publication prerequisite

Set each repository's Pages source to GitHub Actions before an explicitly
authorized main-branch push. Then verify the remote build and deployment result.
No Git history or remote settings were changed during this local redesign.

## Follow-up: remove the gallery and use the supplied raw captures

- [x] Inspect current source, asset consumers, legal navigation, and the previous verification baseline.
- [x] Remove the entire experience/gallery section, its links, styles, handlers, and obsolete assets.
- [x] Integrate the six newly attached screenshots into existing feature content with iPhone frames.
- [x] Export reusable framed versions and update setup/design documentation.
- [x] Verify production behavior and inspect desktop, tablet, and mobile output.

The owner explicitly requested removing the Por dentro section. Its experience
anchor is removed; the hero action now targets features. The six supplied raw
captures replace the earlier poster gallery and remain unmodified inside CSS
iPhone frames. Public legal documents and routes remain unchanged.

### Current verification evidence

- Before editing: existing 14 browser checks passed.
- Current production build and strict TypeScript: PASS.
- Updated desktop/mobile browser suite: 14/14 PASS.
- Removed section: no gallery elements, controls, links, or experience anchor on any of the four pages; the hero reaches features.
- Six raw captures: complete 828×1792 images load inside individual iPhone frames, with their original aspect ratio preserved.
- Legal policy body text and deletion contact: exact original contract checks PASS.
- Automated WCAG A/AA: zero reported violations on all four pages in desktop/mobile configurations.
- Visual script: completed desktop 1440×1000, tablet 768×1024, mobile 390×844, and narrow mobile 320×740 with no overflow, missing resources, or page errors. Each feature panel was inspected.
- Export pipeline: seven screens produce fourteen reusable PNG/WebP files; all PNGs are transparent and measure 956×1880. The six new exports preserve the entire supplied screen.
- Six optimized screens total about 356 KiB. Build output JavaScript is 1.27 kB gzip and CSS is 5.29 kB gzip; these are static sizes, not runtime-speed measurements.
- Six review passes completed. The duplicated finding about the QA script's removed-section target was fixed and rechecked by running the full script. Export integration and cleanup were reviewed again.
- A test harness accidentally queried the retained La app link while checking removal; it was corrected to assert absence of Por dentro, including hidden navigation. The focused desktop/mobile removal checks and full suite pass.
- Final formatting and diff whitespace checks: PASS after formatting the touched verification script.

There are no remaining new failures in the completed checks. This follow-up did
not alter the companion company website or the mobile app. No commit, push,
remote publication, physical-device, WebKit, or manual screen-reader acceptance
is claimed.

## Authorized publication

The owner subsequently requested commits, pushes, and GitHub Pages deployment
for both websites. Earlier statements limiting the work to local development
are historical. The existing main-branch updates contain Google verification
metadata in all four HTML pages; integrate and preserve them before pushing.
The project intentionally inherits the organization's domain and has no CNAME.

Formatting, strict TypeScript, production compilation, the 14 updated browser
checks, and diff whitespace checks passed again before delivery. GitHub Actions
verifies the production output before deploying. Remote runs and their outcomes
are tracked in the Actions tab and must be checked separately from local gates.
