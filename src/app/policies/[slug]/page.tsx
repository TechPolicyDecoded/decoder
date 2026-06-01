import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllPolicySlugs,
  getPolicy,
  getFundingData,
  getRelatedPolicies,
} from "@/lib/policies";
import { getRelatedOrgs } from "@/lib/organizations";
import { getRelatedFunders } from "@/lib/funders";
import FundingBreakdown from "@/components/FundingBreakdown";
import DonorMap from "@/components/DonorMap";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPolicySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return {};
  return {
    title: `${policy.frontmatter.title} — TechPolicyDecoded`,
    description: policy.frontmatter.summary,
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const funding = getFundingData(policy.frontmatter.funding_data);
  const relatedOrgs = getRelatedOrgs(policy.frontmatter.related_orgs);
  const relatedFunders = getRelatedFunders(policy.frontmatter.related_funders);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        &larr; All policies
      </Link>

      <article className="mt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {policy.frontmatter.title}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            {policy.frontmatter.summary}
          </p>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            <div>
              <dt className="inline font-medium text-gray-700">Status: </dt>
              <dd className="inline capitalize">{policy.frontmatter.status}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-gray-700">Introduced: </dt>
              <dd className="inline">{policy.frontmatter.introduced}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-gray-700">Sponsors: </dt>
              <dd className="inline">
                {policy.frontmatter.sponsors.join(", ")}
              </dd>
            </div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {policy.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-gray max-w-none">
          <MDXRemote source={policy.content} />
        </div>

        {(relatedOrgs.length > 0 || relatedFunders.length > 0) && (
          <section className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Who&apos;s behind this
            </h2>
            {relatedOrgs.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Organizations</p>
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
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Key funders</p>
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
          </section>
        )}

        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Funding &amp; Lobbying
          </h2>
          {funding ? (
            <>
              <DonorMap />
              <div className="mt-6">
                <FundingBreakdown data={funding} />
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No funding data available yet.
            </p>
          )}
        </section>
      </article>
    </main>
  );
}
