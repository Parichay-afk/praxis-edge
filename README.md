# Praxis Edge

Marketing site for **Praxis Edge** — the education vertical of Praxis Advertising. Education marketing + campus design partner for institutions across the UAE and MENA.

Production: <https://praxis-edge.com>

## Stack

- [Astro](https://astro.build) (static output)
- TypeScript
- Plain CSS (no framework — see [src/styles/global.css](src/styles/global.css))
- Hosted on **Cloudflare Pages**
- Contact form via **Web3Forms** (set the access key in [src/data/site.ts](src/data/site.ts))
- Analytics: Google Analytics 4 with Consent Mode v2

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # serve the built site locally
```

## Project layout

```
.
├── astro.config.mjs        # site + integrations (sitemap, mdx)
├── praxis_edge.html        # legacy single-file site, kept as reference (delete once verified)
├── public/
│   ├── _headers            # Cloudflare security headers + cache
│   └── robots.txt          # points to /sitemap-index.xml (auto-generated)
└── src/
    ├── components/         # one .astro file per section
    ├── data/               # content extracted from the page (services, work, faqs, etc.)
    ├── layouts/Layout.astro # <head>, GA, JSON-LD, OG, skip-link wrapper
    ├── pages/
    │   ├── index.astro     # homepage
    │   └── 404.astro       # not-found page
    ├── scripts/main.client.ts # cursor, canvas, typewriter, scroll, form, FAQ
    └── styles/global.css
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Pages, create a project from the repo.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Cloudflare auto-picks up `public/_headers` for security headers and cache rules.

## Open items before phase 3

- [ ] Replace `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` in [src/data/site.ts](src/data/site.ts) with a real key from <https://web3forms.com>. Until then, the form falls back to `mailto:`.
- [ ] Add `public/og-image.png` (1200×630) for link previews.
- [ ] Self-host the ~14 portfolio images currently hot-linked from `cdn.prod.website-files.com` (see [src/data/work.ts](src/data/work.ts)).
- [ ] Delete `praxis_edge.html` once the Astro build is verified in production.
