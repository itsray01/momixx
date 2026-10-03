# momixx.com

The Momixx corporate website. It replaces the WordPress site at www.momixx.com.

It is built with Next.js, deployed on Vercel, and every page is static. All the words, numbers and products live in plain files under [`content/`](content), so you can change them without touching any design code.

## Site map

| Page | URL | Content file |
|---|---|---|
| Home | `/` | `app/page.tsx` |
| What is silicone? | `/silicone` | `content/faqs.ts`, `app/silicone/page.tsx` |
| Products (one tab per product) | `/products`, `/products/<slug>` | `content/products.ts` |
| Applications (one tab per industry) | `/applications`, `/applications/<slug>` | `content/applications.ts` |
| Sustainability (claim, carbon footprint, photos) | `/sustainability` | `content/sustainability.ts`, `content/company.ts` |
| Recycled silicone and certificates | `/recycled-silicone` | `content/company.ts` (certifications) |
| Insights (articles, topics, glossary, RSS) | `/insights`, `/insights/<slug>`, `/insights/glossary` | `content/articles/*.md`, `content/glossary.ts` |
| Markets (addressable markets) | `/markets` | `content/markets.ts` |
| About and milestones | `/about` | `content/company.ts` |
| Locations | `/locations` | `app/locations/page.tsx`, `lib/site.ts` |
| Culture & careers | `/culture` | `app/culture/page.tsx` |
| Our team (management) | `/team` | `content/team.ts` |
| Research & innovation | `/innovation` | `app/innovation/page.tsx` |
| Contact | `/contact` | `lib/site.ts` (email, address) |

## Editing content

You can edit any file directly on GitHub: open the file, click the pencil icon, make the change, then choose **Commit changes**.

- **Commit to a new branch.** Vercel builds a private preview link for that branch so you can review the change.
- **Merge into `main`.** The change goes live.

Common edits:

- **Add a product.** Copy an existing entry in `content/products.ts`, give it a new `slug`, and fill in the fields. Its page, tab, footer link, sitemap entry and `llms.txt` entry are all created automatically.
- **Add a team member.** Edit `content/team.ts`. Put the headshot in `public/images/team/` (square, at least 800×800), then set `photo: '/images/team/name.jpg'` and `placeholder: false`.
  - The Team page stays hidden from Google until no placeholders are left.
- **Add a certificate PDF or logo.** Put the PDF in `public/certificates/` and the logo in `public/images/certs/`. Then set `file` and `logo` on that certificate in `content/company.ts`. A "View certificate" button appears automatically.
- **Add a product photo.** Put it in `public/images/products/` and set `image: '/images/products/xyz.jpg'` on the product. It replaces the line illustration.
- **Update a market figure.** Edit `content/markets.ts`.
- **Publish an article.** Add a Markdown file to `content/articles/`. The format and writing rules are in [`content/articles/README.md`](content/articles/README.md). It appears on the Insights hub, its topic page, the home page, the sitemap, the RSS feed and `llms.txt` automatically.
- **Add sustainability photos.** Put them in `public/images/sustainability/` and list them in `content/sustainability.ts` → `greenPhotos`. The gallery appears on `/sustainability`.
- **Add carbon footprint figures.** Fill in `carbonMetrics` (and `carbonComparison` for a recycled-vs-virgin chart) in `content/sustainability.ts`. Use validated figures only; the sections stay hidden until then.
- **Add a certificate number or verification link.** Set `number` and `verifyUrl` on the certificate in `content/company.ts`. A "Verify" link appears on its card.
  - Keep the publisher, year and URL with every number.
  - Never mix two publishers in one growth line.

### Running it locally (developers)

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build: must pass before merging
npm run lint
```

You need Node.js 20.9 or newer.

## Deploying on Vercel and switching the domains

1. **Create the Vercel project.**
   - In Vercel, choose **Add New → Project** and import this GitHub repository. Vercel detects Next.js automatically.
   - Under **Settings → Environment Variables**, add:
     - `NEXT_PUBLIC_SITE_URL` = `https://www.momixx.com` (the canonical address)
     - `REDIRECT_HOSTS` = every other hostname you own, comma-separated, for example `momixx.com,orionmomixx.com,www.orionmomixx.com`
   - Under **Analytics** and **Speed Insights**, click **Enable**. The site already includes both; they are cookie-free.
