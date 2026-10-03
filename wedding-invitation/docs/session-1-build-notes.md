# Session 1 — build notes

Display-only Indian wedding invitation, modelled on SitesPlaced "Royal Mandap"
(<https://demo-wedding-royal.sitesplaced.com/>). Session 1 built the full site with
**original SVG placeholder art**, so it matches the reference in layout and motion
but not in look. Session 2 swaps in painted assets and tunes the UI toward the
reference (see [the session 2 prompt](../.github/prompts/upgrade-ui-to-reference.prompt.md)).

## Requirements carried over from the original brief

- Single page, phone-first. **No RSVP, no forms, no backend, no data collection.**
- 4 events in this order: **Mehendi → Haldi → Engagement → Wedding** (order and count come from config).
- Each event card shows date, time, venue + area, dress colour, note and an **"Open in Google Maps"** link (`target="_blank" rel="noopener"`).
- Footer shows the families' line and contact numbers, not "Crafted with SitesPlaced".
- Story, Gallery, Things to Know and Music each have an `enabled` flag. A disabled section renders nothing.
- An optional Venues list sits near the end.
- `<meta name="robots" content="noindex,nofollow">`.
- Respect `prefers-reduced-motion`, WCAG AA contrast, `lang="hi"` on Devanagari, and focus management.
- All content lives in `src/content.js`.

## Status (end of session 1)

| Item | State |
|---|---|
| Local repo | `main`, commits `7eebe28` (site) and `02aa48f` (Pages URL) |
| GitHub | <https://github.com/RishabhAnand04/wedding-invitation> (public, pushed) |
| Pages | **Not enabled yet.** The first Actions run failed at `configure-pages` with a 404. Fix: **Settings → Pages → Source: GitHub Actions**, then re-run the workflow. |
| Live URL (once enabled) | <https://rishabhanand04.github.io/wedding-invitation/> |
| Content | Sample placeholder values, each marked `// TODO` in `src/content.js` |
| Art | Hand-written SVG placeholders in `public/art/` |
| Untracked | 19 new `.webp` files in `src/assets/` (added after session 1; see the end of this file) |

The `gh` CLI is signed in as `pranand2_amadeus` (a work account). The repo belongs to
**RishabhAnand04**. The push succeeded through Git Credential Manager because the remote URL
names that user: `https://RishabhAnand04@github.com/RishabhAnand04/wedding-invitation.git`.

## Stack

- Vite 8.3 with vanilla ES modules and plain CSS custom properties. Node 20.19+ is required.
- GSAP 3.15 with ScrollTrigger: the pinned scenes, parallax, reveals, petals and dusk tint.
- Google Fonts: Playfair Display, Lora, Tiro Devanagari Sanskrit, Manrope (`display=swap`).
- Lucide icon paths are inlined in `src/icons.js` (ISC licence).
- The JS bundle is about 138 kB (53 kB gzipped); CSS is about 23 kB.

## File map

| File | Purpose |
|---|---|
| `index.html` | Static head: robots, theme-color, font links. `<!--invitation-head-->` is replaced at build time. |
| `vite.config.js` | `base: '/wedding-invitation/'`. The `invitationHead()` plugin injects the title, description, OG/Twitter tags (absolute `og:image` from `meta.siteUrl`), favicon, and preloads for the hero portrait/backdrop and the first scene. |
| `src/content.js` | **All content.** Names, dates, families, events, optional sections, footer, meta. |
| `src/art.js` | `art(name)` returns `BASE_URL + 'art/' + (overrides[name] ?? name + '.svg')`. `publicUrl(path)` handles photos and audio. |
| `src/icons.js` | `icon(name, {size, stroke, cls})`: inline Lucide SVG. |
| `src/render.js` | Builds all markup from config with HTML-escaping (`esc`) and an http(s)-only `safeUrl`. One function per section. |
| `src/motion.js` | GSAP: overlay petals and open, hero parallax and petals, the pinned celebrations timeline, reveals, dusk tint. Exports `reducedMotion`. |
| `src/main.js` | Renders the page, locks scroll, wires the open button (music, focus, `scrollTo(0,0)`, `ScrollTrigger.refresh`), countdown, music toggle. |
| `src/styles.css` | Tokens, shared pieces, every section, keyframes, reduced-motion overrides. |
| `src/assets/paper.svg`, `damask.svg` | Texture tiles. Small enough to be inlined into the CSS as data URIs. |
| `public/art/*.svg` | Placeholder art: hero layers, the 4 scenes, motifs, skyline. |
| `public/og.jpg` | 1200×630 screenshot of the sealed overlay with the sample names. |
| `public/favicon.svg` | Maroon tile with a gold diamond. |
| `.github/workflows/deploy.yml` | checkout@v7 → setup-node@v7 (lts) → `npm ci` → build → configure-pages@v6 → upload-pages-artifact@v5 (`dist`) → deploy-pages@v5. Runs on pushes to `main` and on `workflow_dispatch`. |
| `.gitignore` | `node_modules`, `dist`, `.playwright-mcp/` |

## Page structure (render order) and implementation

1. **Ambient layer** (`.ambient`, fixed, z 0). From bottom to top: ivory base, paper tile (560px, multiply, .5), damask tile (420px, multiply, .4), top gold radial glow, sun (CSS `spin` 120s), two clouds (CSS `drift`), dusk tint (`[data-dusk]`, GSAP opacity 0→.25 over the whole page scroll), vignette, and two marigold strands (`strandSway` 4.2s/4.9s, transform-origin top; the left strand is hidden below 768px).
2. **Overlay** (`[data-overlay]`, fixed, z 100, `role="dialog" aria-modal`). A clipped `.overlay__decor` holds the paper, damask, glow and strands, so the long strands can't make the overlay scroll. The `.petals` layer (20 GSAP petals, z 35) sits above the card. The centred `.frame` card contains the thali and medallion, the invocation, "You are cordially invited", the names with a gold `&`, and the pill button. On open: fade out with scale 1.04 (0.6s), remove, unlock `html.is-locked`, set `main.inert = false`, show the music button, `scrollTo(0,0)`, focus `#hero-title`, refresh ScrollTrigger, then a staggered reveal of `[data-hero-reveal]`.
3. **Hero** (`.hero`, 100svh). Layers are `data-layer="backdrop"` (`<picture>`: portrait source at ≤767px, `inset:-12% 0 0`, cover, centre bottom), `couple` (centred with `margin-inline:auto`, width `clamp(220px,38vw,420px)`, drop-shadow), `foreground` (top, `max-height:32svh`, cover, top), petals, and `text` (panel with ivory radial glow, invocation, divider, h1 "Bride / weds / Groom", tagline, date pill). Scroll timeline (scrub): backdrop yPercent 10, couple 8, foreground −45, text y −90 and **opacity** (not autoAlpha, so the focused h1 isn't blurred). Hero petals pause when the hero is off-screen.
4. **Families** (`.families__card`, framed, `data-reveal`). Two columns ("Daughter of" / "Son of") with a ✦ separator, then a divider, the request line and the closing line.
5. **Celebrations**: section header, then `[data-stage]`.
   - With motion, `.stage--pinned` sets 100svh and stacks the scenes absolutely. The pin lasts `n × innerHeight`, with `scrub: 0.6` and `anticipatePin`.
   - Timeline uses one unit per event. Each scene art goes from `scale 1.08, yPercent 2` to `1, 0`. At `t = i − 0.45`: the previous card goes to `y −34, opacity 0`; the next scene goes to opacity 1 (0.35); the next card goes to `y 0, opacity 1` (starting at +0.2).
   - `onUpdate` sets `.is-active` on the current scene (only the active scene has `pointer-events:auto`, so map links in hidden scenes can't steal clicks) and on its dot.
   - A `focusin` handler scrolls to the scene that receives keyboard focus.
   - Dots sit right-centre on desktop and top-centre (horizontal) at ≤600px.
   - Without motion (the default CSS), scenes are static stacked cards.
6. **Story / Gallery**: rendered only when `enabled` is true and `items` is not empty. Images go in `public/photos/`. Staggered reveal via `[data-reveal-group]` / `[data-reveal-item]`.
7. **Things to Know**: hashtag plus Lucide icon cards. The elephant and cloud floaters are here.
8. **Venues** (optional): unique venue+area pairs, each listing the event names that use it, the address and a map pill.
9. **Countdown**: a 4-column grid with `tabular-nums`. After the target time it hides the units and shows `doneText`.
10. **Footer**: divider, families, line, `tel:` contacts, skyline image, peacock and parrots floaters. Bottom padding `clamp(13rem,26vw,21rem)`.
11. **Music toggle** (optional): fixed round button. Playback starts from the open click, and the music pauses when the tab is hidden.

**Floaters** use `.floater` plus position styles set inline. Modifiers are `--sm-up` / `--md-up` (hidden below 640/768px) and animations `--bob`, `--drift`, `--sway`, `--flip`. These use the individual `translate`/`rotate` CSS properties, so they don't clash with flip transforms.

## Design tokens (`:root`)

These match the reference except the two marked † below, which were darkened so small text passes WCAG AA on textured ivory.

`--ivory #f6efe3`, `--card rgba(250,245,234,.94)`, `--ink #3a2a1b`, `--ink-body #493a2b`,
`--ink-muted rgba(58,42,27,.74)` † (reference .62), `--maroon #7b1e2b`, `--gold #c9a227`,
`--gold-deep #7d6118` † (reference #8A6D1C), `--gold-text #4a3410`, frame border and outline as in the reference.
Section padding is `clamp(4rem,9vw,6.5rem) 1.25rem`.

## Testing done

- Viewports 360×640, 390×844 and 1440×900 on both the dev server and `vite preview`: no horizontal overflow, no broken images, no console errors.
- Overlay: scroll is locked, Tab reaches the button, Enter opens it, and focus moves to `#hero-title` and stays there after scrolling.
- Pinned scenes: verified the scene opacities and active dot at several scroll points.
- Keyboard: tabbing to scene 2's map link scrolls to scene 2.
- Reduced motion (emulated): no pin spacer, no petals, instant open, hero text visible, static cards.
- Production build: every URL carries the base path. The OG image URL is absolute: `https://rishabhanand04.github.io/wedding-invitation/og.jpg`.

## Gotchas learned

- Writing any file into `public/` while `npm run dev` is running triggers a full page reload. Save screenshots to `.playwright-mcp/` and copy them afterwards.
- Headless screenshots right after a scroll can show a stale frame. Take two.
- A browser reload restores the old scroll position behind the overlay. Fixed with `ScrollTrigger.clearScrollMemory('manual')` plus `scrollTo(0,0)` on open.
- GSAP `autoAlpha` sets `visibility:hidden`, which blurs a focused element. Use `opacity` on anything that may hold focus.
- PowerShell reports `git push` as exit code 1 because git writes progress to stderr. Check the output, not the exit code.

## Why it doesn't look like the reference yet

1. **Art.** The reference uses painted Mewar-miniature WebP art; ours is flat vector placeholders. This is the biggest gap.
2. **Hero foreground.** The reference uses a **toran** (marigold garland with brass bells) along the top. Ours is maroon drapery.
3. **Overlay plate.** The reference uses a scalloped, jewelled `plate.webp` with the Ganesh medallion at `inset:24%`. Ours is a vector brass thali with a kalash.
4. **Textures.** The reference uses real paper and damask WebP tiles. Ours are SVG noise and a simple motif.
5. **Ambient motion.** The reference animates the sun with rotation **plus a slow scale "breath"**, and drives clouds, strands and parrots with GSAP (flight-like drift). Ours uses simple CSS keyframes.
6. **Section floaters.** The reference places parrots, vine sprigs, lotus clusters, the elephant walk and a side-view peacock with scroll parallax (`translate(0%, 6%)` wrappers). Ours places them statically with idle loops.
7. **Overlay card.** It has a translucent ivory radial background here; the reference card has none.

## Assets added after session 1 (`src/assets/`, untracked)

| File | Size | Alpha | Intended use |
|---|---|---|---|
| `hero-backdrop.webp` | 1080×717 | – | Hero palace backdrop, used for **both phone and desktop** (your decision; no separate portrait image). |
| `paper.webp` | 560×560 | – | Paper texture tile (560px, multiply, .5; event cards use 380px) |
| `damask.webp` | 640×640 | – | Damask texture tile (shown at 420px, multiply, .4) |
| `hero-couple.webp` | 640×964 | ✓ | Hero couple |
| `hero-foreground.webp` | 1080×384 | ✓ | Toran across the top of the hero |
| `plate.webp` | 750×767 | ✓ | Overlay plate (replaces the thali) |
| `ganesh-medallion.webp` | 256×259 | ✓ | Inside the plate |
| `corner-ornament.webp` | 256×262 | ✓ | Frame corners |
| `sun-medallion.webp` | 300×301 | ✓ | Ambient sun |
| `cloud-a.webp`, `cloud-b.webp` | 520×382, 420×308 | ✓ | Ambient and section clouds |
| `marigold-strand.webp` | 106×897 | ✓ | Hanging strands |
| `parrots.webp` | 380×284 | ✓ | Floaters |
| `petal.webp` | 56×62 | ✓ | Falling petals |
| `scene-mehndi.webp` | 1080×717 | – | Mehendi scene |
| `scene-haldi.webp` | 1080×717 | – | Haldi scene |
| `scene-reception.webp` | 1080×717 | – | Proposed for Engagement (couple in a palace hall) |
| `scene-sangeet.webp` | 1080×717 | – | Spare (night dance). Could go to the gallery or replace Engagement. |
| `scene-mandap.webp` | 1080×717 | – | Wedding scene |

Not supplied, so these still use SVG placeholders: `vine-sprig`, `lotus-cluster`, `elephant`,
`peacock`, `skyline`. No `hero-portrait` is needed, because the same backdrop is used on every screen size.

**Licence note.** These file names match the reference site's `/templates/wedding-royal/` paths
one for one. If they were downloaded from the SitesPlaced demo, they are that vendor's artwork,
and the original brief said not to copy it. Don't commit or deploy them to the public repo unless
you have a licence or permission from SitesPlaced, or the files are your own (for example, generated
by you). Session 2 starts by confirming this.

## Session 2 (same day): painted assets integrated

- **Licence:** the user confirmed the images are licensed or their own, so they are committed and deployed.
- **Art location:** the painted WebP files now live in `public/art/`. `src/art.js` serves `.webp` by default and `.svg` only for `elephant`, `peacock`, `vine-sprig`, `lotus-cluster` and `skyline` (no painted versions). The replaced SVG placeholders were removed. `paper.webp` and `damask.webp` stay in `src/assets/` (hashed by Vite through the CSS).
- **Events:** Mehendi → `scene-mehndi`, Haldi → `scene-haldi`, Engagement → `scene-sangeet` (user's choice), Wedding → `scene-mandap`.
- **Hero:** a single `hero-backdrop.webp` for every screen size (no `<picture>`, no portrait preload); `hero-foreground.webp` is the toran.
  - Measured against the live reference at 1440×900: toran height 288px and couple top at 285px, identical to the reference.
- **Overlay:** `plate.webp` with `ganesh-medallion.webp` at `inset:24%`. The translucent card background was removed, as in the reference.
- **Gallery:** enabled with five paintings. Gallery items accept `art` (painting) or `img` (photo in `public/photos/`).
- **Event card:** now uses the reference values: padding `1.7rem 1.9rem`, radius 6px, shadow `0 18px 50px rgba(15,8,2,.35)`.
- **Ambient motion, matched to values sampled from the live reference:**
  - Sun: rotation 240s per turn, plus a scale breath 1 → 1.06 (6s, alternating).
  - Ambient clouds: drift ±45px (36s).
  - Parrots: flight loop of x 0 → 26px (5.5s), y 0 → 10px (3.5s) and tilt 0 → 3° (4.5s).
  - Vines and lotus: bob 3px (3.5s).
  - Section clouds (`.floater--drift`): scroll parallax `yPercent` −6 → 6.
- **OG image:** `public/og.jpg` was regenerated from the painted overlay.
- **Verified:**
  - 360×640, 390×844 and 1440×900: no broken images and no horizontal overflow; the overlay fits without scrolling.
  - All 4 event cards fit in the pinned stage at 360×640.
  - The build emits base-prefixed texture URLs and preloads `hero-backdrop.webp` and `scene-mehndi.webp`.
- **Not done:** visual side-by-side screenshots (the image budget ran out in that chat). Re-check by eye on a phone after deploying.
- **Still needed:** painted vine sprig, lotus cluster, elephant, peacock and skyline if they become available; real content in `src/content.js`; and turning on Pages.
