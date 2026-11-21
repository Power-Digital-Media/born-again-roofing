import React from "react";

export default function TrustedBrands() {
  const brands = [
    { name: "GAF", src: "/images/mat-logos/gaf.webp" },
    { name: "CertainTeed", src: "/images/mat-logos/certainteed.webp" },
    { name: "Atlas", src: "/images/mat-logos/atlas.webp" },
    { name: "Owens Corning", src: "/images/mat-logos/owens-cornering.webp" },
  ];

  return (
    <div className="trusted-brands">
      <span className="trusted-brands-label">Trusted Materials From</span>
      <div className="trusted-brands-logos">
        {brands.map((brand) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={brand.name}
            src={brand.src}
            alt={brand.name}
            width={128}
            height={48}
            loading="lazy"
            decoding="async"
            className="trusted-brand-logo"
          />
        ))}
      </div>
    </div>
  );
}
