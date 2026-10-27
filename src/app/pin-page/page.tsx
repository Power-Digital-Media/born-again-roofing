import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getPins, type PinType } from "@/lib/db";
import PinDetailClient, { type PublicPin } from "./PinDetailClient";
import { buildHeading, buildMetaDescription, buildTitle } from "./heading";

// Read-only server rendering of the existing project records.
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ id?: string | string[] }> };

function firstId(v: string | string[] | undefined): string | null {
  const id = Array.isArray(v) ? v[0] : v;
  return id && /^[A-Za-z0-9_-]{1,40}$/.test(id) ? id : null;
}

const loadPin = cache(async (id: string | null): Promise<PinType | null> => {
  if (!id) return null;
  const pins = await getPins();
  return pins.find((p) => p.id === id) ?? null;
});

function toPublic(pin: PinType & { title?: string }): PublicPin {
  return {
    id: pin.id,
    location: pin.location,
    service: pin.service,
    author: pin.author,
    date: pin.date,
    description: pin.description,
    detailedExplanation: pin.detailedExplanation,
    images: pin.images || [],
    photoMeta: pin.photoMeta
      ? pin.photoMeta
          .filter((m) => m.isPublic !== false)
          .map((m) => ({ url: m.url, stage: m.stage, caption: m.caption }))
      : undefined,
    beforeAfterCollageUrl: pin.beforeAfterCollageUrl,
    title: pin.title,
    aeoAnswers: pin.aeoAnswers,
  };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const pin = await loadPin(firstId((await searchParams).id));
  if (!pin) {
    return { title: "Project Not Found", robots: { index: false, follow: true } };
  }
  const canonical = `/pin-page/?id=${pin.id}`;
  const description = buildMetaDescription(pin);
  const title = buildTitle(pin);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: pin.images?.[0] ? [{ url: pin.images[0] }] : undefined,
    },
  };
}

export default async function PinDetailPage({ searchParams }: Props) {
  const pin = await loadPin(firstId((await searchParams).id));
  if (!pin) notFound();
  return <PinDetailClient pin={toPublic(pin)} heading={buildHeading(pin)} />;
}
