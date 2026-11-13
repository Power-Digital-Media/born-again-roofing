"use client";

import React, { useState, useId } from "react";

export interface ContactFormProps {
  type?: "estimate" | "emergency" | "callback";
  compact?: boolean;
  defaultService?: string;
}

const MS_ZIP_REGEX = /^(38[6-9]|39[0-7])\d{2}(?:-\d{4})?$/;

export const SERVICE_OPTIONS = [
  { value: "Roof Replacement", label: "Roof Replacement / New Roof" },
  { value: "Roof Repair", label: "Roof Repair / Leak Fix" },
  { value: "Storm Damage Restoration", label: "Free Storm / Hail Roof Inspection" },
  { value: "Metal Roofing", label: "Standing Seam / Metal Roofing" },
  { value: "Commercial Roofing", label: "Commercial / Flat Roofing" },
  { value: "Home Remodeling / Additions", label: "Home Remodeling / Kitchen & Bath" },
  { value: "Siding, Gutters & Exterior", label: "Siding, Gutters & Exterior" },
];

const WINDOW_OPTIONS = [
  { value: "ASAP / Flexible", label: "ASAP / Flexible (Any Day)" },
  { value: "Morning (8am - 12pm)", label: "Morning (8:00 AM – 12:00 PM)" },
  { value: "Afternoon (12pm - 5pm)", label: "Afternoon (12:00 PM – 5:00 PM)" },
  { value: "Call First to Coordinate", label: "Call Me First to Coordinate" },
];

