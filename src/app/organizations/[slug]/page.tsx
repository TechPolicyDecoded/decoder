import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllOrgSlugs, getOrg, getRelatedOrgs } from "@/lib/organizations";
import { getRelatedFunders } from "@/lib/funders";
import { getRelatedPolicies } from "@/lib/policies";
import type { Metadata } from "next";

const TYPE_LABELS: Record<string, string> = {
  "super-pac": "Super PAC",
  "dark-money-nonprofit": "Dark Money Nonprofit",
  "think-tank": "Think Tank",
  "trade-group": "Trade Group",
  "lobbying-firm": "Lobbying Firm",
};

export async function generateStaticParams() {
  return getAllOrgSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const org = getOrg(slug);
  if (!org) return {};
  return {
    title: `${org.frontmatter.title} — TechPolicyDecoded`,
  };
}

export default async function OrgPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = getOrg(slug);
  if (!org) notFound();

  const { frontmatter, content } = org;
  const relatedFunders = getRelatedFunders(frontmatter.related_funders);
  const relatedPolicies = getRelatedPolicies(frontmatter.related_policies);
  const relatedOrgs = frontmatter.parent_org
    ? getRelatedOrgs([frontmatter.parent_org])
    : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/organizations" className="text-sm text-blue-600 hover:underline">
        &larr; All organizations
      </Link>

      <article className="mt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{frontmatter.title}</h1>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            <div>
              <dt className="inline font-medium text-gray-700">Type: </dt>
              <dd className="inline">{TYPE_LABELS[frontmatter.type] ?? frontmatter.type}</dd>
            </div>
            {frontmatter.founded && (
              <div>
                <dt className="inline font-medium text-gray-700">Founded: </dt>
                <dd className="inline">{frontmatter.founded}</dd>
              </div>
            )}
            {frontmatter.total_funding && (
              <div>
                <dt className="inline font-medium text-gray-700">Total funding: </dt>
                <dd className="inline">{frontmatter.total_funding}</dd>
              </div>
            )}
            <div>
              <dt className="inline font-medium text-gray-700">Confidence: </dt>
              <dd className="inline capitalize">{frontmatter.funding_confidence}</dd>
            </div>
          </dl>

          {relatedOrgs.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Parent organization</p>
              <div className="flex flex-wrap gap-2">
                {relatedOrgs.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/organizations/${o.slug}`}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    {o.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedFunders.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Known funders</p>
              <div className="flex flex-wrap gap-2">
                {relatedFunders.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/funders/${f.slug}`}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    {f.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedPolicies.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Related policies</p>
              <div className="flex flex-wrap gap-2">
                {relatedPolicies.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/policies/${p.slug}`}
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-100"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="prose prose-gray max-w-none">
          <MDXRemote source={content} />
        </div>

        {frontmatter.sources.length > 0 && (
          <footer className="mt-10 border-t border-gray-200 pt-6 text-xs text-gray-400">
            Sources:{" "}
            {frontmatter.sources.map((src, i) => (
              <span key={src}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  aria-label={`Source ${i + 1}: ${new URL(src).hostname}`}
                >
                  [{i + 1}]
                </a>{" "}
              </span>
            ))}
          </footer>
        )}
      </article>
    </main>
  );
}
