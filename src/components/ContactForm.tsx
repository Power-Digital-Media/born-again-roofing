"use client";

import React, { useState, useMemo } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  
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

  const handleSubmit = (e: React.FormEvent) => {
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
                placeholder="Tell us about your roofing or remodeling needs..."
              />
            </div>

            <button type="submit" className="btn btn-secondary btn-island submit-btn">
              Submit Free Estimate Request
              <span className="btn-icon-wrapper">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
