import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isSafeSlug, isSafeUrl, safeResolve } from "./utils";

const ORGS_DIR = path.join(process.cwd(), "content/organizations");

const VALID_ORG_TYPES = [
  "super-pac",
  "dark-money-nonprofit",
  "think-tank",
  "trade-group",
  "lobbying-firm",
] as const;

const VALID_CONFIDENCE = ["confirmed", "reported", "alleged"] as const;

export type OrgType = (typeof VALID_ORG_TYPES)[number];
export type FundingConfidence = (typeof VALID_CONFIDENCE)[number];

export interface OrgFrontmatter {
  title: string;
  slug: string;
  type: OrgType;
  founded: string;
  total_funding: string;
  parent_org: string | null;
  related_policies: string[];
  related_funders: string[];
  funding_confidence: FundingConfidence;
  sources: string[];
}

export interface Organization {
  frontmatter: OrgFrontmatter;
  content: string;
}

function validateOrgFrontmatter(
  data: Record<string, unknown>
): OrgFrontmatter | null {
  const {
    title,
    slug,
    type,
    founded,
    total_funding,
    parent_org,
    related_policies,
    related_funders,
    funding_confidence,
    sources,
  } = data;

  if (typeof title !== "string" || !title) return null;
  if (typeof slug !== "string" || !isSafeSlug(slug)) return null;
  if (!VALID_ORG_TYPES.includes(type as OrgType)) return null;
  if (!VALID_CONFIDENCE.includes(funding_confidence as FundingConfidence))
    return null;

  return {
    title,
    slug,
    type: type as OrgType,
    founded: typeof founded === "string" ? founded : "",
    total_funding: typeof total_funding === "string" ? total_funding : "",
    parent_org:
      typeof parent_org === "string" && isSafeSlug(parent_org)
        ? parent_org
        : null,
    related_policies: Array.isArray(related_policies)
      ? related_policies.filter(
          (s): s is string => typeof s === "string" && isSafeSlug(s)
        )
      : [],
    related_funders: Array.isArray(related_funders)
      ? related_funders.filter(
          (s): s is string => typeof s === "string" && isSafeSlug(s)
        )
      : [],
    funding_confidence: funding_confidence as FundingConfidence,
    sources: Array.isArray(sources)
      ? sources.filter(
          (s): s is string => typeof s === "string" && isSafeUrl(s)
        )
      : [],
  };
}

export function getAllOrgSlugs(): string[] {
  if (!fs.existsSync(ORGS_DIR)) return [];
  return fs
    .readdirSync(ORGS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter(isSafeSlug);
}

export function getOrg(slug: string): Organization | null {
  if (!isSafeSlug(slug)) return null;
  const filePath = safeResolve(ORGS_DIR, `${slug}.mdx`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter = validateOrgFrontmatter(data as Record<string, unknown>);
  if (!frontmatter || frontmatter.slug !== slug) return null;

  return { frontmatter, content };
}

export function getAllOrgs(): Organization[] {
  return getAllOrgSlugs()
    .map((slug) => getOrg(slug))
    .filter((o): o is Organization => o !== null)
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
}

export function getRelatedOrgs(slugs: string[]): { slug: string; title: string }[] {
  return slugs
    .map((slug) => getOrg(slug))
    .filter((o): o is Organization => o !== null)
    .map((o) => ({ slug: o.frontmatter.slug, title: o.frontmatter.title }));
}
