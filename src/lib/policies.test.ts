import { jest, afterEach, describe, it, expect } from "@jest/globals";
import fs from "fs";
import {
  getAllPolicySlugs,
  getPolicy,
  getAllPolicies,
  getFundingData,
} from "./policies";

const MOCK_MDX = `---
title: "Test Policy"
slug: "test-policy"
status: "proposed"
introduced: "2025-01-01"
sponsors: ["Sen. A (D-CA)"]
summary: "A test policy summary."
tags: ["test"]
funding_data: "test-policy"
---

Body content here.
`;

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

  it("returns empty array if directory does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getAllPolicySlugs()).toEqual([]);
  });
});

describe("getPolicy", () => {
  it("parses frontmatter and content from an MDX file", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(MOCK_MDX);

    const policy = getPolicy("test-policy");
    expect(policy).not.toBeNull();
    expect(policy!.frontmatter.title).toBe("Test Policy");
    expect(policy!.frontmatter.status).toBe("proposed");
    expect(policy!.frontmatter.tags).toEqual(["test"]);
    expect(policy!.content.trim()).toBe("Body content here.");
  });

  it("returns null if the file does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getPolicy("missing")).toBeNull();
  });
});

describe("getAllPolicies", () => {
  it("returns policies sorted newest-introduced first", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(["a.mdx", "b.mdx"] as any);
    jest.spyOn(fs, "readFileSync").mockImplementation((p: unknown) => {
      if ((p as string).includes("a.mdx")) {
        return MOCK_MDX.replace("2025-01-01", "2024-06-01");
      }
      return MOCK_MDX.replace("2025-01-01", "2025-12-01");
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

  it("returns null if the funding file does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getFundingData("missing")).toBeNull();
  });
});
