import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isSafeSlug, isSafeUrl, safeResolve } from "./utils";

const FUNDERS_DIR = path.join(process.cwd(), "content/funders");

const VALID_FUNDER_TYPES = ["individual", "company", "vc-firm"] as const;

export type FunderType = (typeof VALID_FUNDER_TYPES)[number];

export interface Contribution {
  recipient: string;
  amount: number;
  date: string;
  source_url: string;
}

export interface FunderFrontmatter {
  title: string;
  slug: string;
  type: FunderType;
  affiliation: string;
  related_orgs: string[];
  related_policies: string[];
  confirmed_contributions: Contribution[];
  sources: string[];
}

export interface Funder {
  frontmatter: FunderFrontmatter;
  content: string;
}

function validateContribution(raw: unknown): Contribution | null {
  if (typeof raw !== "object" || raw === null) return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.recipient !== "string" || !d.recipient) return null;
  if (!Number.isFinite(d.amount) || (d.amount as number) < 0) return null;
  if (typeof d.date !== "string") return null;
  if (typeof d.source_url !== "string" || !isSafeUrl(d.source_url)) return null;
  return {
    recipient: d.recipient,
    amount: d.amount as number,
    date: d.date,
    source_url: d.source_url,
  };
}

function validateFunderFrontmatter(
  data: Record<string, unknown>
): FunderFrontmatter | null {
  const {
    title,
    slug,
    type,
    affiliation,
    related_orgs,
    related_policies,
    confirmed_contributions,
    sources,
  } = data;

  if (typeof title !== "string" || !title) return null;
  if (typeof slug !== "string" || !isSafeSlug(slug)) return null;
  if (!VALID_FUNDER_TYPES.includes(type as FunderType)) return null;

  return {
    title,
    slug,
    type: type as FunderType,
    affiliation: typeof affiliation === "string" ? affiliation : "",
    related_orgs: Array.isArray(related_orgs)
      ? related_orgs.filter(
          (s): s is string => typeof s === "string" && isSafeSlug(s)
        )
      : [],
    related_policies: Array.isArray(related_policies)
      ? related_policies.filter(
          (s): s is string => typeof s === "string" && isSafeSlug(s)
        )
      : [],
    confirmed_contributions: Array.isArray(confirmed_contributions)
      ? confirmed_contributions
          .map(validateContribution)
          .filter((c): c is Contribution => c !== null)
      : [],
    sources: Array.isArray(sources)
      ? sources.filter(
          (s): s is string => typeof s === "string" && isSafeUrl(s)
        )
      : [],
  };
}

export function getAllFunderSlugs(): string[] {
  if (!fs.existsSync(FUNDERS_DIR)) return [];
  return fs
    .readdirSync(FUNDERS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter(isSafeSlug);
}

export function getFunder(slug: string): Funder | null {
  if (!isSafeSlug(slug)) return null;
  const filePath = safeResolve(FUNDERS_DIR, `${slug}.mdx`);
  if (!filePath || !fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter = validateFunderFrontmatter(
    data as Record<string, unknown>
  );
  if (!frontmatter || frontmatter.slug !== slug) return null;

  return { frontmatter, content };
}

export function getAllFunders(): Funder[] {
  return getAllFunderSlugs()
    .map((slug) => getFunder(slug))
    .filter((f): f is Funder => f !== null)
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
}

export function getRelatedFunders(slugs: string[]): { slug: string; title: string }[] {
  return slugs
    .map((slug) => getFunder(slug))
    .filter((f): f is Funder => f !== null)
    .map((f) => ({ slug: f.frontmatter.slug, title: f.frontmatter.title }));
}