2. **Add the domains.** Under **Settings → Domains**:
   - Add `www.momixx.com` as the primary domain.
   - Add `momixx.com` and both versions of the second domain, and set each one to **Redirect to → www.momixx.com (308)**.
   - Having one canonical domain avoids duplicate-content penalties. The rest of the SEO work then builds on a single address.
3. **IT team: DNS.**
   - At the domain registrar, create the DNS records that Vercel shows for each domain. Vercel shows them in the Domains screen; don't copy values from elsewhere, because they are project-specific.
   - ⚠️ **Do not delete the existing MX or TXT records.** They deliver company email (`enquiries@orionmomixx.com`). Only change the website (A/CNAME) records.
4. **Old WordPress URLs.**
   - Old addresses such as `/about-us/`, `/data-cable/`, `/odm-oem/` and the old `/our-milestone/…` posts are permanently redirected to the matching new pages (see `legacyRedirects` in `next.config.ts`). Pages that keep the same address, such as `/sustainability/`, need no redirect. If Search Console later reports an old URL as "not found", add it to that list.
   - Keep the WordPress site running until the DNS switch is confirmed, then retire it.

### Who needs which access ("superadmin")

| Role | GitHub | Vercel | Domain registrar |
|---|---|---|---|
| Owner (you) | Repository **Admin** | Team **Owner** | Read access, or ask IT |
| Content editors | Repository **Write** | Not needed (they get preview links) | Not needed |
| Developer | Repository **Write/Maintain** | Team **Member** | Not needed |
| IT team | Not needed | Not needed | Owner: makes the one-time DNS change |

## SEO, GEO and AEO: what's built in

- **One canonical domain.** Every page sets its own canonical URL. All secondary domains, and the bare `momixx.com`, redirect to `www.momixx.com`.
- **Discovery files.**
  - `sitemap.xml` (with article dates), `robots.txt` and the Insights RSS feed (`/insights/feed.xml`) are generated automatically.
  - Vercel preview deployments are blocked from indexing.
- **Structured data (JSON-LD).**
  - Corporation (legal name, contact point, both sites) and WebSite on every page.
  - BreadcrumbList on inner pages; CollectionPage with an ItemList on the products, applications and insights hubs.
  - Product (with image and specifications) or Service on each product page.
  - Article (dates, word count, sources as citations, optional named author) on each article.
  - DefinedTermSet on the glossary; FAQPage wherever there are FAQs.
- **Answer-engine content (AEO).**
  - Key pages open with a plain-English definition, and articles answer their question in the first paragraph, with question headings, key takeaways, FAQs and cited sources.
  - This is the format Google's AI Overviews, featured snippets and AI assistants quote.
- **AI assistant visibility (GEO).**
  - `/llms.txt` is a plain-text summary of the company, products, applications, certifications and sourced market data, generated from the same content files.
  - `robots.txt` allows AI crawlers.
- **Social sharing.** Every page has a 1200×630 PNG social image. Products, applications and articles each get their own, with the page title (`lib/og.tsx`); other pages share the site image.
- **Performance.** Lighthouse scores 95–97 on mobile (Oct 2026).
  - Pages are static. The stylesheet is one small cached file (about 15 KB compressed), shared by every page.
  - Ordinary pages ship no animation library: reveals and count-ups are CSS transitions started by one IntersectionObserver. GSAP loads only for the two pinned scroll sequences, on desktop.
  - Fonts are self-hosted with size-matched fallbacks, so nothing shifts as they load. Only the main font is preloaded.
  - Live 3D loads only after the page, only on desktop screens, and only on devices with a real GPU (see "Design, 3D and motion").
- **Security.** Every response carries a Content-Security-Policy, HSTS and the other standard security headers (`next.config.ts`).

**After launch:**

1. Verify the domain in Google Search Console and Bing Webmaster Tools.
2. Submit `https://www.momixx.com/sitemap.xml`.
3. Check the structured data with Google's Rich Results Test.

## Design, 3D and motion

The site uses a dark, premium design aimed at an investor audience. It is built on four pieces:

