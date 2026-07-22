"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

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

const authorList = [
  "Chris Smith",
  "Damien Johnston",
  "Christopher Heard",
  "Eddie Buchanan",
  "Charlie Buchanan",
  "David Heard"
];

const serviceList = [
  "Residential Roofing",
  "Metal Roofing",
  "Commercial Roofing",
  "General Remodeling",
  "Bathroom Remodeling",
  "Window Installation",
  "Privacy Fence Installation"
];

export default function DropPinPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const [geoLoading, setGeoLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Set default date to today's date format (e.g. Jul 22, 2026)
  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    setDate(today.toLocaleDateString("en-US", options));
  }, []);

  // Check authentication on load
  useEffect(() => {
    const cachedAuth = sessionStorage.getItem("roofer_pin_auth");
    if (cachedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple passcode gate (can be configured in env, default to "BornAgain2026")
    const correctPasscode = process.env.NEXT_PUBLIC_PORTAL_PASSCODE || "BornAgain2026";
    if (passcode === correctPasscode) {
      sessionStorage.setItem("roofer_pin_auth", "true");
      setIsAuthenticated(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect passcode. Please try again.");
    }
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setGeoLoading(false);

        // Deterministically find the closest city in MS to coordinates
        let closestCity = "";
        let minDistance = Infinity;

        for (const [city, coords] of Object.entries(cityCoords)) {
          const dist = Math.pow(lat - coords[0], 2) + Math.pow(lng - coords[1], 2);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = city;
          }
        }

        if (closestCity) {
          setLocation(closestCity);
        }
      },
      (error) => {
        setGeoLoading(false);
        console.error("GPS position fetch error:", error);
        alert(`Failed to fetch location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Client-side image compression helper using Canvas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const uploadedImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compress image to 800px width/height maximum
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Export compressed JPEG base64 (70% quality)
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            uploadedImages.push(dataUrl);

            if (uploadedImages.length === files.length) {
              setImages((prev) => [...prev, ...uploadedImages]);
              setIsCompressing(false);
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author || !location || !service || !description || images.length === 0) {
      setSubmitError("Please fill in all fields and upload at least one image.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");

    const payload = {
      author,
      date,
      location,
      service,
      description,
      images,
      latitude: latitude !== "" ? latitude : undefined,
      longitude: longitude !== "" ? longitude : undefined
    };

    try {
      const response = await fetch("/api/pins/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form values
        setAuthor("");
        setDescription("");
        setImages([]);
        setLatitude("");
        setLongitude("");
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || "Failed to drop pin. Try again.");
      }
    } catch (err) {
      console.error("Failed to post pin:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-backdrop">
        <div className="double-bezel-wrapper login-card">
          <div className="double-bezel-inner login-inner">
            <h2 className="title">Roofer Portal</h2>
            <p className="subtitle">Enter passcode to drop job pins</p>
            <form onSubmit={handleLogin} className="form">
              <input
                type="password"
                placeholder="Passcode"
                className="input"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
              {passcodeError && <p className="error">{passcodeError}</p>}
              <button type="submit" className="btn btn-outline submit-btn">
                Unlock Portal
              </button>
            </form>
          </div>
        </div>

        <style jsx>{`
          .login-backdrop {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            background: var(--bg);
          }
          .login-card {
            width: 100%;
            max-width: 400px;
          }
          .login-inner {
            padding: 2.5rem !important;
            text-align: center;
          }
          .title {
            color: var(--primary);
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
          }
          .subtitle {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 2rem;
          }
          .form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .input {
            width: 100%;
            padding: 0.8rem 1rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: #ffffff;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
            text-align: center;
          }
          .input:focus {
            border-color: var(--secondary);
          }
          .error {
            color: #ef4444;
            font-size: 0.82rem;
            margin: 0;
          }
          .submit-btn {
            padding: 0.85rem !important;
            font-size: 0.95rem;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <div className="container">
        
        <div className="portal-header">
          <span className="eyebrow">Power Digital</span>
          <h1>Drop Job Pin</h1>
          <p className="subtitle">Submit recent project photographs and details from the field</p>
        </div>

        {submitSuccess ? (
          <div className="double-bezel-wrapper success-card">
            <div className="double-bezel-inner success-inner">
              <span className="success-icon">🎉</span>
              <h3>Pin Dropped Successfully!</h3>
              <p>The job has been recorded and will show on the map and feed in real-time.</p>
              <div className="success-buttons">
                <button onClick={() => setSubmitSuccess(false)} className="btn btn-outline">
                  Drop Another Pin
                </button>
                <Link href="/pins/" className="btn btn-outline" style={{ background: "transparent" }}>
                  View Project Map
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="double-bezel-wrapper form-card">
            <div className="double-bezel-inner form-inner">
              <form onSubmit={handleSubmit} className="portal-form">
                
                {/* Roofer Name */}
                <div className="form-group">
                  <label className="form-label">Roofer/Technician Name</label>
                  <select
                    className="form-input"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  >
                    <option value="">Select Technician</option>
                    {authorList.map((auth) => (
                      <option key={auth} value={auth}>{auth}</option>
                    ))}
                  </select>
                </div>

                {/* Job Location */}
                <div className="form-group">
                  <label className="form-label">Location (City)</label>
                  <select
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  >
                    <option value="">Select City</option>
                    {Object.keys(cityCoords).sort().map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Service Category */}
                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <select
                    className="form-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="">Select Service Type</option>
                    {serviceList.map((svc) => (
                      <option key={svc} value={svc}>{svc}</option>
                    ))}
                  </select>
                </div>

                {/* GPS Coordinates Wrapper */}
                <div className="form-group">
                  <label className="form-label">GPS Tagging (Coordinates)</label>
                  <div className="gps-row">
                    <button
                      type="button"
                      className="btn btn-outline gps-btn"
                      onClick={getGPSLocation}
                      disabled={geoLoading}
                    >
                      {geoLoading ? "Locating..." : "📍 Get Current Coords"}
                    </button>
                    <div className="coords-display">
                      <div className="coord-field">
                        <span>Lat:</span>
                        <input
                          type="text"
                          value={latitude !== "" ? latitude.toFixed(6) : "None"}
                          disabled
                          className="coord-input"
                        />
                      </div>
                      <div className="coord-field">
                        <span>Lng:</span>
                        <input
                          type="text"
                          value={longitude !== "" ? longitude.toFixed(6) : "None"}
                          disabled
                          className="coord-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date (Read-Only/Autocompleted) */}
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="text" className="form-input" value={date} disabled />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Project Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the job. E.g., Installed a GAF Timberline HDZ architectural roof system in Byram, MS. Completed leak diagnostics near the chimney."
                    className="form-input textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Photo Upload and Capture */}
                <div className="form-group">
                  <label className="form-label">Project Photographs (1-4 images)</label>
                  <div className="upload-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      className="upload-input"
                      id="photo-upload"
                      onChange={handleImageUpload}
                      disabled={isCompressing}
                    />
                    <label htmlFor="photo-upload" className="upload-label">
                      {isCompressing ? "Processing Images..." : "📸 Take Photo / Upload"}
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="preview-grid">
                      {images.map((img, idx) => (
                        <div key={idx} className="preview-item">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Preview ${idx}`} className="preview-img" />
                          <button
                            type="button"
                            className="preview-remove"
                            onClick={() => handleRemoveImage(idx)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {submitError && <p className="submit-error">{submitError}</p>}

                {/* Form Buttons */}
                <button
                  type="submit"
                  className="btn btn-outline submit-form-btn"
                  disabled={submitLoading || isCompressing}
                >
                  {submitLoading ? "Submitting..." : "Submit Project Pin"}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .portal-container {
          background: var(--bg);
          padding: 5rem 0;
          min-height: 90vh;
        }
        .portal-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 3rem;
        }
        .eyebrow {
          color: var(--secondary);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .portal-header h1 {
          color: #ffffff;
          margin: 0.25rem 0 0.5rem;
          font-size: 2.2rem;
          font-weight: 800;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.5;
        }
        .form-card {
          max-width: 580px;
          margin: 0 auto;
        }
        .form-inner {
          padding: 2.5rem !important;
        }
        .portal-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: var(--secondary);
        }
        .form-input:disabled {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        select.form-input {
          cursor: pointer;
        }
        select.form-input option {
          background: #0f172a;
          color: #ffffff;
        }
        .textarea {
          resize: vertical;
          line-height: 1.5;
        }
        .gps-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .gps-btn {
          flex-shrink: 0;
          font-size: 0.8rem;
          padding: 0.6rem 1.2rem !important;
          background: rgba(226, 176, 71, 0.05);
        }
        .coords-display {
          display: flex;
          gap: 1rem;
          flex-grow: 1;
        }
        .coord-field {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-grow: 1;
        }
        .coord-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
        }
        .upload-wrapper {
          position: relative;
          width: 100%;
        }
        .upload-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 1.25rem;
          background: rgba(226, 176, 71, 0.03);
          border: 2px dashed rgba(226, 176, 71, 0.25);
          border-radius: 8px;
          color: var(--secondary);
          font-weight: 700;
          font-size: 0.9rem;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
        }
        .upload-label:hover {
          background: rgba(226, 176, 71, 0.06);
          border-color: var(--secondary);
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(15, 23, 42, 0.85);
          border: none;
          color: #ffffff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .preview-remove:hover {
          background: #ef4444;
        }
        .submit-error {
          color: #ef4444;
          font-size: 0.85rem;
          text-align: center;
          margin: 0;
          font-weight: 600;
        }
        .submit-form-btn {
          width: 100%;
          padding: 0.9rem !important;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }
        
        /* Success Card Styles */
        .success-card {
          max-width: 500px;
          margin: 0 auto;
        }
        .success-inner {
          padding: 3rem !important;
          text-align: center;
        }
        .success-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 1.25rem;
        }
        .success-inner h3 {
          color: var(--primary);
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .success-inner p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .success-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
