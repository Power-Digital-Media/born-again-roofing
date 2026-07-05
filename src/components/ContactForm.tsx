"use client";

import React, { useState, useMemo } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  
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
          date,
          timeSlot,
          message,
          _form_source: "estimate-request",
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
            value: 1.0,
            currency: "USD",
            lead_origin: "Estimate Form",
            appointment_date: date,
            appointment_time: timeSlot
          });
        }
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTimeSlot("");
      setMessage("");
    } catch (err) {
      console.error("Form error:", err);
      setError("Something went wrong. Please call us at (601) 573-6178.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="double-bezel-wrapper contact-form-wrapper">
      <div className="double-bezel-inner contact-form-inner">
        <h3 className="form-title">
          Request a Free Estimate
        </h3>
        
        {success ? (
          <div className="success-banner">
            <h4>Thank You!</h4>
            <p>
              Your request has been successfully submitted. We will contact you shortly to confirm your booking.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

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

            <div className="form-group">
              <label className="form-label" htmlFor="message">Message / Details</label>
              <textarea
                id="message"
                className="form-input"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your roofing or remodeling needs (e.g., shingle replacement, window leak repair)…"
              />
            </div>

            <button type="submit" className="btn btn-secondary submit-btn" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Request"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
