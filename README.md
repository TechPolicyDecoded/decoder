# TechPolicyDecoded

U.S. tech policy in plain language — explained, sourced, and connected to the money behind it.

**Site:** [techpolicydecoded.org](https://techpolicydecoded.org)

## About

TechPolicyDecoded is an open-source watchdog project that makes U.S. federal tech policy legible to everyone. For every major proposal, we explain what the bill actually says and show who is financially backing the politicians and lobbying efforts behind it — using public data from the FEC, OpenSecrets, and Congress.gov.

See [docs/project-brief.md](docs/project-brief.md) for full background and editorial standards.

## Development

```bash
npm install
npm run dev       # Start local dev server at http://localhost:3000
npm run build     # Production build
npm run fetch-data  # Manually trigger FEC/OpenSecrets data fetch
```

## Contributing

Policy entries live in `content/policies/` as MDX files. Funding data lives in `data/funding/` as JSON. See [CLAUDE.md](CLAUDE.md) for the content schema and conventions.

## License

This project uses a dual license:

| What | License | File |
|---|---|---|
| Source code (`src/`, `scripts/`, config files) | [MIT](LICENSE-CODE) | `LICENSE-CODE` |
| Content (`content/`, `data/`, `docs/`) | [CC BY 4.0](LICENSE-CONTENT) | `LICENSE-CONTENT` |

When reusing or adapting content, attribution to TechPolicyDecoded is required under CC BY 4.0.
