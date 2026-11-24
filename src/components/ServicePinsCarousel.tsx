"use client";

import React, { useState, useMemo, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import pinsData from "@/data/pins.json";

const IndividualProjectMap = dynamic(() => import("@/components/IndividualProjectMap"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#0f172a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255, 255, 255, 0.2)", fontSize: "0.75rem" }}>
      Loading Satellite...
    </div>
  )
});

const MapModal = dynamic(() => import("@/components/MapModal"), {
  ssr: false
});

interface PinType {
  id: string;
  location: string;
  service: string;
  author: string;
  date: string;
  description: string;
  detailedExplanation: string;
  images: string[];
}

interface ServicePinsCarouselProps {
  services: string[];
  limit?: number;
}

const subscribeNoop = () => () => {};

export default function ServicePinsCarousel({ services, limit = 8 }: ServicePinsCarouselProps) {
  const [activeMapPin, setActiveMapPin] = useState<PinType | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const defaultFiltered = useMemo(() => {
    return pinsData
      .filter(
        (pin) =>
          Array.isArray(pin.images) &&
          pin.images.length > 0 &&
          services.some((svc) => pin.service.toLowerCase().includes(svc.toLowerCase()))
      )
      .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
      .slice(0, limit);
  }, [services, limit]);

  const [filteredPins, setFilteredPins] = useState<PinType[]>(defaultFiltered);

  useEffect(() => {
    fetch(`/api/pins/?t=${Date.now()}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch live pins");
      })
      .then((data: PinType[]) => {
        if (Array.isArray(data)) {
          const matched = data.filter(
            (pin) =>
              Array.isArray(pin.images) &&
              pin.images.length > 0 &&
              services.some((svc) => pin.service.toLowerCase().includes(svc.toLowerCase()))
          );
          
          const sorted = matched.sort((a, b) => {
            const numA = Number(a.id) || 0;
            const numB = Number(b.id) || 0;
            return numB - numA;
          });
          
          const formattedMatched = sorted.map(pin => ({
            ...pin,
            detailedExplanation: pin.detailedExplanation || ""
          })) as PinType[];
          
          setFilteredPins(formattedMatched.slice(0, limit));
        }
      })
      .catch((err) => console.error("Error loading dynamic service pins:", err));
  }, [services, limit, defaultFiltered]);

  // Only clone infinite-scroll track sets client-side so SSR HTML never emits 3x duplicate cards to Googlebot
  const renderedPins = useMemo(() => {
    if (!isMounted || filteredPins.length <= 1) return filteredPins;
    return [...filteredPins, ...filteredPins, ...filteredPins];
  }, [filteredPins, isMounted]);

  useEffect(() => {
    const deck = deckRef.current;
    if (!isMounted || !deck || filteredPins.length <= 1) return;

    const cardWidth = 334;
    const totalSetWidth = filteredPins.length * cardWidth;
    deck.scrollLeft = totalSetWidth;
  }, [filteredPins.length, isMounted]);

  useEffect(() => {
    if (!isMounted || !deckRef.current || filteredPins.length <= 1) return;

    const interval = setInterval(() => {
      if (isHovered) return;

      const deck = deckRef.current;
      if (!deck) return;

      const cardWidth = 334;
      const totalSetWidth = filteredPins.length * cardWidth;
      const currentScroll = deck.scrollLeft;
      
      let nextScroll = currentScroll + cardWidth;
      if (nextScroll >= totalSetWidth * 2) {
        deck.scrollLeft = currentScroll - totalSetWidth;
        nextScroll = currentScroll - totalSetWidth + cardWidth;
      }

      deck.scrollTo({
        left: nextScroll,
        behavior: "smooth"
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [filteredPins.length, isHovered, isMounted]);

  const handleScroll = () => {
    const deck = deckRef.current;
    if (!isMounted || !deck || filteredPins.length <= 1) return;

    const cardWidth = 334;
    const totalSetWidth = filteredPins.length * cardWidth;

    if (deck.scrollLeft >= totalSetWidth * 2.2) {
      deck.scrollLeft = deck.scrollLeft - totalSetWidth;
    } else if (deck.scrollLeft <= totalSetWidth * 0.8) {
      deck.scrollLeft = deck.scrollLeft + totalSetWidth;
    }
  };

  if (filteredPins.length === 0) {
    return null;
  }

  return (
    <div className="service-pins-carousel-wrapper scroll-reveal" style={{ marginTop: "3.5rem", marginBottom: "3.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
        <div>
          <span style={{ color: "var(--secondary)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.15em", display: "block", marginBottom: "4px" }}>
            Proven Neighborhood Quality
          </span>
          <h3 style={{ color: "var(--primary)", fontSize: "1.45rem", margin: 0, fontWeight: 800 }}>
            Recent Local Projects
          </h3>
        </div>
        <Link href="/pins/" prefetch={false} style={{ color: "var(--secondary)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>
          View All Projects →
        </Link>
      </div>

      {/* Horizontal Scroll Deck */}
      <div 
        className="pins-scroll-deck"
        ref={deckRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onScroll={handleScroll}
      >
        {renderedPins.map((pin, idx) => (
          <div key={`${pin.id}-${idx}`} className="double-bezel-wrapper pin-scroll-card-wrapper">
            <div className="double-bezel-inner pin-scroll-card">
              
              {/* Badge Row */}
              <div className="pin-card-badge-row">
                <span className="pin-card-city">{pin.location}</span>
                <span className="pin-card-date">{pin.date}</span>
              </div>

              {/* Satellite Project Map */}
              <div className="pin-card-img-container" style={{ position: "relative" }}>
                <IndividualProjectMap pin={pin} onEnlarge={() => setActiveMapPin(pin)} />
              </div>

              {/* Description */}
              <div className="pin-card-details">
                <span className="pin-card-tech">Completed by {pin.author}</span>
                <p className="pin-card-desc">
                  {"\""}{pin.description.length > 95 ? pin.description.substring(0, 95) + "..." : pin.description}{"\""}
                </p>
                <Link href={`/pin-page/?id=${pin.id}`} rel="nofollow" prefetch={false} className="btn btn-outline pin-card-btn">
                  View Case Study
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

      {activeMapPin && (
        <MapModal pin={activeMapPin} onClose={() => setActiveMapPin(null)} />
      )}

    </div>
  );
}
