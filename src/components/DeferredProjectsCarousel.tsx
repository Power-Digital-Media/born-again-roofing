"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ProjectsCarousel = dynamic(() => import("@/components/ProjectsCarousel"), {
  ssr: false,
});

export default function DeferredProjectsCarousel() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || shouldLoad) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: "500px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [shouldLoad]);

  if (shouldLoad) {
    return <ProjectsCarousel />;
  }

  return (
    <div ref={sentinelRef} style={{ minHeight: "360px", padding: "3rem 0" }} aria-hidden="true" />
  );
}
