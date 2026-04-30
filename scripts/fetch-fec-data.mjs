#!/usr/bin/env node
/**
 * Fetches campaign finance and lobbying data for all policy entries
 * and writes results to data/funding/<slug>.json.
 *
 * Slugs are derived from content/policies/*.mdx so every policy entry
 * is covered, even if no funding file exists yet (one will be created).
 *
 * Data sources:
 *   - FEC API: https://api.open.fec.gov
 *   - OpenSecrets: https://www.opensecrets.org/api
 *   - Congress.gov API: https://api.congress.gov
 *
 * Run: npm run fetch-data
 * Environment variables required:
 *   FEC_API_KEY         — from https://api.open.fec.gov/developers/
 *   OPENSECRETS_API_KEY — from https://www.opensecrets.org/api/admin/index.php
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const POLICIES_DIR = path.join(__dirname, "../content/policies");
const FUNDING_DIR = path.join(__dirname, "../data/funding");

const emptyFunding = (slug) => ({
  policy_slug: slug,
  last_updated: new Date().toISOString().slice(0, 10),
  top_donors_to_sponsors: [],
  lobbying_spend: [],
  sources: [],
});

async function main() {
  fs.mkdirSync(FUNDING_DIR, { recursive: true });

  if (!fs.existsSync(POLICIES_DIR)) {
    console.log("No content/policies/ directory found — nothing to fetch.");
    return;
  }

  const slugs = fs
    .readdirSync(POLICIES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));

  if (slugs.length === 0) {
    console.log("No policy entries found.");
    return;
  }

  console.log(`Found ${slugs.length} policy entry(s): ${slugs.join(", ")}`);

  for (const slug of slugs) {
    const outPath = path.join(FUNDING_DIR, `${slug}.json`);
    console.log(`\nProcessing: ${slug}`);

    if (!fs.existsSync(outPath)) {
      fs.writeFileSync(outPath, JSON.stringify(emptyFunding(slug), null, 2));
      console.log(`  Created stub: ${outPath}`);
    }

    // TODO: implement FEC and OpenSecrets fetch logic per policy
    // and update the JSON file in place
  }

  console.log("\nDone. Run git diff data/funding/ to review changes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
