import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POLICIES_DIR = path.join(process.cwd(), "content/policies");
const FUNDING_DIR = path.join(process.cwd(), "data/funding");

const SAFE_SLUG = /^[a-z0-9-]+$/;
const VALID_STATUSES = ["proposed", "committee", "passed", "failed"] as const;
const VALID_POSITIONS = ["support", "oppose", "unknown"] as const;

function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

function safeResolve(dir: string, filename: string): string | null {
  const resolved = path.resolve(dir, filename);
  return resolved.startsWith(dir + path.sep) ? resolved : null;
}

export type PolicyStatus = (typeof VALID_STATUSES)[number];

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

function validateFrontmatter(
  data: Record<string, unknown>
): PolicyFrontmatter | null {
  const { title, slug, status, introduced, sponsors, summary, tags, funding_data } =
    data;

  if (typeof title !== "string" || !title) return null;
  if (typeof slug !== "string" || !isSafeSlug(slug)) return null;
  if (typeof introduced !== "string" || !introduced) return null;
  if (typeof summary !== "string" || !summary) return null;
  if (typeof funding_data !== "string" || !isSafeSlug(funding_data)) return null;
  if (!VALID_STATUSES.includes(status as PolicyStatus)) return null;

  return {
    title,
    slug,
    status: status as PolicyStatus,
    introduced,
    summary,
    funding_data,
    sponsors: Array.isArray(sponsors)
      ? sponsors.filter((s): s is string => typeof s === "string")
      : [],
    tags: Array.isArray(tags)
      ? tags.filter((t): t is string => typeof t === "string")
      : [],
  };
}

function validateDonor(raw: unknown): Donor | null {
  if (typeof raw !== "object" || raw === null) return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.name !== "string" || !d.name) return null;
  if (typeof d.amount !== "number") return null;
  if (typeof d.source_url !== "string") return null;
  return { name: d.name, amount: d.amount, source_url: d.source_url };
}

function validateLobbyingEntry(raw: unknown): LobbyingEntry | null {
  if (typeof raw !== "object" || raw === null) return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.organization !== "string" || !d.organization) return null;
  if (typeof d.amount !== "number") return null;
  if (!VALID_POSITIONS.includes(d.position as LobbyingEntry["position"])) return null;
  if (typeof d.source_url !== "string") return null;
  return {
    organization: d.organization,
    amount: d.amount,
    position: d.position as LobbyingEntry["position"],
    source_url: d.source_url,
  };
}

function validateFundingData(raw: unknown): FundingData | null {
  if (typeof raw !== "object" || raw === null) return null;
  const d = raw as Record<string, unknown>;
  return {
    policy_slug: typeof d.policy_slug === "string" ? d.policy_slug : "",
    last_updated: typeof d.last_updated === "string" ? d.last_updated : "",
    top_donors_to_sponsors: Array.isArray(d.top_donors_to_sponsors)
      ? d.top_donors_to_sponsors.map(validateDonor).filter((x): x is Donor => x !== null)
      : [],
    lobbying_spend: Array.isArray(d.lobbying_spend)
      ? d.lobbying_spend.map(validateLobbyingEntry).filter((x): x is LobbyingEntry => x !== null)
      : [],
    sources: Array.isArray(d.sources)
      ? d.sources.filter((s): s is string => typeof s === "string")
      : [],
  };
}

export function getAllPolicySlugs(): string[] {
  if (!fs.existsSync(POLICIES_DIR)) return [];
  return fs
    .readdirSync(POLICIES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter(isSafeSlug);
}

export function getPolicy(slug: string): Policy | null {
  if (!isSafeSlug(slug)) return null;
  const filePath = safeResolve(POLICIES_DIR, `${slug}.mdx`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter = validateFrontmatter(data as Record<string, unknown>);
  if (!frontmatter || frontmatter.slug !== slug) return null;

  return { frontmatter, content };
}

export function getAllPolicies(): Policy[] {
  return getAllPolicySlugs()
    .map((slug) => getPolicy(slug))
    .filter((p): p is Policy => p !== null)
    .sort((a, b) => {
      const ta = new Date(a.frontmatter.introduced).getTime();
      const tb = new Date(b.frontmatter.introduced).getTime();
      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    });
}

export function getFundingData(slug: string): FundingData | null {
  if (!isSafeSlug(slug)) return null;
  const filePath = safeResolve(FUNDING_DIR, `${slug}.json`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  try {
    return validateFundingData(JSON.parse(fs.readFileSync(filePath, "utf-8")));
  } catch {
    return null;
  }
}
