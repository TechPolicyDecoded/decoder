import Link from "next/link";
import type { PolicyFrontmatter, PolicyStatus } from "@/lib/policies";

const STATUS_LABELS: Record<PolicyStatus, string> = {
  proposed: "Proposed",
  committee: "In Committee",
  passed: "Passed",
  failed: "Failed",
};

const STATUS_COLORS: Record<PolicyStatus, string> = {
  proposed: "bg-blue-100 text-blue-800",
  committee: "bg-yellow-100 text-yellow-800",
  passed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function PolicyCard({
  frontmatter,
}: {
  frontmatter: PolicyFrontmatter;
}) {
  return (
    <Link
      href={`/policies/${frontmatter.slug}`}
      className="block rounded-lg border border-gray-200 p-5 hover:border-gray-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {frontmatter.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[frontmatter.status]}`}
        >
          {STATUS_LABELS[frontmatter.status]}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{frontmatter.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {frontmatter.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Introduced {frontmatter.introduced} &middot;{" "}
        {frontmatter.sponsors.join(", ")}
      </p>
    </Link>
  );
}
