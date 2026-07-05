import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Details | Born Again Home Remodeling and Roofing",
  description: "View detailed project photos and information from Born Again Home Remodeling and Roofing in Jackson, MS.",
  alternates: {
    canonical: "/pin-page/"
  }
};

export default function PinPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
