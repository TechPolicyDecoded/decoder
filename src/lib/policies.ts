import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POLICIES_DIR = path.join(process.cwd(), "content/policies");
const FUNDING_DIR = path.join(process.cwd(), "data/funding");

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
  const filePath = path.join(POLICIES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

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
  const filePath = path.join(FUNDING_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as FundingData;
}
