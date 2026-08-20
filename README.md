# rajputana.group

The Rajputana Group website: three pages, plain HTML/CSS/JS, hosted on GitHub Pages.

**There is no build step.** No npm, no framework, no Actions pipeline. You edit an
HTML file, push it, and the live site updates in about a minute. If you can edit a
Word document you can edit this site.

| Page | File | URL |
|---|---|---|
| Rajputana Group | `index.html` | rajputana.group/ |
| FxStudio | `fxstudio/index.html` | rajputana.group/fxstudio/ |
| Skwsh | `skwsh/index.html` | rajputana.group/skwsh/ |

---

## 1. Repo layout

```
/
├── index.html              Home — Rajputana Group
├── fxstudio/index.html     FxStudio brand page
├── skwsh/index.html        Skwsh brand page
├── assets/
│   ├── css/
│   │   ├── base.css        Shared: reset, type scale, header, footer, buttons
│   │   ├── home.css        Home palette + layout
│   │   ├── fxstudio.css    FxStudio palette + layout
│   │   └── skwsh.css       Skwsh palette + layout
│   ├── js/main.js          All behaviour for all three pages
│   ├── img/
│   │   ├── logos/          Brand marks (fallbacks live here)
│   │   ├── partner-brands/ Distributed-brand logos (empty — see §6)
│   │   ├── products/       Product photography + hero posters
│   │   └── team/           Leadership portraits
│   └── video/              Hero video files (see assets/video/README.txt)
├── CNAME                   Contains exactly: rajputana.group
└── README.md               This file
```

The header and footer markup is **repeated by hand in all three HTML files**. With
only three pages this is more reliable than faking includes with JavaScript. If you
change a nav link, change it in all three files.

---

## 2. Editing content

All copy lives directly in the HTML between the tags. To change a headline, find it
and type over it. Sections are separated by comment banners like:

```html
<!-- ===== LEGACY TIMELINE ===== -->
```

**Adding a timeline entry** (home page): copy an entire `<article class="tl-item">`
block, paste it in date order, change the year and text.

**Adding a product** (either brand page): copy a whole `<a class="product">` or
`<a class="sk-product">` block and change the link, image and text. Nothing else
needs updating — the grid reflows on its own.

**Adding a partner brand** (home page): add an `<li>Brand name</li>` inside either
`#panel-current` or `#panel-past`. Both lists are laid out four across on desktop,
so adding brands in multiples of four keeps every row full.

### Colours and fonts

Each brand's palette is a short list of CSS variables at the top of its stylesheet.
Change one value there and it updates everywhere on that page. For example, in
`assets/css/skwsh.css`:

```css
.sk {
  --accent: #3e6c88;   /* buttons, headings, icons */
  --field:  #fbf8f3;   /* page background */
}
```

> **The Rajputana Group palette is now MEASURED, not estimated.** It was sampled
> directly from `Rajputana_Logo.png` and cross-checked against the live blackdsn
> theme CSS:
>
> | Token | Hex | Source | Nearest Pantone (approx.) |
> |---|---|---|---|
> | `--gold` | `#FFB436` | 53.5% of emblem pixels | **143 C** (dE 6.3) |
> | `--gold-deep` | `#E17D0A` | emblem shadow layer | **1385 C** (dE 3.8) |
> | `--surface` | `#F9F9F9` | theme `--bg-color` | — |
> | `--surface-2` | `#EFEFEF` | theme `--assistant-color` | — |
>
> Fonts are the real ones too: **Excon** (headings, via Fontshare) and
> **Poppins** (body), both taken from the theme's `--heading-font` /
> `--body-font`. Pantone values are screen approximations — confirm against a
> physical guide before any print work.
>
> **The FxStudio and Skwsh palettes are still informed placeholders**, since
> their hex values live in Shopify inline CSS.
> Each brand stylesheet opens with a boxed `BRAND COLOURS — EDIT HERE` banner
> containing the exact one-line command to pull the real values off the live
> site. No Pantone numbers are published for any of these brands, so the route
> is: get the hex, then convert at pantone.com/connect. They
> could not be read off the live sites automatically. Before publishing, open
> fxstudio.co.in and skwsh.in in Chrome, right-click the logo → Inspect, and copy the
> real values from the Computed panel into the variables above. Same for the fonts,
> which load from Google Fonts in each page's `<head>`.

