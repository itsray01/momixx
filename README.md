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
| Recycled silicone and certificates | `/recycled-silicone` | `content/company.ts` (certifications) |
| Markets (addressable markets) | `/markets` | `content/markets.ts` |
| About, milestones, locations | `/about` | `content/company.ts`, `lib/site.ts` |
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
2. **Add the domains.** Under **Settings → Domains**:
   - Add `www.momixx.com` as the primary domain.
   - Add `momixx.com` and both versions of the second domain, and set each one to **Redirect to → www.momixx.com (308)**.
   - Having one canonical domain avoids duplicate-content penalties. The rest of the SEO work then builds on a single address.
3. **IT team: DNS.**
   - At the domain registrar, create the DNS records that Vercel shows for each domain. Vercel shows them in the Domains screen; don't copy values from elsewhere, because they are project-specific.
   - ⚠️ **Do not delete the existing MX or TXT records.** They deliver company email (`enquiries@orionmomixx.com`). Only change the website (A/CNAME) records.
4. **Old WordPress URLs.**
   - Old addresses such as `/about-us/`, `/data-cable/` and `/sustainability/` are permanently redirected to the matching new pages (see `next.config.ts`). Existing Google rankings and inbound links carry over.
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
  - `sitemap.xml` and `robots.txt` are generated automatically.
  - Vercel preview deployments are blocked from indexing.
- **Structured data (JSON-LD).**
  - Organization and WebSite on every page.
  - BreadcrumbList on inner pages.
  - Product or Service on each product page.
  - FAQPage wherever there are FAQs.
- **Answer-engine content (AEO).**
  - The Silicone page and each application page answer real questions in plain English, for example "Is silicone the same as silicon?" and "Why is silicone used in medical devices?"
  - This is the format Google's AI Overviews and featured snippets quote.
- **AI assistant visibility (GEO).**
  - `/llms.txt` is a plain-text summary of the company, products, applications, certifications and sourced market data, generated from the same content files.
  - `robots.txt` allows AI crawlers.
- **Social sharing.** Every page has a 1200×630 social image.
- **Performance.** Pages are static and fonts are self-hosted. Live 3D code loads lazily, and only on pages that use it. Cards use small pre-rendered images (see "Design, 3D and motion").

**After launch:**

1. Verify the domain in Google Search Console and Bing Webmaster Tools.
2. Submit `https://www.momixx.com/sitemap.xml`.
3. Check the structured data with Google's Rich Results Test.

## Design, 3D and motion

The site uses a dark, premium design aimed at an investor audience. It is built on four pieces:

- **Type.** Geist for text, with *Instrument Serif* italics as an accent. In any heading, wrap words in `*asterisks*` to accent them, for example `title="Silicone that *comes back*"`.
- **3D models.** Every product, application and process is a real 3D model, built in code in `components/three/models.tsx`. They are shown two ways:
  - **Live 3D** (Three.js via React Three Fiber) in page headers, the home hero, the recycling ring and the extrusion line. Live scenes follow the mouse, and the home cable turns towards you as you scroll.
  - **Pre-rendered images** (`public/renders/*.webp`, about 40 KB each) on cards, so pages with many cards stay fast. They are also the fallback shown while live 3D loads, and to search engines, screen readers and devices without WebGL.
- **Motion** (GSAP and Lenis): smooth scrolling, a pinned hero, a horizontal-scroll "sand to silicone" story, text that lights up as you scroll, count-up numbers, growing chart bars and subtle card tilt. It is all controlled by attributes such as `data-reveal` and `data-countup` (see `components/motion/ScrollEffects.tsx`).
- **Reduced motion.** Visitors whose device is set to "reduce motion" get no animation, and their 3D scenes stay still.

**Re-rendering the card images** after changing a model:

```bash
npm run dev                                   # in one terminal
node scripts/render-models.mjs                # all models, or list some: … cable seal
```

The script needs Playwright with Chromium. Models are listed in `components/three/modelNames.ts`. To show a model on a product or application, set its `illustration` field to the model's name.

## Contact form

There is no form backend yet. Submitting the form opens the visitor's email app with the enquiry filled in. To receive submissions directly, connect a form service or add a Vercel route handler, then change `app/contact/ContactForm.tsx`.

## Before launch

See [`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md). It lists the content that needs confirming, the assets to export from WordPress, and the claims for your IPO advisers to review.
