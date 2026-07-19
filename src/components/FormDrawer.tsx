"use client";

import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm";

export default function FormDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<"estimate" | "emergency" | "callback">("estimate");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type || "estimate";
      setFormType(type);
      setIsOpen(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling when open
    };

    window.addEventListener("open-estimate-drawer", handleOpen);
    return () => {
      window.removeEventListener("open-estimate-drawer", handleOpen);
    };
  }, []);

  const closeDrawer = () => {
    setIsOpen(false);
    document.body.style.overflow = ""; // Re-enable scrolling
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`drawer-backdrop ${isOpen ? "open" : ""}`}
        onClick={closeDrawer}
      />

      {/* Slide-out Panel */}
      <div className={`drawer-panel ${isOpen ? "open" : ""}`}>
        <button 
          className="drawer-close-btn" 
          onClick={closeDrawer}
          aria-label="Close form"
        >
          ✕
        </button>
        <div className="drawer-content">
          <ContactForm type={formType} />
        </div>
      </div>
    </>
  );
}