---

## 3. Swapping in real assets

Every image on the site already displays something, so nothing ever looks broken.
Replacing a placeholder is a one-line change.

**Logos and product photos.** Images currently point at the live Shopify/WordPress
URLs, with a local fallback:

```html
<img src="https://fxstudio.co.in/cdn/shop/files/313.jpg"
     data-fallback="../assets/img/products/placeholder.svg" alt="...">
```

To host the file yourself instead, drop it into `assets/img/products/` and change
`src` to point at it. The `data-fallback` is what appears if the main image fails.

**Hero videos.** Put the file in `assets/video/`, then set `data-src` on that page's
`<video>` tag:

```html
<video data-hero-video data-src="../assets/video/fxstudio-hero.mp4" ...>
```

Leave `data-src` empty and the page uses its poster image instead — the video only
fades in once the browser confirms it can play, so a missing file, a blocked autoplay
or a slow connection all degrade to a clean image hero. Keep files under ~15 MB;
anything bigger belongs on YouTube (unlisted) or a CDN rather than in this repo.

**Sub-brand logos already wired in.** The four business cards on the home page
and the two house cards on the FxStudio page pull real marks from
rajputana.group: `agencies_pvt_ltd.png`, `Rajputana_1.png`,
`Felisha_Logo_Final-01.png`, `super_us.png`, `skin-fx-usa.png` and
`color-fx-new-york.png`. These use `data-fallback="hide"` — if a file moves, the
image disappears rather than showing a different brand's logo in its place.

**Partner-brand logos.** The portfolio wall currently uses brand names as text, which
works at any count. To use logos, replace `<li>Sebamed</li>` with
`<li><img src="assets/img/partner-brands/sebamed.svg" alt="Sebamed"></li>`.

---

## 3b. The preloader

Every page opens with the Rajputana emblem drawing itself in gold, a hairline
ring sweeping once around it, then two white panels splitting to reveal the page.

It is deliberately hard to get stuck behind:

- Dismisses on `window.load`, but with a **3-second hard ceiling** regardless.
- A **1.15s minimum** so it never flashes distractingly on a fast connection.
- Skipped entirely if the visitor has "reduce motion" enabled.
- Skipped entirely if JavaScript fails (`<noscript>` unlocks scrolling).

To change the duration, edit the two numbers in `assets/js/main.js` section 0.
To remove it, delete the `<div class="preloader">` block from each HTML file.

## 3c. What changed in the rebuild

The home page was rebuilt around a single question: what does a brand manager at
an international consumer company need to see before they trust you with India?

- **Proof moved to position two.** The principal roster (Sebamed, Cetaphil,
  Bioderma, Avene, Medela, Pigeon, Minimalist, J&J, Godrej) now sits directly
  under the hero, before any self-description.
- **Coverage got its own section**, with a route-to-market chain showing the five
  stages the group actually runs, from import documentation to secondary-sales
  reporting.
- **Palette moved to charcoal and gold.** Gold on white read light; #14120f with
  the emblem gold reads established. The emblem appears as a large, faint
  watermark in the hero.
- **Copy rewritten for a buyer, not a browser.** Channels, categories, territory
  and service levels rather than "passionate about performance".
- **A partner brief** replaces the generic contact block — it tells an enquirer
  exactly what to send.

## 3d. Structure changes (latest pass)

- **Five businesses, not four.** FxStudio and Skwsh are now listed as businesses
  in their own right rather than folded under "Cosmetics / Felisha". They sit at
  positions 03 and 04 in the group index and link straight to their microsites.
