# ENOCK — personal brand site

A one-page personal brand site for **Enock** — content creator, UGC & brand collabs, law student.
Premium yellow / dark cinematic look, cutout-overlay hero, smooth scroll + reveals.

Built by [MP Launch](https://mplaunch.com.au).

## Stack
Pure static — no build step. Everything is self-contained (fonts + JS vendored locally),
so it loads instantly and can't break if a CDN goes down.

- `index.html` — the page
- `styles.css` — all styling (design tokens at the top under `:root`)
- `main.js` — Lenis smooth scroll, GSAP hero intro + parallax, native IntersectionObserver reveals
- `assets/` — his cutout (`enock.webp`), self-hosted fonts, vendored libs, social card (`og.jpg`)
- `og.html` — source used to render the social-share card (`assets/og.jpg`)

The page is fully readable with JavaScript disabled — motion is progressive enhancement only.

## Run locally
```
cd enock
python -m http.server 5178
# open http://127.0.0.1:5178
```

## Editing notes
- **Colours / yellow:** change the tokens under `:root` in `styles.css` (`--yellow`, `--ink`, …).
- **Social links:** the three buttons in the `#contact` section (`data-social="instagram|tiktok|email"`)
  currently point to `#` — drop in Enock's real Instagram / TikTok URLs and `mailto:` address.
- **Regenerate the social card:** serve locally, then screenshot `og.html` at 1200×630 and save to
  `assets/og.jpg`.
