import { NextRequest, NextResponse } from "next/server";
import { rateLimited, clientIp } from "@/lib/pindrop-auth";

/**
 * Unified Form Handler for Born Again Home Remodeling & Roofing
 *
 * Architecture: Transpond-first — all qualified MS homeowner contact data goes
 * to Transpond's subscriber API. Transpond's built-in Capsule CRM integration
 * (two-way sync) automatically creates/updates contacts in Capsule via _capsule_* custom fields.
 */

const MS_ZIP_REGEX = /^(38[6-9]|39[0-7])\d{2}(?:-\d{4})?$/;

// Core Central MS 3-digit ZIP prefixes (Jackson Metro, Florence, Rankin, Hinds, Madison, Copiah, Simpson, Warren, Yazoo, Scott, Leake, Lincoln)
const CORE_CENTRAL_MS_PREFIXES = new Set(["390", "391", "392", "396"]);

// Verified B2B vendor cold-pitch & scam bot signatures identified in forensic CRM audit
const B2B_AND_SCAM_PATTERNS: RegExp[] = [
  /\bxactimate\b/i,
  /\b(?:construction|material|roofing)\s+takeoffs?\b/i,
  /\bestimating\s+(?:service|company|team|agency|support)\b/i,
  /\barchtri\b/i,
  /\bsigmaestimating\b/i,
  /\bvirtual\s+assistant\b/i,
  /\bappointment\s+setters?\b/i,
  /\bpay\s+per\s+(?:lead|appointment)\b/i,
  /\bexclusive\s+(?:roofing|remodeling)\s+leads\b/i,
  /\b(?:seo|web\s+design|digital\s+marketing|backlink|google\s+ads?)\s+(?:service|agency|specialist|proposal|audit)\b/i,
  /\bbookkeeping\s+(?:service|support|firm)\b/i,
  /\b5900\s+balcones\b/i,
  /around\s+your\s+area\s*\(\s*\)/i,
  /\bmake\s+an\s+enquiry\s+regarding\b/i,
  /\bkindly\s+get\s+back\s+to\s+me\s+with\s+your\s+email\b/i,
];