- **The businesses are an index, not a card grid.** Five cards orphan one item at
  most widths; an indexed row layout scales and reads like a company structure.
- **Portfolio is grouped by category** — dermo-cosmetics, mother & baby,
  pharmaceuticals, FMCG, telecom, direct selling — with a gold dot marking
  currently distributed brands. Category depth is what a principal is actually
  assessing. The Current/Past tabs are gone; the dot carries that distinction.
- **Three generations of leadership.** Samarth Kanther added as third generation.

### Samarth Kanther — needs supplying
The card is live but has placeholders, both flagged. Send me, or edit directly in
`index.html`:
- Qualification / role line (currently reads "Qualification")
- A two-paragraph bio in the same voice as the other two
- A portrait, saved to `assets/img/team/samarth-kanther.jpg` (square crop works
  best; the card is 1:1). Until then it falls back to the pending placeholder.

## 3e. Design system (latest pass)

**Four type voices, each with a job.** Mixing them is what stops the page reading
like a template:

| Voice | Font | Used for |
|---|---|---|
| Serif | Instrument Serif | Headlines, big figures, years, the pull quote — the institution speaking |
| Brand | Excon (Fontshare) | Wordmark, business names, buttons, nav |
| Body | Poppins | Explanatory text |
| Data | IBM Plex Mono | Eyebrows, tags, labels |

Excon and Poppins are the live theme's own fonts, so brand fidelity holds. The
serif was added because Poppins alone reads young — wrong for a 43-year-old house.

**Chapter rhythm.** The page alternates ground rather than running six ivory
sections in a row: hero (dark) → principals (dark) → coverage (ivory) →
businesses (white) → **pull quote (full-bleed gold)** → track record (dark) →
portfolio (white) → recognition (ivory) → leadership (white) → own brands (dark)
→ partner (ivory) → footer (dark).

**The jali divider.** The emblem is a pierced Rajasthani lattice screen. Tiled
small and faint along a masked band, it becomes a rule that belongs to this
company and no other. `.jali` in home.css — three instances, used sparingly.

**The marquee.** Distribution is goods in motion, so the principal strip moves
slowly and pauses on hover. Falls back to a static wrapped list under
`prefers-reduced-motion`.

**Ghosted years.** Each timeline entry carries its year at ~7rem in 7%-opacity
gold behind the text. Depth without noise.

## 3f. Real data from Rajputana_Group.pptx (FY 2024-25)

Every placeholder number is gone. `?flags=1` now returns zero markers.

| Vertical | Entities | Team | Turnover |
|---|---|---|---|
| Distribution | Rajputana Agencies Pvt Ltd | 35 | Rs 100 Cr |
| Real estate | Rajputana Residency LLP + Associates | 5 | Rs 40 Cr |
| Brands | Felisha + **Elixir Cosmetics** | 12 | Rs 3 Cr |
| IoT devices | SuperUs Systems | 25 (60% engineers) | Rs 6 Cr |

**Group: Rs 149 Cr, 77 people, 41 years.**

Other verified figures now live on the page: 3,000+ outlets · 18+ years average
employee tenure · 37% growth Q1 FY25-26 vs Q1 FY24-25 · 350+ distributors supplied
with bundled combos · 6,000 sq.ft warehousing across Mumbai and Bhiwandi.

**Corrections made.** "9 states / 33 cities" and "110+ people" appear nowhere in
the deck and have been removed. The current portfolio is Cetaphil, Sebamed,
MotherSparsh, Minimalist, Bioderma, Mothercare, Glenmark (Episoft, La Shield),
BCPL (Adidas, David Beckham, Mercedes), plus L'Oreal and Flaura Essentials as the
newest additions.

**Portraits** were extracted from slide 2 of the deck to
`assets/img/team/*.jpg`. Note the source images were not in slide order — image4
is Kirti, image3 is Samarth, image2 is Pravesh and needed cropping to exclude a
second person.

