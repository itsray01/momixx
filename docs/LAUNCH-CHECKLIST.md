# Launch checklist

Everything here needs a human decision or a file from the company before the new site replaces WordPress.

## Pending questions

Open questions for Dr Cheah. Each one blocks a change on the site; the answer decides what changes.

| # | Question | Why it matters | What changes | Where |
|---|---|---|---|---|
| Q1 | **Is the Perai plant (MoMixx Malaysia Sdn. Bhd.) the "second large factory in Asia"?** | The site lists Batu Kawan and Perai by name, plus "a second large factory in Asia" whose location isn't given. If Perai is that factory, the site counts it twice. | **Yes:** remove the unnamed factory from the Locations and About pages, and say Perai is our large-volume factory. **No:** nothing changes. | `app/locations/page.tsx`, `app/about/page.tsx` |
| Q2 | **What does the Perai plant make, and when did it open?** | Its card on the Locations page only says "Manufacturing" and the company name, so it looks thin next to Batu Kawan. | Add two or three facts (products, year opened, certifications) and a one-line description. | `app/locations/page.tsx` (the `perai` entry), `lib/site.ts` → `locations` |

## 1. Content and settings to confirm

| # | Item | Where | Why it matters |
|---|---|---|---|
| 1 | **Management team.** Names, titles, 2–3 sentence bios and headshots. | `content/team.ts` | Until every entry is real, `/team` returns "not found" in production and is left out of the menu, footer, About page and sitemap. |
| 2 | **Second domain name.** The site assumes `orionmomixx.com`, based on the email address. | `REDIRECT_HOSTS` in Vercel | Needed for the redirect and for SEO consolidation. |
| 3 | **Company name.** The brand is spelled "MoMixx" everywhere (logo, footer, page titles, running text, product names); the © line, share cards and structured data use the legal name "Orion MoMixx". Confirm the registered company name (e.g. "… Pte. Ltd."). The UEN (201310727R) is set. | `lib/site.ts` → `name`, `legalName`, `registrationNumber` | Footer, structured data, privacy notice and terms. One place to change. |
| 4 | **Contact form delivery.** The Formspree form (`xqpareyg`) is connected. Confirm it delivers to the enquiries inbox, and on the free plan check the monthly submission limit is enough. Once live, add `www.momixx.com` under the form's allowed domains in Formspree. | Formspree dashboard → the form's Settings | An enquiry that never arrives is a lost customer. |
| 5 | **Dedicated inboxes** for careers and investor relations, if wanted. | `lib/site.ts` → `careersEmail`; for investor enquiries, a mail rule on subjects starting "Website enquiry: Investor relations" | CVs and IR enquiries currently go to enquiries@. |
| 6 | **Privacy notice and terms of use.** Drafts are live at `/privacy` and `/terms`, written from what the site actually does (enquiry form, cookie-free analytics, hosting logs). | `app/privacy/page.tsx`, `app/terms/page.tsx` | Must be reviewed by your lawyers, including the forward-looking statements paragraph, which should match the listing documents. |
| 7 | **What are the Selix and Crimson lines?** Their descriptions are written only from the grade tables. | `content/products.ts` | Product pages need accurate positioning. |
| 8 | **Certificate details.** For GRS, ISCC PLUS and ISO 13485: the certification body, certificate number, scope, and the year for SCS. | `content/company.ts` | Shown on the certificate cards ("issued by an accredited certification body" until named). |
| 9 | **LinkedIn and other official profiles.** | `lib/site.ts` → `sameAs` | Helps Google and AI assistants link the brand. |
| 10 | **Investor relations.** Whether to add an IR page, and when. | Not yet built | Timing depends on your IPO advisers (see section 3). |
| 11 | **Green-initiative photos from Jaslyn.** | `public/images/sustainability/` + `content/sustainability.ts` → `greenPhotos` | The photo gallery on /sustainability appears automatically once photos are listed. |
| 12 | **Carbon footprint figures and validation statement.** For example, kg CO₂e per kg, the standard (e.g. ISO 14067), the boundary, the verifier and the year. | `content/sustainability.ts` → `carbonMetrics` / `carbonComparison`; PDF in `public/certificates/` | The site says only that the calculation was checked by an independent third party. The figures block appears once real, validated numbers are added. Never estimate. |
| 13 | **Article review owner and named authors.** Who checks new Insights articles, and one or two engineers willing to be credited. | `author:` in each article's frontmatter | Articles now show an "Updated" date and "MoMixx technical team" until a named author is added. |
| 14 | **Penang plant details.** Both addresses are set. Still needed: photos, floor area and headcount for both plants (if disclosable). For Perai, see pending questions Q1 and Q2. | `lib/site.ts` → `plants`, `app/locations/page.tsx` | Site pages rank for "[company] [city]" and plant-capability searches. |
| 15 | **Certificate numbers and public verification links** for GRS, ISCC PLUS and SCS. Decide with counsel first (see section 3, "Second facility"). | `content/company.ts` → `number`, `verifyUrl` | A "Verify certificate" link is the strongest proof of an "only" claim. |
| 16 | **Recycled vs virgin test data.** Tensile, tear, elongation and ageing results, with methods. | A new Insights article | Published data that shows recycled silicone performs like new is the page most likely to be cited by AI answers. |

