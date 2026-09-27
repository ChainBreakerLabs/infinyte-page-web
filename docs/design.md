# Product website design

## Direction

Infinyte and ChainBreaker Labs belong to the same visual family: warm ivory,
forest green, lime accents, clear Manrope typography, and expressive Instrument
Serif. The company describes freedom; the product shows the tools to make more
intentional financial decisions. No testimonials, adoption figures, investment
returns, live balances, or download destinations are invented.

The website leads with a real Dashboard in a CSS iPhone frame. Its complete
image remains visible, including navigation and status information. A subtle
scroll transform changes the presentation without controlling page scrolling.
The owner's six raw captures appear beside the relevant feature descriptions:
accounts/budgets, planner/calendar, and debts/goals. Each has a CSS iPhone frame,
with its complete interface and original aspect ratio. There is no horizontal
gallery or separate Por dentro section.

Website decoration uses no emojis or Unicode pictograms. Decorative stars are
removed; action arrows use monochrome inline SVG with consistent stroke weight.
Icons are hidden from assistive technology, while links retain their text or
explicit accessible label. Plan bullets are CSS line marks.

## Observable interaction contracts

- The header preserves links to features, security, pricing, and availability. The hero action targets features.
- Mobile navigation reconciles accessibility and open state on breakpoint changes and page restoration.
- Escape closes mobile navigation and returns focus to its button.
- Reduced motion removes scroll/hover transforms and animated reveals.
- Without JavaScript, every page, link, and framed screenshot is readable and the mobile navigation remains available.
- All fonts and images are local; no remote embed or sound source is loaded.
- An interest link opens the existing support email. No new persistence or endpoint is introduced.
- Privacy, terms, and deletion pages preserve their original body text and public routes.

## Ownership

One initialization owns the menu state. Scroll position owns visual progress. An AbortController releases
listeners, including media-query listeners. IntersectionObserver and animation
frames have explicit teardown on pagehide and hot reload. Restored pages acquire
new ownership and reconcile the visible menu.

## Delivery

Vite compiles four static HTML entry points. The existing organization-domain
project path remains `/infinyte-page-web/`. GitHub Pages serves the build output;
there is no runtime Node service. This reversible tooling change does not change
app navigation, mobile financial data, authentication, or native configuration.
