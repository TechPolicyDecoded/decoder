import type { FundingData } from "@/lib/policies";

function formatDollars(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function FundingBreakdown({ data }: { data: FundingData }) {
  const hasDonors = data.top_donors_to_sponsors.length > 0;
  const hasLobbying = data.lobbying_spend.length > 0;

  if (!hasDonors && !hasLobbying) {
    return (
      <p className="text-sm text-gray-500 italic">
        No funding data available yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {hasDonors && (
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Top donors to bill sponsors
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Donor</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.top_donors_to_sponsors.map((donor) => (
                <tr key={`${donor.name}:${donor.source_url}`} className="border-b border-gray-100">
                  <td className="py-2">
                    <a
                      href={donor.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {donor.name}
                    </a>
                  </td>
                  <td className="py-2 text-right font-mono">
                    {formatDollars(donor.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {hasLobbying && (
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Lobbying activity
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Organization</th>
                <th className="pb-2 font-medium">Position</th>
                <th className="pb-2 font-medium text-right">Spend</th>
              </tr>
            </thead>
            <tbody>
              {data.lobbying_spend.map((entry) => (
                <tr key={`${entry.organization}:${entry.source_url}`} className="border-b border-gray-100">
                  <td className="py-2">
                    <a
                      href={entry.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {entry.organization}
                    </a>
                  </td>
                  <td className="py-2 capitalize">{entry.position}</td>
                  <td className="py-2 text-right font-mono">
                    {formatDollars(entry.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p className="text-xs text-gray-400">
        Last updated: {data.last_updated}
        {data.sources.length > 0 && (
          <>
            {" "}&middot; Sources:{" "}
            {data.sources.map((src, i) => (
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
          </>
        )}
      </p>
    </div>
  );
}
