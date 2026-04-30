# TechPolicyDecoded — Project Brief

## Origin and mission

TechPolicyDecoded was started in 2026 as an open-source watchdog project to make U.S. tech policy legible to everyone. Two problems motivated it:

1. **Tech policy is hard to follow.** Bills are written in dense legal language, covered inconsistently by media, and rarely explained in terms of what they actually mean for real people and companies.
2. **The money is hidden in plain sight.** Campaign finance and lobbying data is technically public (via FEC and OpenSecrets) but scattered, hard to read, and almost never connected directly to specific legislation.

The project connects these two things: for every major tech policy proposal, we explain what it says *and* show who is financially backing the politicians and lobbying efforts behind it.

## What we are (and aren't)

**We are:**
- A neutral, factual resource
- Journalistic in approach — claims are sourced, funding data is cited
- Open source — anyone can contribute, fork, or build on our data
- Focused specifically on U.S. federal tech policy (AI regulation, data privacy, antitrust, surveillance, platform liability, etc.)

**We are not:**
- An advocacy or activist project
- Affiliated with any political party, PAC, or lobbying group
- A general political news site

## Content scope

Policy areas we cover:
- **AI regulation** — algorithmic accountability, AI liability, model transparency
- **Data privacy** — federal privacy legislation, state preemption debates
- **Antitrust** — Big Tech platform regulation, app store legislation
- **Surveillance** — law enforcement data access, facial recognition bans
- **Platform liability** — Section 230 reform proposals
- **Cybersecurity** — federal breach notification, critical infrastructure

## Data sources

- **[FEC API](https://api.open.fec.gov)** — campaign finance contributions (federal, public domain)
- **[OpenSecrets](https://www.opensecrets.org)** — lobbying spend, PAC data (CC-licensed for non-commercial use)
- **[Congress.gov API](https://api.congress.gov)** — bill text, status, sponsor information
- **[followthemoney.org](https://www.followthemoney.org)** — state-level campaign finance

## Editorial standards

- Every policy explainer must include: a plain-language summary, key provisions, likely effects (pros and cons as understood by supporters and critics), and a funding/lobbying section
- Funding claims must link directly to FEC filings or OpenSecrets pages
- Explainers should be updated when a bill's status changes materially
- Contested interpretations of a bill's effects should present multiple perspectives, not a single editorial view

## GitHub org

**[github.com/TechPolicyDecoded](https://github.com/TechPolicyDecoded)**

- `decoder` — this repo, the main application and content store
- Domains: `techpolicydecoded.com`, `techpolicydecoded.org` (both owned, `.org` is primary)

## Roadmap (rough)

- [ ] v0.1 — Repo scaffold, first 3 policy entries (hand-curated), basic Next.js site
- [ ] v0.2 — FEC data fetch automation via GitHub Actions
- [ ] v0.3 — Search and filtering across policies
- [ ] v0.4 — Donor/company profile pages (e.g. "all policies Google has lobbied on")
- [ ] v1.0 — Public launch, contributor documentation complete
