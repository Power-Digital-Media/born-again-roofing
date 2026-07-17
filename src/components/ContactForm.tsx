"use client";

import React, { useState, useMemo } from "react";

export default function ContactForm({ type = "estimate" }: { type?: "estimate" | "emergency" | "callback" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  
  // Emergency specific fields
  const [propertyAddress, setPropertyAddress] = useState("");
  const [damageSeverity, setDamageSeverity] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const timeOptions = useMemo(() => {
    if (!date) {
      return ["Select a date first"];
    }

    const selectedDate = new Date(date + "T00:00:00");
    const day = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    if (day === 0 || day === 6) {
      return ["Closed on weekends"];
    } else {
      // Monday - Friday: 8:00 AM - 5:00 PM
      return [
        "8:00 AM - 9:00 AM",
        "9:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "12:00 PM - 1:00 PM",
        "1:00 PM - 2:00 PM",
        "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM",
        "4:00 PM - 5:00 PM"
      ];
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Form validation based on variant type
    if (type === "estimate") {
      if (!name || !phone || !date || !timeSlot) {
        setError("Please fill in all required fields.");
        return;
      }

      const selectedDate = new Date(date + "T00:00:00");
      const day = selectedDate.getDay();

      if (day === 0 || day === 6) {
        setError("We are closed on weekends. Please pick a Monday through Friday appointment.");
        return;
      }

      if (timeSlot === "Closed on weekends") {
        setError("Cannot book an estimate on a closed day.");
        return;
      }
    } else if (type === "emergency") {
      if (!name || !phone || !propertyAddress || !damageSeverity) {
        setError("Please fill in all required fields (Name, Phone, Address, and Severity).");
        return;
      }
    } else if (type === "callback") {
      if (!name || !phone) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    setSubmitting(true);

    try {
      // POST to Transpond/Capsule CRM pipeline
      const res = await fetch("/api/forms/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: type === "estimate" ? date : "",
          timeSlot: type === "estimate" ? timeSlot : "",
          message,
          propertyAddress: type === "emergency" ? propertyAddress : "",
          damageSeverity: type === "emergency" ? damageSeverity : "",
          insuranceCompany: type === "emergency" ? insuranceCompany : "",
          _form_source: type === "emergency" ? "storm-damage-emergency" : (type === "callback" ? "quick-callback" : "estimate-request"),
          page_url: typeof window !== "undefined" ? window.location.href : ""
        })
      });

      if (!res.ok) {
        throw new Error("Form submission failed");
      }

      // Trigger GA4 event tracking
      if (typeof window !== "undefined") {
        const win = window as Window & { gtag?: (event: string, action: string, params: Record<string, string | number>) => void };
        if (win.gtag) {
          win.gtag("event", "generate_lead", {
            value: type === "emergency" ? 2.0 : 1.0,
            currency: "USD",
            lead_origin: type === "emergency" ? "Emergency Form" : (type === "callback" ? "Callback Form" : "Estimate Form"),
            appointment_date: type === "estimate" ? date : "",
            appointment_time: type === "estimate" ? timeSlot : ""
          });
        }
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTimeSlot("");
      setPropertyAddress("");
      setDamageSeverity("");
      setInsuranceCompany("");
      setMessage("");
    } catch (err) {
      console.error("Form error:", err);
      setError("Something went wrong. Please call us at (601) 573-6178.");
    } finally {
      setSubmitting(false);
    }
  };

  const wrapperClass = `double-bezel-wrapper contact-form-wrapper${type === "emergency" ? " emergency-bezel" : ""}`;
  const innerClass = `double-bezel-inner contact-form-inner${type === "emergency" ? " form-emergency" : ""}${type === "callback" ? " form-callback" : ""}`;
  const formTitle = type === "emergency" ? "⚠️ Emergency Storm Dispatch" : (type === "callback" ? "Quick Callback Request" : "Request a Free Estimate");
  const buttonClass = `btn submit-btn ${type === "emergency" ? "btn-emergency" : "btn-secondary"}`;
  const buttonText = submitting ? "Submitting…" : (type === "emergency" ? "Dispatch Inspector" : (type === "callback" ? "Request Callback" : "Submit Request"));

  return (
    <div className={wrapperClass}>
      <div className={innerClass}>
        <h3 className="form-title">
          {formTitle}
        </h3>
        
        {success ? (
          <div className="success-banner">
            <h4>Thank You!</h4>
            <p>
              {type === "emergency" 
                ? "Your emergency dispatch request has been received. Our storm inspector is being notified and will call you immediately."
                : "Your request has been successfully submitted. We will contact you shortly."
              }
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            {/* Name - Rendered for all */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Phone & Email Row - Conditional */}
            {type !== "callback" ? (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Cell Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(601) 573-6178"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            ) : (
              // Callback only has Cell Phone (saves vertical space)
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Cell Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(601) 573-6178"
                  required
                />
              </div>
            )}

            {/* Emergency Specific Fields */}
            {type === "emergency" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="address">Property Address *</label>
                    <input
                      type="text"
                      id="address"
                      className="form-input"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="123 Main St, Jackson, MS"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="severity">Damage Severity *</label>
                    <select
                      id="severity"
                      className="form-input"
                      value={damageSeverity}
                      onChange={(e) => setDamageSeverity(e.target.value)}
                      required
                    >
                      <option value="">Select severity...</option>
                      <option value="Active Leak / Water intrusion">Active Leak / Water Intrusion</option>
                      <option value="Structural Roof Damage">Structural Roof Damage</option>
                      <option value="Wind / Blow-off Damage">Wind / Blow-off Damage</option>
                      <option value="Hail Inspection / Assessment">Hail Inspection / Assessment</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="insurance">Insurance Provider (Optional)</label>
                  <input
                    type="text"
                    id="insurance"
                    className="form-input"
                    value={insuranceCompany}
                    onChange={(e) => setInsuranceCompany(e.target.value)}
                    placeholder="State Farm, Allstate, etc."
                  />
                </div>
              </>
            )}

            {/* Estimate Scheduling Fields */}
            {type === "estimate" && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="date">Appointment Date *</label>
                  <input
                    type="date"
                    id="date"
                    className="form-input"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setTimeSlot(""); }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="time">Time Slot *</label>
                  <select
                    id="time"
                    className="form-input"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                  >
                    <option value="">Choose a slot</option>
                    {timeOptions.map((opt) => (
                      <option key={opt} value={opt} disabled={opt === "Closed on weekends" || opt === "Select a date first"}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Message Box */}
            <div className="form-group">
              <label className="form-label" htmlFor="message">
                {type === "emergency" 
                  ? "Urgent Details / Description of Damage" 
                  : (type === "callback" ? "How can we help you? (Optional)" : "Message / Details")
                }
              </label>
              <textarea
                id="message"
                className="form-input"
                rows={type === "callback" ? 3 : 4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={type === "emergency" 
                  ? "Describe where the leak is or what was damaged by storm winds/hail..."
                  : "Tell us about your roofing or remodeling needs..."
                }
              />
            </div>

            <button type="submit" className={buttonClass} disabled={submitting}>
              {buttonText}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
