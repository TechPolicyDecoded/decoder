import { getAllFunders } from "@/lib/funders";
import FunderCard from "@/components/FunderCard";

export default function FundersPage() {
  const funders = getAllFunders();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Funders</h1>
        <p className="mt-2 text-gray-600">
          Individuals, companies, and VC firms backing organizations active in
          U.S. tech policy.
        </p>
      </header>

      {funders.length === 0 ? (
        <p className="text-gray-500">No funder entries yet.</p>
      ) : (
        <div className="space-y-4">
          {funders.map((funder) => (
            <FunderCard
              key={funder.frontmatter.slug}
              frontmatter={funder.frontmatter}
            />
          ))}
        </div>
      )}
    </main>
  );
}
