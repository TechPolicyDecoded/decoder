import { getAllPolicies } from "@/lib/policies";
import PolicyCard from "@/components/PolicyCard";

export default function HomePage() {
  const policies = getAllPolicies();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">TechPolicyDecoded</h1>
        <p className="mt-2 text-gray-600">
          U.S. tech policy in plain language — explained, sourced, and connected
          to the money behind it.
        </p>
      </header>

      {policies.length === 0 ? (
        <p className="text-gray-500">No policy entries yet.</p>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => (
            <PolicyCard
              key={policy.frontmatter.slug}
              frontmatter={policy.frontmatter}
            />
          ))}
        </div>
      )}
    </main>
  );
}
