import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllFunderSlugs, getFunder } from "@/lib/funders";
import type { Metadata } from "next";

const TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  company: "Company",
  "vc-firm": "VC Firm",
};

function formatDollars(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export async function generateStaticParams() {
  return getAllFunderSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const funder = getFunder(slug);
  if (!funder) return {};
  return {
    title: `${funder.frontmatter.title} — TechPolicyDecoded`,
  };
}

export default async function FunderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const funder = getFunder(slug);
  if (!funder) notFound();

  const { frontmatter, content } = funder;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/funders" className="text-sm text-blue-600 hover:underline">
        &larr; All funders
      </Link>

      <article className="mt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{frontmatter.title}</h1>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            <div>
              <dt className="inline font-medium text-gray-700">Type: </dt>
              <dd className="inline">{TYPE_LABELS[frontmatter.type] ?? frontmatter.type}</dd>
            </div>
            {frontmatter.affiliation && (
              <div>
                <dt className="inline font-medium text-gray-700">Affiliation: </dt>
                <dd className="inline">{frontmatter.affiliation}</dd>
              </div>
            )}
          </dl>

          {frontmatter.related_orgs.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Organizations backed</p>
              <div className="flex flex-wrap gap-2">
                {frontmatter.related_orgs.map((orgSlug) => (
                  <Link
                    key={orgSlug}
                    href={`/organizations/${orgSlug}`}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    {orgSlug}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {frontmatter.related_policies.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Related policies</p>
              <div className="flex flex-wrap gap-2">
                {frontmatter.related_policies.map((policySlug) => (
                  <Link
                    key={policySlug}
                    href={`/policies/${policySlug}`}
                    className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-100"
                  >
                    {policySlug}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {frontmatter.confirmed_contributions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Confirmed contributions
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 font-medium">Recipient</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {frontmatter.confirmed_contributions.map((c, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2">
                        <a
                          href={c.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {c.recipient}
                        </a>
                      </td>
                      <td className="py-2 text-gray-500">{c.date}</td>
                      <td className="py-2 text-right font-mono">
                        {formatDollars(c.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
