import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POLICIES_DIR = path.join(process.cwd(), "content/policies");
const FUNDING_DIR = path.join(process.cwd(), "data/funding");

const SAFE_SLUG = /^[a-z0-9-]+$/;

function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

function safeResolve(dir: string, filename: string): string | null {
  const resolved = path.resolve(dir, filename);
  return resolved.startsWith(dir + path.sep) ? resolved : null;
}

export type PolicyStatus = "proposed" | "committee" | "passed" | "failed";

export interface PolicyFrontmatter {
  title: string;
  slug: string;
  status: PolicyStatus;
  introduced: string;
  sponsors: string[];
  summary: string;
  tags: string[];
  funding_data: string;
}

export interface Policy {
  frontmatter: PolicyFrontmatter;
  content: string;
}

export interface Donor {
  name: string;
  amount: number;
  source_url: string;
}

export interface LobbyingEntry {
  organization: string;
  amount: number;
  position: "support" | "oppose" | "unknown";
  source_url: string;
}

export interface FundingData {
  policy_slug: string;
  last_updated: string;
  top_donors_to_sponsors: Donor[];
  lobbying_spend: LobbyingEntry[];
  sources: string[];
}

export function getAllPolicySlugs(): string[] {
  if (!fs.existsSync(POLICIES_DIR)) return [];
  return fs
    .readdirSync(POLICIES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPolicy(slug: string): Policy | null {
  if (!isSafeSlug(slug)) return null;
  const filePath = safeResolve(POLICIES_DIR, `${slug}.mdx`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as PolicyFrontmatter,
    content,
  };
}

export function getAllPolicies(): Policy[] {
  return getAllPolicySlugs()
    .map((slug) => getPolicy(slug))
    .filter((p): p is Policy => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.introduced).getTime() -
        new Date(a.frontmatter.introduced).getTime()
    );
}

export function getFundingData(slug: string): FundingData | null {
  if (!isSafeSlug(slug)) return null;
  const filePath = safeResolve(FUNDING_DIR, `${slug}.json`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as FundingData;
  } catch {
    return null;
  }
}
