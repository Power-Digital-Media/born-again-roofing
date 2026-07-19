"use client";

import React, { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openDrawer = () => {
    window.dispatchEvent(
      new CustomEvent("open-estimate-drawer", {
        detail: { type: "estimate" }
      })
    );
  };

  return (
    <div className={`floating-cta-container ${isVisible ? "visible" : ""}`}>
      <button className="floating-cta-btn" onClick={openDrawer}>
        <span className="floating-cta-icon">📋</span>
        <span className="floating-cta-text">Request Free Estimate</span>
      </button>
    </div>
  );
}