- **Type.** Geist for text, with *Instrument Serif* italics as an accent. In any heading, wrap words in `*asterisks*` to accent them, for example `title="Silicone that *comes back*"`.
- **3D, used sparingly.** Live 3D appears in three places only: the home hero cable, the extrusion line explorer and the cable anatomy. The "sand to silicone" cards use pre-rendered stills. Page headers and cards are text-led, and there are no coloured glows.
  - **Live 3D** (Three.js via React Three Fiber, models in `components/three/`) starts only after the page has loaded, and only on desktop-sized screens with a mouse or trackpad, a hardware GPU, at least 4 GB of memory, and no data-saver or 2G/3G connection (`components/three/capability.ts`). Phones and tablets get the still image. The home cable (`HeroCable.tsx`) turns towards you as you scroll.
  - **Pre-rendered images** (`public/renders/*.webp`) are what everyone else sees: search engines, screen readers, phones, and devices without a GPU or on slow connections. The hero still (`cable-hero.webp`) is rendered from the same camera as the live scene, so the two line up when the 3D fades in.
  - If a 3D scene fails (no WebGL, a lost GPU, a failed download), `CanvasBoundary` keeps the still image on screen.
- **Motion.** A pinned hero, a horizontal-scroll "sand to silicone" story (GSAP, desktop only, `components/motion/pins.ts`), plus text that lights up as you scroll, count-up numbers, growing chart bars and subtle card tilt (CSS, `components/motion/ScrollEffects.tsx`). It is all controlled by attributes such as `data-reveal` and `data-countup`. Scrolling is the browser's own, so links to a section and the Back button behave normally.
- **Reduced motion.** Visitors whose device is set to "reduce motion" get no animation, and their 3D scenes stay still.

**Interactive 3D and infographics**

| Piece | Where | Files |
|---|---|---|
| Vertical extrusion line explorer: a 3D model of the real machine you can drag to turn, with numbered markers on its parts; click one (or a part in the list) to fly in and read what it does. A Photo toggle shows the same markers on the real photo, which is also the fallback without WebGL. The machine specs link to their parts | Home, `/products/vertical-extruder` | `components/ExtruderExplorer.tsx`, the model in `components/three/ExtruderMachine.tsx` and `MachineCanvas.tsx`, part copy, photo markers and camera views in `components/three/extruderParts.ts` |
| Anatomy of a silicone cable: the layers pull apart as you scroll | `/silicone`, `/products/momixx-mm`, `/applications/consumer-electronics` | `components/CableAnatomy.tsx`, `components/three/CableAnatomy.tsx`, layer copy in `components/three/cableLayers.ts` |
| Temperature range chart (silicone vs TPE vs PVC) | `/silicone`, `/products/momixx-move`, `/applications/electric-vehicles` | `components/TemperatureRange.tsx` |
| Mega-menu navigation, built from the content files | Every page | `components/Header.tsx`, `lib/nav.ts` |

Each extruder part can have a photo marker (`photo: { x, y }`, as percentages) and a 3D anchor with a camera view (`machine`); parts with neither are listed but not marked. The cable anatomy works without WebGL: a pre-rendered image with the same numbered markers, which zooms into the chosen layer. After moving a cable-anatomy marker or camera, run `node scripts/extruder-hotspots.mjs` so the image markers line up again, and re-render `cable-anatomy`.

**Re-rendering the card images** after changing a model:

```bash
ENABLE_RENDER=1 npm run dev -- -p 3001        # in one terminal
node scripts/render-models.mjs http://localhost:3001   # all models, or list some: … data-cable cable-hero
```

The globe's land dots (`components/three/landDots.ts`) are generated from Natural Earth data by `scripts/generate-land-dots.mjs`. Regenerate them rather than editing by hand.

The script needs Playwright with Chromium. Models are listed in `components/three/modelNames.ts`. To show a model on a product or application, set its `illustration` field to the model's name.

## Contact form

Enquiries are delivered by [Formspree](https://formspree.io) to the company inbox, with a spam trap and success and error messages.

The form's ID (`xqpareyg`, the code after `/f/` in its endpoint) is set in `lib/site.ts` → `formspreeId`. To change where enquiries are delivered, or to restrict submissions to the live domain, use the form's **Settings** in the Formspree dashboard. No code change is needed.

Each email's subject line starts "Website enquiry:" followed by the topic the visitor picked (for example "Investor relations"), so the inbox can sort them. If Formspree can't be reached, the visitor is asked to email the enquiries address instead. The form links to the privacy notice at `/privacy`.

## Before launch

See [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md). It lists the content that needs confirming, the assets to export from WordPress, and the claims for your IPO advisers to review.
