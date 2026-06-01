import { jest, afterEach, describe, it, expect } from "@jest/globals";
import fs from "fs";
import {
  getAllOrgSlugs,
  getOrg,
  getAllOrgs,
  getRelatedOrgs,
} from "./organizations";

const mockFiles = (files: string[]) =>
  files as unknown as ReturnType<typeof fs.readdirSync>;

function makeOrgMdx(slug: string, title = "Test Org", type = "super-pac") {
  return `---
title: "${title}"
slug: "${slug}"
type: "${type}"
funding_confidence: "reported"
related_policies: []
related_funders: []
sources: []
---

Content here.
`;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getAllOrgSlugs", () => {
  it("returns slugs from .mdx files in the organizations directory", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(mockFiles(["acme-pac.mdx", "dark-money-inc.mdx", "README.md"]));

    expect(getAllOrgSlugs()).toEqual(["acme-pac", "dark-money-inc"]);
  });

  it("filters out unsafe slugs", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(mockFiles(["good-org.mdx", "Bad Org.mdx", "../evil.mdx"]));

    expect(getAllOrgSlugs()).toEqual(["good-org"]);
  });

  it("returns empty array if directory does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getAllOrgSlugs()).toEqual([]);
  });
});

describe("getOrg", () => {
  it("parses frontmatter and content from an MDX file", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeOrgMdx("leading-the-future", "Leading the Future"));

    const org = getOrg("leading-the-future");
    expect(org).not.toBeNull();
    expect(org!.frontmatter.title).toBe("Leading the Future");
    expect(org!.frontmatter.type).toBe("super-pac");
    expect(org!.content.trim()).toBe("Content here.");
  });

  it("returns null if frontmatter slug does not match the filename slug", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeOrgMdx("different-slug"));

    expect(getOrg("leading-the-future")).toBeNull();
  });

  it("returns null if the file does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getOrg("missing-org")).toBeNull();
  });

  it("returns null for unsafe slug input", () => {
    expect(getOrg("../etc/passwd")).toBeNull();
  });

  it("returns null for an invalid org type", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      makeOrgMdx("bad-type-org", "Bad Type Org", "invalid-type")
    );
    expect(getOrg("bad-type-org")).toBeNull();
  });
});

describe("getAllOrgs", () => {
  it("returns orgs sorted alphabetically by title", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(mockFiles(["zebra-pac.mdx", "alpha-org.mdx"]));
    jest.spyOn(fs, "readFileSync").mockImplementation((p: unknown) => {
      if ((p as string).includes("zebra-pac")) return makeOrgMdx("zebra-pac", "Zebra PAC");
      return makeOrgMdx("alpha-org", "Alpha Org");
    });

    const orgs = getAllOrgs();
    expect(orgs[0].frontmatter.title).toBe("Alpha Org");
    expect(orgs[1].frontmatter.title).toBe("Zebra PAC");
  });
});

describe("getRelatedOrgs", () => {
  it("returns slug and title for each valid slug", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockImplementation((p: unknown) => {
      if ((p as string).includes("leading-the-future"))
        return makeOrgMdx("leading-the-future", "Leading the Future");
      return makeOrgMdx("build-american-ai", "Build American AI");
    });

    const result = getRelatedOrgs(["leading-the-future", "build-american-ai"]);
    expect(result).toEqual([
      { slug: "leading-the-future", title: "Leading the Future" },
      { slug: "build-american-ai", title: "Build American AI" },
    ]);
  });

  it("silently drops slugs that do not resolve to a real org", () => {
    jest.spyOn(fs, "existsSync").mockImplementation((p: unknown) =>
      (p as string).includes("real-org")
    );
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeOrgMdx("real-org", "Real Org"));

    const result = getRelatedOrgs(["real-org", "ghost-org"]);
    expect(result).toEqual([{ slug: "real-org", title: "Real Org" }]);
  });

  it("returns empty array for empty input", () => {
    const result = getRelatedOrgs([]);
    expect(result).toEqual([]);
  });
});