export default function ContactForm({
  type = "estimate",
  compact = false,
  defaultService = "",
}: ContactFormProps) {
  const uid = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredWindow, setPreferredWindow] = useState("ASAP / Flexible");

  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [damageSeverity, setDamageSeverity] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");

  const [service, setService] = useState(defaultService);
  const [websiteUrl, setWebsiteUrl] = useState(""); // Honeypot
  const [formRenderedAt] = useState(() => Date.now());

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedCity = addressCity.trim();
    const trimmedZip = addressZip.trim();

    if (!trimmedName || !trimmedPhone) {
      setError("Please enter your name and cell phone number.");
      return;
    }

    if (trimmedPhone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!trimmedCity || !trimmedZip) {
      setError("Please enter your Mississippi city and 5-digit ZIP code.");
      return;
    }

    if (!MS_ZIP_REGEX.test(trimmedZip)) {
      setError(
        "Born Again Home Remodeling & Roofing exclusively serves Mississippi properties (Jackson Metro & Central MS). Please enter a valid 5-digit Mississippi ZIP code (38600–39799), or call (601) 573-6178."
      );
      return;
    }

    if (type === "estimate" && !service) {
      setError("Please select the service you need.");
      return;
    }

    if (type === "emergency") {
      if (!addressStreet.trim() || !damageSeverity) {
        setError("Please enter the property street address and damage severity for emergency dispatch.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/forms/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: email.trim(),
          phone: trimmedPhone,
          timeSlot: type === "estimate" ? preferredWindow : "",
          service:
            type === "estimate"
              ? service
              : type === "emergency"
              ? "Storm Damage Restoration"
              : "Quick Callback",
          message: message.trim(),
          addressStreet: addressStreet.trim(),
          addressCity: trimmedCity,
          addressState: "MS",
          addressZip: trimmedZip.slice(0, 5),
          damageSeverity: type === "emergency" ? damageSeverity : "",
          insuranceCompany: type === "emergency" ? insuranceCompany.trim() : "",
          scheduleType: addressStreet.trim() ? "schedule-inspection" : "schedule-call",
          _form_source:
            type === "emergency"
              ? "storm-damage-emergency"
              : type === "callback"
              ? "quick-callback"
              : compact
              ? "hero-inline-estimate"
              : "estimate-request",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          website_url: websiteUrl,
          formRenderedAt,
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          payload?.error ||
            "Something went wrong submitting your request. Please call us directly at (601) 573-6178."
        );
        return;
      }

      if (typeof window !== "undefined") {
        const win = window as Window & {
          gtag?: (event: string, action: string, params: Record<string, string | number>) => void;
        };
        if (win.gtag) {
          win.gtag("event", "generate_lead", {
            value: type === "emergency" ? 2.0 : 1.0,
            currency: "USD",
            lead_origin:
              type === "emergency"
                ? "Emergency Form"
                : type === "callback"
                ? "Callback Form"
                : compact
                ? "Hero Inline Form"
                : "Estimate Form",
            service_selected: service || type,
            property_zip: trimmedZip.slice(0, 5),
          });
        }
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setPreferredWindow("ASAP / Flexible");
      setAddressStreet("");
      setAddressCity("");
      setAddressZip("");
      setDamageSeverity("");
      setInsuranceCompany("");
      setService(defaultService || "");
      setMessage("");
    } catch (err) {
      console.error("Form error:", err);
      setError("Something went wrong. Please call us directly at (601) 573-6178.");
    } finally {
      setSubmitting(false);
    }
  };

  const wrapperClass = `double-bezel-wrapper contact-form-wrapper${
    type === "emergency" ? " emergency-bezel" : ""
  }`;
  const innerClass = `double-bezel-inner contact-form-inner${
    type === "emergency" ? " form-emergency" : ""
  }${type === "callback" ? " form-callback" : ""}`;
  const formTitle =
    type === "emergency"
      ? "⚠️ Emergency Storm Dispatch"
      : type === "callback"
      ? "Quick Callback Request"
      : compact
      ? "Get Your Free Estimate"
      : "Request a Free Estimate";
  const buttonClass = `btn submit-btn ${type === "emergency" ? "btn-emergency" : "btn-secondary"}`;
  const buttonText = submitting
    ? "Submitting…"
    : type === "emergency"
    ? "Dispatch Storm Inspector"
    : type === "callback"
    ? "Request Callback"
    : "Get My Free Estimate →";

  return (
    <div className={wrapperClass}>
      <div className={innerClass}>
        <div style={{ marginBottom: compact ? "0.9rem" : "1.15rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--secondary)",
              marginBottom: "0.25rem",
            }}
          >
            Central Mississippi Homeowners &amp; Businesses
          </span>
          <h3 className="form-title" style={{ marginBottom: 0 }}>
            {formTitle}
          </h3>
        </div>

        {success ? (
          <div className="success-banner">
            <h4>Request Received!</h4>
            <p>
              {type === "emergency"
                ? "Your emergency storm dispatch request is in. Our inspector is being alerted and will call you shortly."
                : "Thank you! Our local Central Mississippi team has your details and will reach out shortly to confirm your free estimate."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="error-banner">{error}</div>}

            {/* Honeypot anti-bot field */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label htmlFor={`${uid}-website`}>Website</label>
              <input
                type="text"
                id={`${uid}-website`}
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>

            {/* Name + Phone */}
            {compact ? (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor={`${uid}-name`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id={`${uid}-name`}
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={`${uid}-phone`}>
                    Cell Phone *
                  </label>
                  <input
                    type="tel"
                    id={`${uid}-phone`}
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(601) 555-0199"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor={`${uid}-name`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id={`${uid}-name`}
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                  />
                </div>

                {type !== "callback" ? (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor={`${uid}-phone`}>
                        Cell Phone *
                      </label>
                      <input
                        type="tel"
                        id={`${uid}-phone`}
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(601) 555-0199"
                        autoComplete="tel"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`${uid}-email`}>
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        id={`${uid}-email`}
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label" htmlFor={`${uid}-phone`}>
                      Cell Phone *
                    </label>
                    <input
                      type="tel"
                      id={`${uid}-phone`}
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(601) 555-0199"
                      autoComplete="tel"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* Service Selection (Roofing prioritized first, Remodeling preserved) */}
            {type === "estimate" && (
              <div className={compact ? "form-group" : "form-row"}>
                <div className="form-group" style={compact ? { marginBottom: 0 } : undefined}>
                  <label className="form-label" htmlFor={`${uid}-service`}>
                    Service Needed *
                  </label>
                  <select
                    id={`${uid}-service`}
                    className="form-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="">Select roofing or home service...</option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {!compact && (
                  <div className="form-group">
                    <label className="form-label" htmlFor={`${uid}-window`}>
                      Preferred Callback / Visit Window
                    </label>
                    <select
                      id={`${uid}-window`}
                      className="form-input"
                      value={preferredWindow}
                      onChange={(e) => setPreferredWindow(e.target.value)}
                    >
                      {WINDOW_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Always collect Property City + Mississippi ZIP on every form mode */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor={`${uid}-city`}>
                  Property City (MS) *
                </label>
                <input
                  type="text"
                  id={`${uid}-city`}
                  className="form-input"
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  placeholder="Florence, Brandon, Jackson..."
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor={`${uid}-zip`}>
                  MS ZIP Code *
                </label>
                <input
                  type="text"
                  id={`${uid}-zip`}
                  inputMode="numeric"
                  maxLength={10}
                  className="form-input"
                  value={addressZip}
                  onChange={(e) => setAddressZip(e.target.value)}
                  placeholder="39073"
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>

            {/* Street Address: required on Emergency, optional on full Estimate */}
            {type === "emergency" && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor={`${uid}-street`}>
                    Property Street Address *
                  </label>
                  <input
                    type="text"
                    id={`${uid}-street`}
                    className="form-input"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="123 Main St"
                    autoComplete="street-address"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor={`${uid}-severity`}>
                      Damage Severity *
                    </label>
                    <select
                      id={`${uid}-severity`}
                      className="form-input"
                      value={damageSeverity}
                      onChange={(e) => setDamageSeverity(e.target.value)}
                      required
                    >
                      <option value="">Select severity...</option>
                      <option value="Active Leak / Water Intrusion">Active Leak / Water Intrusion</option>
                      <option value="Structural Roof Damage">Structural Roof Damage</option>
                      <option value="Wind / Blow-off Damage">Wind / Blow-off Damage</option>
                      <option value="Hail Inspection / Assessment">Hail Inspection / Assessment</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`${uid}-insurance`}>
                      Insurance Provider (Optional)
                    </label>
                    <input
                      type="text"
                      id={`${uid}-insurance`}
                      className="form-input"
                      value={insuranceCompany}
                      onChange={(e) => setInsuranceCompany(e.target.value)}
                      placeholder="State Farm, Farm Bureau, etc."
                    />
                  </div>
                </div>
              </>
            )}

            {type === "estimate" && !compact && (
              <div className="form-group">
                <label className="form-label" htmlFor={`${uid}-street`}>
                  Street Address (Optional — speeds up roof satellite look)
                </label>
                <input
                  type="text"
                  id={`${uid}-street`}
                  className="form-input"
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  placeholder="123 Main St"
                  autoComplete="street-address"
                />
              </div>
            )}

            {/* Message Box */}
            <div className="form-group">
              <label className="form-label" htmlFor={`${uid}-message`}>
                {type === "emergency"
                  ? "Urgent Details / Description of Damage"
                  : compact
                  ? "Brief Project Notes (Optional)"
                  : "Project Details (Optional)"}
              </label>
              <textarea
                id={`${uid}-message`}
                className="form-input"
                rows={compact ? 2 : 2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === "emergency"
                    ? "Describe where the leak is or what was damaged by storm winds/hail..."
                    : "Roof leak, storm/hail check, full roof replacement, kitchen/bath remodel..."
                }
              />
            </div>

            <button type="submit" className={buttonClass} disabled={submitting} style={{ width: "100%" }}>
              {buttonText}
            </button>

            <p className="form-disclaimer">
              100% Free, No-Obligation Estimate · Serving Jackson Metro &amp; Central MS · Never Sold or Shared
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
