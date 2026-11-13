"use client";

import React, { useState, useEffect } from "react";
import ContactForm from "./ContactForm";

export default function FormDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<"estimate" | "emergency" | "callback">("estimate");
  const [defaultService, setDefaultService] = useState<string>("");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{
        type?: "estimate" | "emergency" | "callback";
        defaultService?: string;
      }>;
      const type = customEvent.detail?.type || "estimate";
      setFormType(type);
      setDefaultService(customEvent.detail?.defaultService || "");
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("open-estimate-drawer", handleOpen);
    return () => {
      window.removeEventListener("open-estimate-drawer", handleOpen);
    };
  }, []);

  const closeDrawer = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? "open" : ""}`} onClick={closeDrawer} />

      <div className={`drawer-panel ${isOpen ? "open" : ""}`}>
        <button className="drawer-close-btn" onClick={closeDrawer} aria-label="Close form">
          ✕
        </button>
        <div className="drawer-content">
          <ContactForm
            key={`${formType}-${defaultService}`}
            type={formType}
            defaultService={defaultService}
          />
        </div>
      </div>
    </>
  );
}
