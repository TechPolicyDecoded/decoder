import { getAllOrgs } from "@/lib/organizations";
import OrgCard from "@/components/OrgCard";

export default function OrganizationsPage() {
  const orgs = getAllOrgs();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
        <p className="mt-2 text-gray-600">
          PACs, dark money nonprofits, think tanks, and lobbying firms active in
          U.S. tech policy.
        </p>
      </header>

      {orgs.length === 0 ? (
        <p className="text-gray-500">No organization entries yet.</p>
      ) : (
        <div className="space-y-4">
          {orgs.map((org) => (
            <OrgCard key={org.frontmatter.slug} frontmatter={org.frontmatter} />
          ))}
        </div>
      )}
    </main>
  );
}