function isSpamOrColdPitch(fields: string[]): boolean {
  const combined = fields.join(" \n ");
  return B2B_AND_SCAM_PATTERNS.some((re) => re.test(combined));
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (rateLimited(`forms:${ip}`, 6, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many submissions from this connection. Please call us at (601) 573-6178." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const {
      name = "",
      email = "",
      phone = "",
      date = "",
      timeSlot = "",
      message = "",
      _form_source = "estimate-request",
      service = "",
      page_url = "",
      addressStreet = "",
      addressCity = "",
      addressState = "MS",
      addressZip = "",
      damageSeverity = "",
      insuranceCompany = "",
      scheduleType = "",
      website_url = "",
      formRenderedAt,
    } = body;

    // 1. Honeypot & sub-human submission speed gate
    if (
      (typeof website_url === "string" && website_url.trim().length > 0) ||
      (formRenderedAt && Number.isFinite(Number(formRenderedAt)) && Date.now() - Number(formRenderedAt) < 1500)
    ) {
      console.warn("[forms] Blocked automated bot submission (honeypot/timing)");
      return NextResponse.json({ success: true, filtered: true }, { status: 200 });
    }

    const cleanName = String(name).trim();
    const cleanPhone = String(phone).trim();
    const cleanEmail = String(email).trim();
    const cleanCity = String(addressCity).trim();
    const cleanState = String(addressState || "MS").trim().toUpperCase();
    const cleanZip = String(addressZip).trim();
    const cleanStreet = String(addressStreet).trim();
    const cleanMessage = String(message).trim();

    if (!cleanName || cleanPhone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Please provide your name and a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    // 2. Quarantine B2B vendor cold pitches & scam scripts BEFORE Formspree / Transpond / Capsule
    if (isSpamOrColdPitch([cleanName, cleanEmail, cleanMessage, cleanStreet, cleanCity])) {
      console.warn("[forms] Quarantined B2B cold pitch / spam submission:", {
        name: cleanName,
        email: cleanEmail,
      });
      return NextResponse.json({ success: true, filtered: true }, { status: 200 });
    }

    // 3. Enforce Mississippi property ZIP code gate
    const normalizedState = cleanState === "MISSISSIPPI" ? "MS" : cleanState;
    if (!MS_ZIP_REGEX.test(cleanZip) || (normalizedState && normalizedState !== "MS")) {
      return NextResponse.json(
        {
          error:
            "Born Again Home Remodeling & Roofing exclusively serves Mississippi properties (Jackson Metro & Central MS). Please enter a valid 5-digit Mississippi ZIP code (38600–39799), or call (601) 573-6178.",
        },
        { status: 422 }
      );
    }

    const zip5 = cleanZip.slice(0, 5);
    const zipPrefix = zip5.slice(0, 3);
    const isOutsideCoreRadius = !CORE_CENTRAL_MS_PREFIXES.has(zipPrefix);

    const locationSummary = [cleanStreet, cleanCity ? `${cleanCity}, MS` : "MS", zip5]
      .filter(Boolean)
      .join(", ")
      .replace(", MS, ", ", MS ");

    // ── Formspree Backup Integration (only after spam & MS gates pass!) ──
    const formspreeFormId = process.env.FORMSPREE_FORM_ID;
    if (formspreeFormId) {
      try {
        await fetch(`https://formspree.io/f/${formspreeFormId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            date,
            timeSlot,
            service,
            message: cleanMessage,
            address: locationSummary,
            outsideCoreCentralMs: isOutsideCoreRadius,
            damageSeverity,
            insuranceCompany,
            scheduleType,
            form_source: _form_source,
            page_url,
          }),
        });
        console.log("[forms] Backed up qualified MS lead to Formspree!");
      } catch (err) {
        console.error("[forms] Failed to send to Formspree backup:", err);
      }
    }

    // Parse first/last name
    const nameParts = cleanName.split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // ── Load CRM Settings ──
    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

    let transpondKey = "";
    let groupId = 0;

    try {
      const { getClientSettings, getStringValue } = await import("@/lib/firestore-admin");
      const settingsRes = await getClientSettings(clientId, firebaseProjectId);
      if (settingsRes.ok) {
        const fields = settingsRes.fields || {};
        transpondKey = getStringValue(fields.transpondApiKey);
        groupId = parseInt(getStringValue(fields.transpondGroupId) || "0", 10);
      }
    } catch (err) {
      console.error("[forms] Failed to read Transpond settings from Firestore:", err);
    }

    if (!transpondKey) {
      transpondKey = process.env.TRANSPOND_API_KEY || "";
      groupId = parseInt(process.env.TRANSPOND_GROUP_ID || "0", 10);
    }

    if (!transpondKey) {
      console.warn("[forms] Transpond API Key not set — skipping CRM sync");
      return NextResponse.json(
        { success: true, warning: "CRM credentials not configured yet" },
        { status: 200 }
      );
    }

    if (!groupId) {
      console.warn("[forms] Transpond Group ID not set — skipping CRM sync");
      return NextResponse.json(
        { success: true, warning: "Transpond group not configured" },
        { status: 200 }
      );
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "short",
    });

    const radiusBanner = isOutsideCoreRadius
      ? `⚠️ **[OUTSIDE CORE CENTRAL MS RADIUS — ZIP ${zip5}]** Verify travel distance before scheduling.`
      : "";

    let noteLines = "";
    if (_form_source === "storm-damage-emergency" || _form_source === "emergency-lead") {
      noteLines = [
        `# ⚠️ URGENT STORM DAMAGE DISPATCH`,
        radiusBanner,
        `**Submitted:** ${timestamp}`,
        `**Source:** ${_form_source}`,
        "",
        `**Name:** ${cleanName}`,
        `**Phone:** ${cleanPhone}`,
        cleanEmail ? `**Email:** ${cleanEmail}` : "",
        `**Property Location:** ${locationSummary}`,
        damageSeverity ? `**Damage Severity:** ${damageSeverity}` : "",
        insuranceCompany ? `**Insurance Provider:** ${insuranceCompany}` : "",
        page_url ? `**Page:** ${page_url}` : "",
        "",
        cleanMessage ? `### Message / Urgent Details\n${cleanMessage}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    } else if (_form_source === "quick-callback") {
      noteLines = [
        `## 📞 Quick Callback Request`,
        radiusBanner,
        `**Submitted:** ${timestamp}`,
        `**Source:** ${_form_source}`,
        "",
        `**Name:** ${cleanName}`,
        `**Phone:** ${cleanPhone}`,
        cleanEmail ? `**Email:** ${cleanEmail}` : "",
        `**Property Location:** ${locationSummary}`,
        page_url ? `**Page:** ${page_url}` : "",
        "",
        cleanMessage ? `### Message / Question\n${cleanMessage}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    } else {
      let scheduleLabel = "";
      if (scheduleType === "schedule-inspection") scheduleLabel = "On-Site Inspection";
      else if (scheduleType === "schedule-call") scheduleLabel = "Phone / Estimate Consultation";
      else if (scheduleType === "schedule-meeting") scheduleLabel = "Meeting";

      noteLines = [
        `## 📋 Free Estimate Request`,
        radiusBanner,
        `**Submitted:** ${timestamp}`,
        `**Source:** ${_form_source}`,
        "",
        `**Name:** ${cleanName}`,
        `**Phone:** ${cleanPhone}`,
        cleanEmail ? `**Email:** ${cleanEmail}` : "",
        service ? `**Service Needed:** ${service}` : "",
        `**Property Location:** ${locationSummary}`,
        scheduleLabel ? `**Request Type:** ${scheduleLabel}` : "",
        date ? `**Requested Date:** ${date}` : "",
        timeSlot ? `**Preferred Window:** ${timeSlot}` : "",
        page_url ? `**Landing Page:** ${page_url}` : "",
        "",
        cleanMessage ? `### Homeowner Notes\n${cleanMessage}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }

    // Build complete Capsule-visible summary message so zero context is lost when Transpond syncs custom fields
    const capsuleSummaryParts = [
      isOutsideCoreRadius ? `[OUTSIDE CORE CENTRAL MS RADIUS: ${cleanCity}, MS ${zip5}]` : "",
      service ? `Service: ${service}` : "",
      `Location: ${locationSummary}`,
      timeSlot ? `Window: ${timeSlot}` : "",
      date ? `Date: ${date}` : "",
      damageSeverity ? `Severity: ${damageSeverity}` : "",
      insuranceCompany ? `Insurance: ${insuranceCompany}` : "",
      cleanMessage ? `Notes: ${cleanMessage}` : "",
      page_url ? `Page: ${page_url}` : "",
    ].filter(Boolean);
    const capsuleSummaryMessage = capsuleSummaryParts.join(" | ").slice(0, 1000);

    const transpondPayload: Record<string, unknown> = {
      emailAddress: cleanEmail || `${cleanPhone.replace(/\D/g, "")}@noemail.bornagainroofing.com`,
      firstName,
      lastName,
      groupId,
      notes: noteLines,
      tags: [
        _form_source,
        "website-lead",
        "born-again-roofing",
        "ms-verified",
        ...(isOutsideCoreRadius ? ["outside-core-radius"] : ["central-ms"]),
        ...(scheduleType ? [scheduleType] : []),
        ...(_form_source === "storm-damage-emergency" || _form_source === "emergency-lead"
          ? ["emergency-lead", "storm-damage", "emergency-request"]
          : []),
        ...(_form_source === "quick-callback" ? ["quick-callback"] : []),
        ...(service
          ? service.split(", ").map((s: string) =>
              s
                .toLowerCase()
                .replace(/\s+\/\s+/g, "-")
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
            )
          : []),
      ],
      customFields: {
        _capsule_firstName: firstName,
        _capsule_lastName: lastName,
        _capsule_name: cleanName,
        _capsule_person: true,
        _capsule_phone: cleanPhone,
        _capsule_Service: service || _form_source,
        _capsule_Message: capsuleSummaryMessage,
        _capsule_service: service || _form_source,
        _capsule_message: capsuleSummaryMessage,
        _capsule_street: cleanStreet,
        _capsule_city: cleanCity,
        _capsule_state: "MS",
        _capsule_zip: zip5,
        _capsule_hasAddress: true,
        ...(damageSeverity
          ? {
              DAMAGE_SEVERITY: damageSeverity,
              _capsule_damage_severity: damageSeverity,
            }
          : {}),
        ...(insuranceCompany
          ? {
              INSURANCE_PROVIDER: insuranceCompany,
              _capsule_insurance_provider: insuranceCompany,
            }
          : {}),
        SOURCE_URL: page_url || "",
      },
    };

    const transpondRes = await fetch("https://api.transpond.io/subscriber", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${transpondKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(transpondPayload),
    });

    if (!transpondRes.ok) {
      const errText = await transpondRes.text();
      console.error("[forms] Transpond error:", transpondRes.status, errText);
      return NextResponse.json(
        { success: true, warning: "CRM sync failed but submission recorded" },
        { status: 200 }
      );
    }

    const result = await transpondRes.json().catch(() => ({}));
    return NextResponse.json(
      {
        success: true,
        subscriberId: result?.id || null,
        outsideCoreRadius: isOutsideCoreRadius,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[forms] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to process form submission. Please call (601) 573-6178." },
      { status: 500 }
    );
  }
}
