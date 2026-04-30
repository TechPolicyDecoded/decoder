# TechPolicyDecoded

U.S. tech policy in plain language — explained, sourced, and connected to the money behind it.

**Site:** [techpolicydecoded.org](https://techpolicydecoded.org)

## About

TechPolicyDecoded is an open-source watchdog project that makes U.S. federal tech policy legible to everyone. For every major proposal, we explain what the bill actually says and show who is financially backing the politicians and lobbying efforts behind it — using public data from the FEC, OpenSecrets, and Congress.gov.

See [docs/project-brief.md](docs/project-brief.md) for full background and editorial standards.

## Development

```bash
npm install
npm run dev         # Start local dev server at http://localhost:3000
npm run build       # Production build
npm test            # Run the test suite
npm run test:watch  # Run tests in watch mode
npm run fetch-data  # Manually trigger FEC/OpenSecrets data fetch
```

## Contributing

Policy entries live in `content/policies/` as MDX files. Funding data lives in `data/funding/` as JSON. See [CLAUDE.md](CLAUDE.md) for the content schema and conventions.

## License

This project uses a dual license:

| What | License | File |
|---|---|---|
| Source code (`src/`, `scripts/`, config files) | [MIT](LICENSE-CODE) | `LICENSE-CODE` |
| Original project content (`content/`, `docs/`, and original data in `data/`) | [CC BY 4.0](LICENSE-CONTENT) | `LICENSE-CONTENT` |

**Note on third-party data:** Funding data in `data/funding/` is derived from sources such as the FEC (public domain) and OpenSecrets (non-commercial CC license). That data is not relicensed under CC BY 4.0 and remains subject to the terms of its original source. Check the `sources` field in each JSON file for attribution.

When reusing or adapting original TechPolicyDecoded content, attribution is required under CC BY 4.0.