## 2. Photos and files

The site has almost no photography. Real photos of the factory, machines, products and people will do more for the site than any other change. Priorities:

| File | Put it in | Use |
|---|---|---|
| Official logo, as SVG | Replace the stand-in in `components/Logo.tsx` and `app/icon.svg`, then regenerate `app/favicon.ico`, `app/apple-icon.png` and `public/icon-*.png` from it | Header, footer, browser tab, home-screen icon. The current mark is an approximation. |
| A new, high-resolution photo of the vertical extruder, shot in Penang | `public/images/products/vertical-extruder-photo.webp` | The current image is a ~500 px capture from the old site. A wall socket in the background has been retouched out; a new photo removes the need for that. Keep the same framing so the numbered markers still line up, or ask for the marker positions to be updated. |
| `2024/06/DSC00416-1.png` (data cable) | `public/images/products/momixx-mm.png` | MM series page |
| `2024/06/DSC00413-2.png` (EV cable), `prod-series-01.png`, `prod-series-02.png` | `public/images/products/` | MV, MHD and MPC pages |
| Certificate logos (check each scheme's logo-use rules) | `public/images/certs/` | Certificate cards |
| Certificate PDFs (GRS, ISCC PLUS, SCS, ISO 13485) | `public/certificates/` | "View certificate" buttons |
| Factory, team and culture photos | `public/images/` | About, Culture & careers and Locations pages |

Then set the `photo`, `image`, `logo` or `file` field on the matching entry. See the README.

## 3. Claims for IPO counsel to review

A listing candidate's website is usually treated as public communication during the IPO process. Have your advisers review these before launch. The wording on the site is already cautious ("to our knowledge", "in MoMixx testing"); each item below still needs evidence on file.

- **Market figures** (`content/markets.ts`, `/markets`, the home page and each application page).
  - All are third-party estimates with the publisher, date and link shown, labelled as industry context (not MoMixx's addressable market) with a disclaimer.
  - Checked on 2 Oct 2026. Review against publicity rules before the listing.
- **"To our knowledge, the world's first vertical extrusion line"** and **"20+ patents, granted or pending"**. Keep the patent list (granted vs pending, held by the company) and the novelty evidence on file.
- **"Customers include a Fortune Global 500 company"** and **"qualified by a leading smartphone brand"**. Confirm these don't breach customer NDAs, and whether it is one smartphone brand or several.
- **Temperatures.** 250 °C (MM, MV) and −60 °C (MV) are shown as MoMixx test results. Confirm the method and whether they are continuous or short-term, and whether any formal rating (UL, ISO 6722, LV 216) exists. The 170 °C (TPE) and 136/150 °C (XLPO) comparison figures are MoMixx test results too.
- **Other test claims.** The 10,000 twisting cycles method; UL 94 ratings and thicknesses per grade; UL file numbers and VW-1 reports with the cable constructions tested; MHD data against FKM and the fluorine test behind "PFAS-free"; any ISO 10993, USP or FDA 21 CFR 177.2600 data behind medical and food-contact uses; the PCTG FDA regulation and compliance letter; whether MMS is used in IP68-rated devices.
- **Process figures.** The baselines behind "about 30% less electricity than a standard curing oven", "±5 °C instead of ±10 °C", the ~4% bucket saving, "up to 20× lower VOC emissions" and "fewer rejects than UV-cured coatings". Confirm ΔE94 0.50, F-grade hardness, 150 kg/h (without crosshead), 35 rpm, 70 kPa and 10.0 mm are current.
- **Sustainability claims.**
  - The carbon footprint is described only as "a calculation checked by an independent third party", with the statement available on request.
  - The old site's "better than net-zero" and "carbon neutrality by 2024" wording was deliberately left out. Re-add it only with substantiation.
  - Recycled content is described as covered by certified chain-of-custody records, which is true under both GRS and ISCC PLUS mass balance. Confirm the recycled-content percentages offered, whether both PIR and PCR scrap are recycled, and which factories have solar panels.
- **"To our knowledge, the only silicone company certified under both GRS and ISCC PLUS"** (home page and /sustainability, at Dr Cheah's request). Keep a dated search of the GRS and ISCC certificate databases on file.
- **Medical.** The site says MoMixx has made silicone parts for medical-device makers since 2025 and that the Batu Kawan, Penang factory's quality system was certified to ISO 13485 in 2026. Confirm where 2025 parts were made and the certificate's scope.
- **"Maturity" labels on applications** (In mass production / Certified & scaling / Emerging opportunity). Confirm what supports "Certified & scaling" for EV and semiconductor, and whether MV is in volume production.
- **Founding year.** Per Dr Cheah, the site says MoMixx was founded in 2019 (About page, Locations page, menu, structured data), but the UEN (201310727R) shows the legal entity was registered in 2013. Confirm the prospectus describes the two dates the same way (for example, "incorporated in 2013, began operating as MoMixx in 2019"). The year is set once in `lib/site.ts` → `foundingYear`.
- **Second facility.** Per Dr Cheah, the second manufacturing facility is described only as "a second large factory in Asia", and nothing on the site names its location. Publishing certificate PDFs or verification links may reveal it (the recycling certificate likely names that site). Decide with counsel which entity and site each published certificate shows, and confirm the wording matches what the prospectus will disclose.
- **Regulatory wording.** The EU PFAS restriction is described as something the EU is "working towards". Align the D4/D5/D6 wording in the landfill article with the prospectus risk factors.

## 4. Go-live steps

1. Vercel project created and the preview reviewed.
2. Environment variables set in Vercel: `NEXT_PUBLIC_SITE_URL` (https://www.momixx.com), `REDIRECT_HOSTS`. Never set `ENABLE_RENDER` in production.
3. In the Vercel project, turn on **Web Analytics** and **Speed Insights** (cookie-free; the site already includes them).
4. Domains added in Vercel, with the secondary domains set to redirect.
5. IT changes the DNS. **MX and TXT records stay untouched.**
6. Spot-check old URLs. These should all redirect: `/about-us/`, `/contact-us/`, `/data-cable/`, `/odm-oem/`, `/wearable-product/`, `/our-milestone/2018-2/`, `/feed/`, `/wp-sitemap.xml`.
7. Check the security headers (`curl -I https://www.momixx.com`) and that the browser console shows no Content-Security-Policy errors on the home page, a product page and the contact form.
8. Send a test enquiry through the contact form and confirm it arrives.
9. Verify the site in Google Search Console and Bing, and submit the sitemap.
10. Retire WordPress after about two weeks with no issues.
