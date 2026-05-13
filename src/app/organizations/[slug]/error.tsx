"use client";

import Link from "next/link";

export default function OrgError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-2 text-gray-600">
        This organization page failed to load.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={reset}
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          Try again
        </button>
        <Link href="/organizations" className="text-sm text-blue-600 hover:underline self-center">
          &larr; All organizations
        </Link>
      </div>
    </main>
  );
}
