import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central MS Roofing & Remodeling Project Map",
  description: "Browse our portfolio of completed roofing, remodeling, and storm restoration projects across Jackson, MS and Central Mississippi. See real results from real homes.",
  alternates: {
    canonical: "/pins/"
  }
};

export default function PinsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
