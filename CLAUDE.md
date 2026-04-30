# CLAUDE.md — TechPolicyDecoded/decoder

## Project overview

`decoder` is the main application for [TechPolicyDecoded](https://github.com/TechPolicyDecoded), a watchdog/journalistic open-source project that:
1. Explains current proposed U.S. tech policy in plain language
2. Shows who is funding the politicians and lobbying efforts behind each policy

The goal is to connect the dots between legislation and money in a way that is accessible to non-specialists.

## Stack

- **Framework**: Next.js (App Router)
- **Content**: MDX files for policy entries (Markdown + embedded React components)
- **Data**: JSON files for structured funding/lobbying data, sourced from FEC API and OpenSecrets
- **Styling**: TBD (likely Tailwind CSS)
- **Automation**: GitHub Actions for scheduled FEC data fetching
- **Hosting**: TBD (likely Vercel or GitHub Pages)

## Repo structure

```
decoder/
├── content/
│   └── policies/          # MDX files, one per policy/bill
├── data/
│   └── funding/           # JSON funding data keyed by policy slug
├── scripts/
│   └── fetch-fec-data.js  # FEC/OpenSecrets API data fetching
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Shared React components
│   │   ├── FundingBreakdown.jsx
│   │   ├── PolicyCard.jsx
│   │   └── DonorMap.jsx
│   └── lib/               # Utilities, data helpers
└── public/
```

## Content schema

Each policy MDX file has frontmatter with this structure:

```yaml
---
title: "AI Accountability Act"
slug: "ai-accountability-act"
status: "proposed"          # proposed | committee | passed | failed
introduced: "2025-03-12"
sponsors: ["Sen. Jane Smith (D-CA)"]
summary: "One sentence plain-language summary"
tags: ["AI", "regulation", "accountability"]
funding_data: "ai-accountability-act"  # references data/funding/<slug>.json
---
```

## Funding data schema

Each `data/funding/<slug>.json` file follows this structure:

```json
{
  "policy_slug": "ai-accountability-act",
  "last_updated": "2026-04-01",
  "top_donors_to_sponsors": [],
  "lobbying_spend": [],
  "sources": []
}
```

## Key conventions

- Policy explainers are written for a general audience — no jargon without explanation
- Every claim about funding must cite a source (FEC, OpenSecrets, or primary source)
- Tone is neutral and factual — this is not an advocacy project
- All funding data is auto-updated via GitHub Actions where possible
- MDX components embedded in policy pages should degrade gracefully if JS is disabled

## Commands

```bash
npm run dev          # Start local dev server
npm run build        # Production build
npm run fetch-data   # Manually trigger FEC data fetch scripts
```

## Contributing

See CONTRIBUTING.md for editorial standards and how to add a new policy entry.
