import { jest, afterEach, describe, it, expect } from "@jest/globals";
import fs from "fs";
import {
  getAllFunderSlugs,
  getFunder,
  getAllFunders,
  getRelatedFunders,
} from "./funders";

const mockFiles = (files: string[]) =>
  files as unknown as ReturnType<typeof fs.readdirSync>;

function makeFunderMdx(slug: string, title = "Test Funder", type = "individual") {
  return `---
title: "${title}"
slug: "${slug}"
type: "${type}"
related_orgs: []
related_policies: []
confirmed_contributions: []
sources: []
---

Content here.
`;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getAllFunderSlugs", () => {
  it("returns slugs from .mdx files in the funders directory", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(mockFiles(["greg-brockman.mdx", "joe-lonsdale.mdx", "README.md"]));

    expect(getAllFunderSlugs()).toEqual(["greg-brockman", "joe-lonsdale"]);
  });

  it("filters out unsafe slugs", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(mockFiles(["good-funder.mdx", "Bad Funder.mdx", "../evil.mdx"]));

    expect(getAllFunderSlugs()).toEqual(["good-funder"]);
  });

  it("returns empty array if directory does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getAllFunderSlugs()).toEqual([]);
  });
});

describe("getFunder", () => {
  it("parses frontmatter and content from an MDX file", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeFunderMdx("greg-brockman", "Greg Brockman"));

    const funder = getFunder("greg-brockman");
    expect(funder).not.toBeNull();
    expect(funder!.frontmatter.title).toBe("Greg Brockman");
    expect(funder!.frontmatter.type).toBe("individual");
    expect(funder!.content.trim()).toBe("Content here.");
  });

  it("returns null if frontmatter slug does not match the filename slug", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeFunderMdx("different-slug"));

    expect(getFunder("greg-brockman")).toBeNull();
  });

  it("returns null if the file does not exist", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(getFunder("missing-funder")).toBeNull();
  });

  it("returns null for unsafe slug input", () => {
    expect(getFunder("../etc/passwd")).toBeNull();
  });

  it("returns null for an invalid funder type", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      makeFunderMdx("bad-type-funder", "Bad Type Funder", "invalid-type")
    );
    expect(getFunder("bad-type-funder")).toBeNull();
  });
});

describe("getAllFunders", () => {
  it("returns funders sorted alphabetically by title", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest
      .spyOn(fs, "readdirSync")
      .mockReturnValue(mockFiles(["zara-investor.mdx", "alpha-funder.mdx"]));
    jest.spyOn(fs, "readFileSync").mockImplementation((p: unknown) => {
      if ((p as string).includes("zara-investor"))
        return makeFunderMdx("zara-investor", "Zara Investor");
      return makeFunderMdx("alpha-funder", "Alpha Funder");
    });

    const funders = getAllFunders();
    expect(funders[0].frontmatter.title).toBe("Alpha Funder");
    expect(funders[1].frontmatter.title).toBe("Zara Investor");
  });
});

describe("getRelatedFunders", () => {
  it("returns slug and title for each valid slug", () => {
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    jest.spyOn(fs, "readFileSync").mockImplementation((p: unknown) => {
      if ((p as string).includes("greg-brockman"))
        return makeFunderMdx("greg-brockman", "Greg Brockman");
      return makeFunderMdx("joe-lonsdale", "Joe Lonsdale");
    });

    const result = getRelatedFunders(["greg-brockman", "joe-lonsdale"]);
    expect(result).toEqual([
      { slug: "greg-brockman", title: "Greg Brockman" },
      { slug: "joe-lonsdale", title: "Joe Lonsdale" },
    ]);
  });

  it("silently drops slugs that do not resolve to a real funder", () => {
    jest.spyOn(fs, "existsSync").mockImplementation((p: unknown) =>
      (p as string).includes("real-funder")
    );
    jest.spyOn(fs, "readFileSync").mockReturnValue(makeFunderMdx("real-funder", "Real Funder"));

    const result = getRelatedFunders(["real-funder", "ghost-funder"]);
    expect(result).toEqual([{ slug: "real-funder", title: "Real Funder" }]);
  });

  it("returns empty array for empty input", () => {
    const result = getRelatedFunders([]);
    expect(result).toEqual([]);
  });
});