**Not yet used from the deck** (available if you want more pages): the full
SuperUs investor story (Adani x Sharp airport installs, Reliance Smart Kurla ESL,
Panasonic Vidhan Sabha 450+ eSignCards, 15,000 sq.ft factory, Rs 34.67 Cr
pipeline), and the realty project detail.

## 4. Review mode: `?flags=1`

Several facts on this site need confirming before it goes live. Rather than ship
notes to the public, they are hidden markers. Add `?flags=1` to any URL:

```
https://rajputana.group/?flags=1
https://rajputana.group/skwsh/?flags=1
```

Every unconfirmed number and claim gets an orange **confirm** tag next to it. Normal
visitors never see these. Once a fact is confirmed, delete its
`<span class="flag">...</span>` from the HTML.

---

## 5. Flagged content — confirm before publishing

**Numbers (all from a 2023 source):** 40+ years, 110+ team members, 5+ awards,
9 states / 33 cities. The "grow by 200% in three years" mission horizon is also dated.

**Cosmetics vertical — the biggest open question.** The live rajputana.group site
still presents this arm as *Felisha Cosmetics*, containing Color Fx, Skin Fx and
*Urban Veda*. It does not mention FxStudio or Skwsh at all. This site has been built
the other way round — FxStudio and Skwsh as the two consumer brands, with Urban Veda
listed but flagged. Confirm the current legal entity name and portfolio, then edit
the Cosmetics card in `index.html`.

**Safety and certification claims.** Both brand pages carry the claims their live
sites make (Cruelty-Free, All Natural, Made Safe Certified, Pollutant-Free for
FxStudio; 100% Natural Actives, Dermatologically Tested, pH Balanced, Safe
Ingredients for Skwsh). *Made Safe* is a real third-party certification run by the
non-profit Nontoxic Certified — if we display it we should be able to produce the
certificate. Same for the dermatological testing reports. Confirm all of these or
remove them.

**Skwsh founding year.** The brief says 2025. The live skwsh.in site never prints a
year, so no founding date appears in the copy. Confirm and add it if wanted.

**The 98% customer satisfaction stat** does appear on skwsh.in, but with no stated
basis. Confirm the sample and period, or drop it.

**Testimonials** on both brand pages are *paraphrases* of public reviews, not
verbatim quotes, and are attributed generically. Replace with permissioned,
attributable quotes before publishing.

**Confirmed from the FxStudio Shopify theme (theme.liquid schema.org block and
the Terms & Conditions page), October 2026:**

| Item | Verified value |
|---|---|
| Legal entity | Felisha Cosmetics Private Limited (Companies Act, 2013) |
| Registered office | Shop No. 1/2/3, Samarth Complex, Opp. BMC Market, Jawahar Nagar, Goregaon West, Mumbai 400062 |
| Phone | +91 86577 64186 |
| Email | ecom@felisha.in |
| Amazon store | amazon.in/stores/ColorFx/page/37F922DE-ADF7-44FB-ABA9-DE8081A9DE41 |
| Official socials | Instagram @fxstudio.in, YouTube @felishaindia4204 — **no Facebook listed** |
| Jurisdiction | Courts of Mumbai |
| Sister domains | fxstudio.shop, felisha.in, skinfx.felisha.in, colorfx.felisha.in, urbanveda... |

Note the registered office is **400062**, the same building as Rajputana Agencies —
not the 400104 address that appeared on the old site footer. The Facebook icon has
been removed from the FxStudio footer because the store's own structured data lists
only Instagram, Amazon and YouTube as official channels.

**Marketplace links.** Only four are real: fxstudio.co.in, the FxStudio Amazon seller
storefront, skwsh.in, and the Skwsh FirstCry brand store. Everything else is marked
"Link pending" and points nowhere. Supply the real URLs or delete those tiles.

**Still needed to finish the brand palettes.** The uploaded theme files are Liquid
*templates*; they call `{% render 'color-schemes' %}` and `{% render 'fonts' %}`,
which are separate snippets that were not included. The actual values live in:

