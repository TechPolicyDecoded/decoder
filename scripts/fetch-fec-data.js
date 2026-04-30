#!/usr/bin/env node
/**
 * Fetches campaign finance and lobbying data for all policy entries
 * and writes results to data/funding/<slug>.json.
 *
 * Data sources:
 *   - FEC API: https://api.open.fec.gov
 *   - OpenSecrets: https://www.opensecrets.org/api
 *   - Congress.gov API: https://api.congress.gov
 *
 * Run: npm run fetch-data
 * Environment variables required:
 *   FEC_API_KEY        — from https://api.open.fec.gov/developers/
 *   OPENSECRETS_API_KEY — from https://www.opensecrets.org/api/admin/index.php
 */

const fs = require("fs");
const path = require("path");

const FUNDING_DIR = path.join(__dirname, "../data/funding");

async function main() {
  const slugs = fs
    .readdirSync(FUNDING_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));

  console.log(`Found ${slugs.length} policy funding file(s): ${slugs.join(", ")}`);

  for (const slug of slugs) {
    console.log(`\nFetching data for: ${slug}`);
    // TODO: implement FEC and OpenSecrets fetch logic per policy
    // Update data/funding/<slug>.json in place
  }

  console.log("\nDone. Run git diff data/funding/ to review changes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
