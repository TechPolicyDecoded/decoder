import Link from "next/link";
import type { OrgFrontmatter, FundingConfidence } from "@/lib/organizations";

const TYPE_LABELS: Record<string, string> = {
  "super-pac": "Super PAC",
  "dark-money-nonprofit": "Dark Money Nonprofit",
  "think-tank": "Think Tank",
  "trade-group": "Trade Group",
  "lobbying-firm": "Lobbying Firm",
};

const CONFIDENCE_COLORS: Record<FundingConfidence, string> = {
  confirmed: "bg-green-100 text-green-800",
  reported: "bg-yellow-100 text-yellow-800",
  alleged: "bg-red-100 text-red-800",
};

export default function OrgCard({ frontmatter }: { frontmatter: OrgFrontmatter }) {
  return (
    <Link
      href={`/organizations/${frontmatter.slug}`}
      className="block rounded-lg border border-gray-200 p-5 hover:border-gray-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {frontmatter.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CONFIDENCE_COLORS[frontmatter.funding_confidence]}`}
        >
          {frontmatter.funding_confidence}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {TYPE_LABELS[frontmatter.type] ?? frontmatter.type}
        {frontmatter.total_funding && ` · ${frontmatter.total_funding}`}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        {frontmatter.related_policies.length > 0 && (
          <span>{frontmatter.related_policies.length} polic{frontmatter.related_policies.length === 1 ? "y" : "ies"}</span>
        )}
        {frontmatter.related_funders.length > 0 && (
          <span>{frontmatter.related_funders.length} funder{frontmatter.related_funders.length !== 1 ? "s" : ""}</span>
        )}
      </div>
    </Link>
  );
}
