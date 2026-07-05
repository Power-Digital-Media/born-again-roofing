"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Pin {
  id: string;
  author: string;
  date: string;
  location: string;
  service: string;
  description: string;
  images: string[];
}

interface InteractiveMapProps {
  pins: Pin[];
}

const cityCoords: Record<string, [number, number]> = {
  "Pearl, MS": [32.2729, -90.1312],
  "Jackson, MS": [32.2988, -90.1848],
  "Florence, MS": [32.1610, -90.1290],
  "Brandon, MS": [32.2732, -89.9859],
  "Madison, MS": [32.4610, -90.1171],
  "Byram, MS": [32.1813, -90.2476],
  "Clinton, MS": [32.3415, -90.3218],
  "Flowood, MS": [32.3276, -90.1345],
  "Ridgeland, MS": [32.4288, -90.1312],
  "Canton, MS": [32.6126, -90.0368],
  "Vicksburg, MS": [32.3526, -90.8779],
  "Yazoo City, MS": [32.8551, -90.4076],
  "Crystal Springs, MS": [31.9863, -90.3582],
  "Hazlehurst, MS": [31.8615, -90.3954],
  "Raymond, MS": [32.2593, -90.4237],
  "Richland, MS": [32.2354, -90.1565],
  "Terry, MS": [32.1038, -90.3204],
  "Utica, MS": [32.1121, -90.6272],
  "Gluckstadt, MS": [32.5188, -90.1315],
  "Magee, MS": [31.8710, -89.7337],
  "Hattiesburg, MS": [31.3271, -89.2903]
};

export default function InteractiveMap({ pins }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Map Instance (Only once)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [32.2988, -90.1848], // Jackson, MS center
        zoom: 10,
        scrollWheelZoom: false // Prevent accidental scrolling
      });

      // Voyager Light Theme Tiles (Warm, natural colors that make gold pins pop!)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
      markerLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markerLayer = markerLayerRef.current;

    if (!map || !markerLayer) return;

    // 2. Clear existing markers
    markerLayer.clearLayers();

    // 3. Set marker icon (Gold SVGs)
    const customGoldIcon = L.divIcon({
      html: `
        <div class="map-pulse-marker">
          <div class="pulse-ring"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="marker-svg">
            <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      className: "custom-leaflet-marker-wrapper",
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42]
    });

    // 4. Plot markers with stable jittering
    const bounds: L.LatLngExpression[] = [];

    pins.forEach((pin) => {
      const baseCoords = cityCoords[pin.location] || [32.2988, -90.1848]; // default Jackson
      
      // Stable deterministic jitter using sine/cosine based on id
      const seed = parseInt(pin.id, 10) || 1;
      const latJitter = Math.sin(seed) * 0.016;
      const lngJitter = Math.cos(seed) * 0.016;
      const pinCoords: [number, number] = [baseCoords[0] + latJitter, baseCoords[1] + lngJitter];

      bounds.push(pinCoords);

      const popupHTML = `
        <div class="map-popup-inner" style="width: 200px; font-family: system-ui, sans-serif;">
          <img src="${pin.images[0]}" alt="${pin.service}" style="width:100%; height:95px; object-fit:cover; border-radius:6px; border:1px solid #334155; margin-bottom:8px;" />
          <h5 style="margin:0 0 3px; color:#f1f5f9; font-size:0.88rem; font-weight:800; line-height:1.3;">${pin.service}</h5>
          <span style="display:block; color:#94a3b8; font-size:0.75rem; margin-bottom:4px; font-weight:600;">${pin.location}</span>
          <p style="margin:0 0 8px; color:#94a3b8; font-size:0.75rem; font-style:italic; line-height:1.4;">
            "${pin.description.length > 70 ? pin.description.substring(0, 70) + "..." : pin.description}"
          </p>
          <a href="/pin-page/?id=${pin.id}" style="display:inline-block; font-size:0.75rem; color:#e2b047; font-weight:700; text-decoration:none; transition: color 0.2s;">
            View Full details →
          </a>
        </div>
      `;

      const marker = L.marker(pinCoords, { icon: customGoldIcon })
        .bindPopup(popupHTML, {
          className: "custom-leaflet-popup"
        });

      markerLayer.addLayer(marker);
    });

    // 5. Fit bounds to contain visible markers (only if there are markers)
    if (bounds.length > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(bounds), {
        padding: [30, 30],
        maxZoom: 13
      });
    }

  }, [pins]);

  return (
    <div className="double-bezel-wrapper interactive-map-wrapper" style={{ width: "100%", marginBottom: "3rem", padding: "0 !important" }}>
      <div className="double-bezel-inner" style={{ padding: "0 !important", overflow: "hidden", borderRadius: "16px" }}>
        <div ref={mapContainerRef} className="interactive-map-container" style={{ height: "420px", width: "100%", zIndex: 1 }} />
      </div>

      <style jsx global>{`
        /* Custom Leaflet Marker Styling */
        .custom-leaflet-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .map-pulse-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 42px;
        }

        .marker-svg {
          width: 30px;
          height: 30px;
          color: var(--secondary);
          z-index: 2;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
          animation: markerBounce 2s infinite ease-in-out;
        }

        .pulse-ring {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scale(1);
          width: 16px;
          height: 8px;
          background: rgba(var(--secondary-rgb), 0.4);
          border-radius: 50%;
          animation: markerPulse 2s infinite ease-out;
          z-index: 1;
        }

        @keyframes markerBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes markerPulse {
          0% { transform: translateX(-50%) scale(0.5); opacity: 1; }
          100% { transform: translateX(-50%) scale(2.2); opacity: 0; }
        }

        /* Custom Leaflet Dark Theme Popup Styling */
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: #0f172a !important; /* Dark Slate */
          color: #f1f5f9 !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
          padding: 6px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }

        .custom-leaflet-popup .leaflet-popup-tip {
          background: #0f172a !important;
          border-left: 1px solid #334155 !important;
          border-bottom: 1px solid #334155 !important;
        }

        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8 !important;
          padding: 8px 12px 0 0 !important;
        }

        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #f1f5f9 !important;
        }

        @media (max-width: 768px) {
          .interactive-map-wrapper {
            margin-bottom: 1.5rem !important;
          }
          .interactive-map-container {
            height: 280px !important;
          }
        }
      `}</style>
    </div>
  );
}
