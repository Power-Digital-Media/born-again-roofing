import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Roofing & Remodeling Project Photos | Jackson & Brandon MS",
  },
  description:
    "See real roof replacements, storm repairs & home remodels completed near you in Brandon, Florence, Madison & Jackson, MS. Free estimate: (601) 573-6178.",
  alternates: {
    canonical: "/pins/",
  },
};

export default function PinsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
