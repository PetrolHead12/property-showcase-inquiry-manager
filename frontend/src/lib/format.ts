import type { PropertyStatus } from "./types";

// Formats a price in INR using lakh/crore shorthand, which is how luxury
// property prices are actually read and spoken in India — "₹4.5 Cr" reads
// correctly to the target audience where "₹45,000,000" does not.
export function formatPriceINR(value: number): string {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";

  if (n >= 1_00_00_000) {
    return `₹${trimZero(n / 1_00_00_000)} Cr`;
  }
  if (n >= 1_00_000) {
    return `₹${trimZero(n / 1_00_000)} L`;
  }
  return `₹${n.toLocaleString("en-IN")}`;
}

function trimZero(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(2).replace(/0$/, "");
}

export function formatSqft(value: number): string {
  return `${Number(value).toLocaleString("en-IN")} sqft`;
}

export function formatBedrooms(value: number): string {
  return `${value} BHK`;
}

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  available: "Available",
  under_offer: "Under offer",
  sold: "Sold",
};
