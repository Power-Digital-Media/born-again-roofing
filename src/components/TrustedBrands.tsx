import React from "react";

export default function TrustedBrands() {
  const brands = [
    { name: "GAF", src: "/images/wp_gaf.jpg" },
    { name: "CertainTeed", src: "/images/wp_certainteed.jpg" },
    { name: "Atlas", src: "/images/wp_atlas-copy.jpg" },
    { name: "Owens Corning", src: "/images/wp_owens.jpg" },
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
            className="trusted-brand-logo"
          />
        ))}
      </div>
    </div>
  );
}
