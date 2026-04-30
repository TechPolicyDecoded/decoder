import { jest, afterEach, describe, it, expect } from "@jest/globals";
import fs from "fs";
import {
  getAllPolicySlugs,
  getPolicy,
  getAllPolicies,
  getFundingData,
} from "./policies";

function makeMdx(slug: string, introduced = "2025-01-01") {
  return `---
title: "Test Policy"
slug: "${slug}"
status: "proposed"
introduced: "${introduced}"
sponsors: ["Sen. A (D-CA)"]
summary: "A test policy summary."
tags: ["test"]
funding_data: "${slug}"
---

Body content here.
`;
}

const MOCK_FUNDING = JSON.stringify({
  policy_slug: "test-policy",
  last_updated: "2026-01-01",
  top_donors_to_sponsors: [
    { name: "Acme Corp", amount: 50000, source_url: "https://fec.gov" },
  ],
  lobbying_spend: [],
  sources: ["https://opensecrets.org"],
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getAllPolicySlugs", () => {
  it("returns slugs from .mdx files in the policies directory", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(["ai-act.mdx", "privacy-bill.mdx", "README.md"] as any);

    expect(getAllPolicySlugs()).toEqual(["ai-act", "privacy-bill"]);
  });

  it("filters out unsafe slugs", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(["good-slug.mdx", "Bad Slug.mdx", "../evil.mdx"] as any);

    expect(getAllPolicySlugs()).toEqual(["good-slug"]);
  });

  it("returns empty array if directory does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getAllPolicySlugs()).toEqual([]);
  });
});

describe("getPolicy", () => {
  it("parses frontmatter and content from an MDX file", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeMdx("test-policy"));

    const policy = getPolicy("test-policy");
    expect(policy).not.toBeNull();
    expect(policy!.frontmatter.title).toBe("Test Policy");
    expect(policy!.frontmatter.status).toBe("proposed");
    expect(policy!.frontmatter.tags).toEqual(["test"]);
    expect(policy!.content.trim()).toBe("Body content here.");
  });

  it("returns null if frontmatter slug does not match the filename slug", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeMdx("different-slug"));

    expect(getPolicy("test-policy")).toBeNull();
  });

  it("returns null if the file does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getPolicy("missing")).toBeNull();
  });

  it("returns null for unsafe slug input", () => {
    expect(getPolicy("../etc/passwd")).toBeNull();
  });
});

describe("getAllPolicies", () => {
  it("returns policies sorted newest-introduced first", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(["policy-a.mdx", "policy-b.mdx"] as any);
    jest.spyOn(fs, "readFileSync").mockImplementation((p: unknown) => {
      if ((p as string).includes("policy-a.mdx")) {
        return makeMdx("policy-a", "2024-06-01");
      }
      return makeMdx("policy-b", "2025-12-01");
    });

    const policies = getAllPolicies();
    expect(policies[0].frontmatter.introduced).toBe("2025-12-01");
    expect(policies[1].frontmatter.introduced).toBe("2024-06-01");
  });
});

describe("getFundingData", () => {
  it("parses a funding JSON file", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(MOCK_FUNDING);

    const data = getFundingData("test-policy");
    expect(data).not.toBeNull();
    expect(data!.policy_slug).toBe("test-policy");
    expect(data!.top_donors_to_sponsors).toHaveLength(1);
    expect(data!.top_donors_to_sponsors[0].name).toBe("Acme Corp");
  });

  it("filters out malformed donor entries", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({
        policy_slug: "test-policy",
        last_updated: "2026-01-01",
        top_donors_to_sponsors: [
          { name: "Valid Donor", amount: 1000, source_url: "https://fec.gov" },
          { name: "No Amount", source_url: "https://fec.gov" },
          { amount: 500, source_url: "https://fec.gov" },
        ],
        lobbying_spend: [],
        sources: [],
      })
    );

    const data = getFundingData("test-policy");
    expect(data!.top_donors_to_sponsors).toHaveLength(1);
    expect(data!.top_donors_to_sponsors[0].name).toBe("Valid Donor");
  });

  it("filters out malformed lobbying entries", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({
        policy_slug: "test-policy",
        last_updated: "2026-01-01",
        top_donors_to_sponsors: [],
        lobbying_spend: [
          { organization: "Good Org", amount: 5000, position: "support", source_url: "https://opensecrets.org" },
          { organization: "Bad Position", amount: 5000, position: "maybe", source_url: "https://opensecrets.org" },
          { organization: "Missing Amount", position: "oppose", source_url: "https://opensecrets.org" },
        ],
        sources: [],
      })
    );

    const data = getFundingData("test-policy");
    expect(data!.lobbying_spend).toHaveLength(1);
    expect(data!.lobbying_spend[0].organization).toBe("Good Org");
  });

  it("returns null if the funding file does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getFundingData("missing")).toBeNull();
  });
});
