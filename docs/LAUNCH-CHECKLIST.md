# Launch checklist

Everything here needs a human decision or a file from the company before the new site replaces WordPress.

## 1. Content to confirm

| # | Item | Where | Why it matters |
|---|---|---|---|
| 1 | **Management team.** Names, titles, 2–3 sentence bios and headshots. | `content/team.ts` | The page shows placeholders and is hidden from Google until they are filled in. |
| 2 | **Second domain name.** The site assumes `orionmomixx.com`, based on the email address. | `REDIRECT_HOSTS` in Vercel | Needed for the redirect and for SEO consolidation. |
| 3 | **Legal entity name** for the footer (currently "Orion MoMixx"). | `lib/site.ts` → `legalName` | Footer copyright and structured data. |
| 4 | **What are the Selix and Crimson lines?** Their descriptions are written only from the grade tables. | `content/products.ts` | Product pages need accurate positioning. |
| 5 | **Certificate details.** Years for SCS Global and the carbon footprint validation, the certifying body, and scope. | `content/company.ts` | Shown on the certificate cards. |
| 6 | **New products** you want added. | `content/products.ts` | See the README for how to add one. |
| 7 | **LinkedIn and other official profiles.** | `lib/site.ts` → `sameAs` | Helps Google and AI assistants link the brand. |
| 8 | **Investor relations.** Whether to add an IR page, and when. | Not yet built | Timing depends on your IPO advisers (see section 3). |
| 9 | **Green-initiative photos from Jaslyn.** | `public/images/sustainability/` + `content/sustainability.ts` → `greenPhotos` | The photo gallery on /sustainability appears automatically once photos are listed. |
| 10 | **Carbon footprint figures and validation statement.** For example, kg CO₂e per kg, the boundary, the verifier and the year. | `content/sustainability.ts` → `carbonMetrics` / `carbonComparison`; PDF in `public/certificates/` | The figures block and the recycled-vs-virgin chart appear once real, validated numbers are added. Never estimate. |
| 11 | **Careers contact.** Use a dedicated email (e.g. careers@) instead of enquiries@. | `app/culture/page.tsx` | CVs currently go to the general enquiries inbox. |
| 12 | **Article review owner.** Who checks new Insights articles before they go live. | `content/articles/` | Keeps facts and claims accurate as the library grows. |
| 13 | **Penang plant details.** Full street address, photos, floor area and headcount (if disclosable). | `app/locations/page.tsx`, `app/layout.tsx` (Organization `location`) | Site pages like Wacker's rank for "[company] [city]" and plant-capability searches. |
| 14 | **Certificate numbers and public verification links** for GRS, ISCC PLUS and SCS. | `content/company.ts` → `number`, `verifyUrl` | A "Verify" link to each scheme's public database is the strongest proof of an "only" claim. |
| 15 | **Named article authors.** One or two engineers or managers willing to be credited. | `author:` in each article's frontmatter | Named expert bylines are a trust signal for Google and AI answer engines. |
| 16 | **Recycled vs virgin test data.** Tensile, tear, elongation and ageing results, with methods. | A new Insights article | AI answers currently repeat that recycled silicone "loses quality". Published data that shows otherwise is the page most likely to be cited. |

## 2. Assets to export from WordPress

These are in the WordPress Media Library under `wp-content/uploads/`. They could not be downloaded directly.

Two photos have already been carried over from screenshots of the old pages, at the size they were displayed (about 500 px wide): the extruder (`public/images/products/vertical-extruder.webp`) and the white data cable (`public/images/products/momixx-mm-cable.webp`). Replace them with the original files for full resolution.

| File on the current site | Put it in | Use |
|---|---|---|
| Official logo, as SVG if possible | Replace the stand-in in `components/Logo.tsx` and `app/icon.svg` | Header, footer, favicon. The current mark is an approximation. |
| `2024/06/DSC00175-1.png` (extruder) | `public/images/products/vertical-extruder.png` | Vertical extruder page |
| `2024/08/equipment-scaled.webp` | `public/images/products/horizontal-extruder.webp` | Horizontal extruder page |
| `2024/06/DSC00416-1.png` (data cable) | `public/images/products/momixx-mm.png` | MM series page |
| `2024/06/DSC00413-2.png` (EV cable) | `public/images/products/momixx-move.png` | MV series page |
| `2024/04/prod-series-01.png`, `prod-series-02.png` | `public/images/products/` | MHD and MPC pages |
| `2024/08/scs-global-services-…png`, `global-recycled-standard…png` | `public/images/certs/` | Certificate cards. Check each scheme's logo-use rules first. |
| Certificate PDFs (GRS, ISCC PLUS, SCS, ISO 13485) | `public/certificates/` | "View certificate" buttons |

Then set the `image`, `logo` or `file` field on the matching entry. See the README.

## 3. Claims for IPO counsel to review

A listing candidate's website is usually treated as public communication during the IPO process. Have your advisers review these before launch:

- **Market figures** (`content/markets.ts`, `/markets` and each application page).
  - All are third-party estimates with the publisher, date and link shown, plus a disclaimer.
  - Where publishers disagreed, the more conservative figure was used.
  - Checked on 2 Oct 2026.
- **"World's first vertical extrusion machine"** and **"20+ patents"**. Keep the patent numbers on file as evidence.
- **"Supplied to a Fortune Global 500 company"** and **"qualified by a leading smartphone brand"**. Confirm these don't breach customer NDAs.
- **Test results versus TPE and XLPO** (product pages). These are labelled "Momixx internal testing". Keep the test reports.
- **Sustainability claims.**
  - The old site's "better than net-zero" and "carbon neutrality across all operations by 2024" wording was **deliberately left out**, because it could be read as greenwashing without current evidence.
  - Re-add it only with substantiation.
- **"Maturity" labels on applications.**
  - Labels: In mass production / Certified & scaling / Emerging opportunity.
  - These were added so that investors aren't given the impression that AI data centres and robotics are existing revenue lines. Adjust them if this is wrong.
- **"To our knowledge, the only silicone company certified under both GRS and ISCC PLUS".**
  - This is shown on the home page and on /sustainability, at Dr Cheah's request.
  - An "only" claim needs documented evidence, such as a search of the GRS and ISCC certificate databases, kept on file.
  - Remove "To our knowledge" only once that evidence exists.
- **No mention of China.** Per Dr Cheah, the second manufacturing facility is described only as "a second large-volume facility in Asia".
  - Nothing on the site contradicts its existence.
  - Confirm with your advisers that this is consistent with what the prospectus will disclose.
- **EU PFAS wording.**
  - The old site said the EU "will restrict PFAS by 2026". As of Oct 2026, the restriction is still going through ECHA and the European Commission and is not yet law.
  - The new site says the EU is "working towards" a restriction.

## 4. Go-live steps

1. Vercel project created, environment variables set, and the preview reviewed.
2. Domains added in Vercel, with the secondary domains set to redirect.
3. IT changes the DNS. **MX and TXT records stay untouched.**
4. Spot-check old URLs: `/about-us/`, `/data-cable/` and `/sustainability/` should all redirect.
5. Verify the site in Google Search Console and Bing, and submit the sitemap.
6. Retire WordPress after about two weeks with no issues.
