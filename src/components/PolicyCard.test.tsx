import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import PolicyCard from "./PolicyCard";
import type { PolicyFrontmatter } from "@/lib/policies";

const base: PolicyFrontmatter = {
  title: "AI Accountability Act",
  slug: "ai-accountability-act",
  status: "proposed",
  introduced: "2025-03-12",
  sponsors: ["Sen. Jane Smith (D-CA)", "Sen. John Doe (R-TX)"],
  summary: "Requires independent audits for high-risk AI systems.",
  tags: ["AI", "regulation"],
  funding_data: "ai-accountability-act",
};

describe("PolicyCard", () => {
  it("renders the policy title and summary", () => {
    render(<PolicyCard frontmatter={base} />);
    expect(screen.getByText("AI Accountability Act")).toBeInTheDocument();
    expect(
      screen.getByText("Requires independent audits for high-risk AI systems.")
    ).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    render(<PolicyCard frontmatter={base} />);
    expect(screen.getByText("Proposed")).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<PolicyCard frontmatter={base} />);
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("regulation")).toBeInTheDocument();
  });

  it("renders sponsors and introduced date", () => {
    render(<PolicyCard frontmatter={base} />);
    expect(
      screen.getByText(/Sen. Jane Smith \(D-CA\)/)
    ).toBeInTheDocument();
    expect(screen.getByText(/2025-03-12/)).toBeInTheDocument();
  });

  it("links to the correct policy URL", () => {
    render(<PolicyCard frontmatter={base} />);
    expect(
      screen.getByRole("link").getAttribute("href")
    ).toBe("/policies/ai-accountability-act");
  });

  it.each([
    ["proposed", "Proposed"],
    ["committee", "In Committee"],
    ["passed", "Passed"],
    ["failed", "Failed"],
  ] as const)("renders '%s' status as '%s'", (status, label) => {
    render(<PolicyCard frontmatter={{ ...base, status }} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
