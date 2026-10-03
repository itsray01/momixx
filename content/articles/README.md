# Insights articles

Each `.md` file in this folder becomes an article at `/insights/<file-name>`. It is also added automatically to the Insights hub, its topic page, the sitemap, the RSS feed (`/insights/feed.xml`) and `/llms.txt`.

To publish a new article, copy an existing file, rename it (lowercase, hyphens, for example `silicone-in-wearables.md`), and edit it.

## Frontmatter

```yaml
---
title: Silicone in wearables: why straps feel the way they do   # the on-page heading (H1): the question or phrase people search for
seoTitle: "Silicone watch straps: why they feel the way they do"   # the browser/search title: 55 characters or fewer, main keyword first
description: One or two sentences, under 160 characters, shown in Google and on cards.
date: 2026-10-02          # first published
updated: 2026-10-02       # change this whenever you revise the article; Google notices fresh dates
topic: applications       # one of: silicone-basics, recycling, sustainability, applications, technology, regulation
model: watchband          # the 3D image to show (any name in components/three/modelNames.ts)
tags: [wearables, PFAS-free, high-density silicone]
takeaways:                # 2–4 short bullet answers; AI search engines quote these
  - …
faqs:                     # real questions people ask; marked up for Google
  - q: …
    a: …
sources:                  # every fact or figure needs a credible source
  - title: …
    url: https://…
author:                   # optional: a named expert byline builds trust with Google and AI engines
  name: …
  role: Head of Materials R&D
---
```

## Writing rules (SEO, GEO and AEO)

- **Answer the question in the first paragraph.** AI answer engines and featured snippets quote the opening answer.
- **Use a question or clear statement for each `##` heading**, for example "How is silicone recycled?". These headings also form the contents list.
- **Plain English.** Explain technical terms the first time you use them.
- **Cite every number** in `sources`. No figure without a source; never use competitors' unverified claims.
- **Link to at least one product or application page** on momixx.com, and to one other article.
- **Keep it current.** When anything changes (a regulation, a market figure, a certification), update the text and the `updated:` date.
- **Avoid forward-looking statements about MoMixx's own business** (revenue, market share, IPO). Have them reviewed first.
- **Label MoMixx test results as test results.** Write "in MoMixx testing" next to any temperature, twist count or other figure from our own tests, and never present it as a rating. Typical silicone cable is rated to about 180–200 °C.
- **Recycled-content claims:** describe certified chain-of-custody records, not "every batch can be traced". ISCC PLUS allows mass balance.
- **Use "flame-retardant", not "fire-safe" or "fireproof",** and say "designed for cables that pass VW-1" (VW-1 tests the finished cable).
- **Hedge firsts and onlys:** "to our knowledge". No new superlatives without documented evidence.
