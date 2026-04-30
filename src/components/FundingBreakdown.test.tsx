import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import FundingBreakdown from "./FundingBreakdown";
import type { FundingData } from "@/lib/policies";

const empty: FundingData = {
  policy_slug: "test-policy",
  last_updated: "2026-01-01",
  top_donors_to_sponsors: [],
  lobbying_spend: [],
  sources: [],
};

const withDonors: FundingData = {
  ...empty,
  top_donors_to_sponsors: [
    { name: "Acme Corp", amount: 50000, source_url: "https://fec.gov/acme" },
    { name: "BigTech LLC", amount: 25000, source_url: "https://fec.gov/bigtech" },
  ],
  sources: ["https://fec.gov"],
};

const withLobbying: FundingData = {
  ...empty,
  lobbying_spend: [
    {
      organization: "Tech Lobby Group",
      amount: 200000,
      position: "support",
      source_url: "https://opensecrets.org/tlg",
    },
  ],
};

describe("FundingBreakdown", () => {
  it("shows a placeholder when there is no data", () => {
    render(<FundingBreakdown data={empty} />);
    expect(
      screen.getByText("No funding data available yet.")
    ).toBeInTheDocument();
  });

  it("renders donor names and formatted amounts", () => {
    render(<FundingBreakdown data={withDonors} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("$50,000")).toBeInTheDocument();
    expect(screen.getByText("BigTech LLC")).toBeInTheDocument();
    expect(screen.getByText("$25,000")).toBeInTheDocument();
  });

  it("links donors to their source URLs", () => {
    render(<FundingBreakdown data={withDonors} />);
    expect(screen.getByRole("link", { name: "Acme Corp" })).toHaveAttribute(
      "href",
      "https://fec.gov/acme"
    );
  });

  it("renders lobbying organizations and positions", () => {
    render(<FundingBreakdown data={withLobbying} />);
    expect(screen.getByText("Tech Lobby Group")).toBeInTheDocument();
    expect(screen.getByText("support")).toBeInTheDocument();
    expect(screen.getByText("$200,000")).toBeInTheDocument();
  });

  it("shows the last_updated date", () => {
    render(<FundingBreakdown data={withDonors} />);
    expect(screen.getByText(/Last updated: 2026-01-01/)).toBeInTheDocument();
  });
});
