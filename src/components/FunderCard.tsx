import Link from "next/link";
import type { FunderFrontmatter } from "@/lib/funders";

const TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  company: "Company",
  "vc-firm": "VC Firm",
};

export default function FunderCard({
  frontmatter,
}: {
  frontmatter: FunderFrontmatter;
}) {
  return (
    <Link
      href={`/funders/${frontmatter.slug}`}
      className="block rounded-lg border border-gray-200 p-5 hover:border-gray-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {frontmatter.title}
        </h2>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {TYPE_LABELS[frontmatter.type] ?? frontmatter.type}
        </span>
      </div>
      {frontmatter.affiliation && (
        <p className="mt-1 text-sm text-gray-500">{frontmatter.affiliation}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        {frontmatter.related_orgs.length > 0 && (
          <span>{frontmatter.related_orgs.length} org{frontmatter.related_orgs.length !== 1 ? "s" : ""}</span>
        )}
        {frontmatter.related_policies.length > 0 && (
          <span>{frontmatter.related_policies.length} polic{frontmatter.related_policies.length === 1 ? "y" : "ies"}</span>
        )}
        {frontmatter.confirmed_contributions.length > 0 && (
          <span>{frontmatter.confirmed_contributions.length} confirmed contribution{frontmatter.confirmed_contributions.length !== 1 ? "s" : ""}</span>
        )}
      </div>
    </Link>
  );
}