- `config/settings_data.json` — every colour scheme and font choice
- `snippets/color-schemes.liquid` — the CSS variable output
- `templates/index.json` — homepage content, including image and video asset paths

Any one of those three, from either store, closes the gap.

**Skwsh social links.** The Facebook, YouTube and X links on skwsh.in currently point
at bare domains, so those hrefs are placeholders here too. Instagram (@skwsh.club)
is real.

---

## 6. Assets still needed

- [ ] High-res logos, transparent SVG or PNG: Rajputana Group, FxStudio, Skin Fx, Color Fx, Skwsh — plus a **white/inverse Skwsh mark** (only a black SVG exists)
- [ ] Partner-brand logos for the portfolio wall (Sebamed, Cetaphil, Bioderma, Minimalist, J&J, Godrej and the rest)
- [ ] Leadership portraits: Kirti J Kanther, Pravesh K Kanther
- [ ] FxStudio brand video — none exists on the live site today
- [ ] Skwsh brand video — the page currently borrows one of Skwsh's own product clips
- [ ] Product photography for both brand pages (Skwsh especially — all ten cards use a tinted ingredient treatment in place of photos)
- [ ] Three Open Graph share images, 1200×630 JPG: `og-rajputana.jpg`, `og-fxstudio.jpg`, `og-skwsh.jpg` in `assets/img/`
- [ ] Favicons (currently the fallback SVG marks)
- [ ] Exact marketplace deep links for both brands
- [ ] Confirmed brand hex values and font names (see §2)
- [ ] Answers to everything in §5

---

## 7. Deploying

### A — Get the code into GitHub

1. Create a **public** repository. Custom domains on GitHub Pages are free only on
   public repos unless the account is on Pro/Team/Enterprise.
2. Either drag the whole folder in via **Add file → Upload files** in the GitHub web
   UI (no terminal needed), or from a terminal:

   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. Confirm a file named exactly `CNAME` — no extension — sits at the repo root
   containing exactly `rajputana.group`.

### B — Turn Pages on

Settings → Pages → Source: **Deploy from a branch** → Branch `main`, folder
**/ (root)** → Save.

### C — Add the custom domain

Still in Settings → Pages, enter `rajputana.group` in **Custom domain** and save.
Do this *before* changing DNS so GitHub verifies ownership correctly.

### D — Point DNS at GitHub

At whatever registrar manages rajputana.group, remove existing A/CNAME records on the
apex and add four A records on host `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optional AAAA records on `@` for IPv6:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

For `www.rajputana.group`, add a CNAME record: host `www` → `<your-username>.github.io.`
(some registrars require the trailing dot).

### E — Wait, then enforce HTTPS

Propagation is usually 5–60 minutes, occasionally up to 24 hours. When Settings →
Pages shows a green **DNS check successful**, tick **Enforce HTTPS** — GitHub issues
a free Let's Encrypt certificate automatically. To check propagation yourself:

```bash
dig rajputana.group +noall +answer -t A
```

> **This replaces the WordPress site currently serving rajputana.group.** Test first
> on the default `<username>.github.io` URL and only change DNS when you are ready to
> cut over.

### Updating later

Edit the file, commit, push. That is the whole deployment process.

```bash
git add .
git commit -m "Update team size"
git push
```

To preview locally before pushing, from the repo root:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000`.

---

## 8. Notes for whoever maintains this next

- Mobile-first and responsive; tested at 390px and 1440px.
- Semantic landmarks (`<header> <nav> <main> <footer>`), one `<h1>` per page, no
  skipped heading levels, alt text on every image, visible keyboard focus rings,
  and a skip-to-content link.
- All animation is disabled automatically for visitors who have "reduce motion" on.
- If JavaScript fails, every section is still visible and readable — the scroll
  reveals have a `<noscript>` fallback and the tab panels degrade to showing the
  first list.
- Below-the-fold images are lazy-loaded; the Skwsh video clips use `preload="none"`
  so the page stays light until someone taps play.
