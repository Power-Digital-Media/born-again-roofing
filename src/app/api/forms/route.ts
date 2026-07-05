import { NextRequest, NextResponse } from "next/server";

/**
 * Unified Form Handler for Born Again Home Remodeling & Roofing
 * 
 * Architecture: Transpond-first — all contact data goes to Transpond's
 * subscriber API. Transpond's built-in Capsule CRM integration (two-way sync)
 * automatically creates/updates contacts in Capsule via _capsule_* custom fields.
 * 
 * No direct Capsule API calls are needed from this route.
 */

export async function POST(request: NextRequest) {
  try {
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
      page_url = ""
    } = body;

    // Parse first/last name
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // ── Transpond API Key Check ──
    const transpondKey = process.env.TRANSPOND_API_KEY;
    if (!transpondKey) {
      console.warn("[forms] TRANSPOND_API_KEY not set — skipping CRM sync");
      return NextResponse.json(
        { success: true, warning: "CRM credentials not configured yet" },
        { status: 200 }
      );
    }

    // ── Route to correct Transpond group ──
    const groupId = parseInt(process.env.TRANSPOND_GROUP_ID || "0", 10);
    if (!groupId) {
      console.warn("[forms] TRANSPOND_GROUP_ID not set — skipping CRM sync");
      return NextResponse.json(
        { success: true, warning: "Transpond group not configured" },
        { status: 200 }
      );
    }

    // ── Build notes (markdown) for CRM activity feed ──
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "short"
    });

    const noteLines = [
      `## 📋 Free Estimate Request`,
      `**Submitted:** ${timestamp}`,
      `**Source:** ${_form_source}`,
      "",
      `**Name:** ${name}`,
      `**Phone:** ${phone}`,
      email ? `**Email:** ${email}` : "",
      date ? `**Requested Date:** ${date}` : "",
      timeSlot ? `**Time Slot:** ${timeSlot}` : "",
      service ? `**Service Interest:** ${service}` : "",
      page_url ? `**Page:** ${page_url}` : "",
      "",
      message ? `### Message\n${message}` : ""
    ].filter(Boolean).join("\n");

    // ── Build Transpond payload with Capsule sync fields ──
    const transpondPayload: Record<string, unknown> = {
      emailAddress: email || `${phone.replace(/\D/g, "")}@noemail.bornagainroofing.com`,
      firstName,
      lastName,
      groupId,
      notes: noteLines,
      tags: [
        _form_source,
        "website-lead",
        "born-again-roofing",
        ...(service ? [service.toLowerCase().replace(/\s+/g, "-")] : [])
      ],
      customFields: {
        "_capsule_firstName": firstName,
        "_capsule_lastName": lastName,
        "_capsule_name": name,
        "_capsule_person": true,
        "_capsule_phone": phone,
        "PHONE": phone,
        "SERVICE": service || _form_source,
        "APPOINTMENT_DATE": date || "",
        "APPOINTMENT_TIME": timeSlot || "",
        "MESSAGE": message || "",
        "SOURCE_URL": page_url || ""
      }
    };

    // ── POST to Transpond ──
    const transpondRes = await fetch("https://api.transpond.io/subscriber", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${transpondKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(transpondPayload)
    });

    if (!transpondRes.ok) {
      const errText = await transpondRes.text();
      console.error("[forms] Transpond error:", transpondRes.status, errText);
      // Don't fail the user's submission — just log the error
      return NextResponse.json(
        { success: true, warning: "CRM sync failed but submission recorded" },
        { status: 200 }
      );
    }

    const transpondData = await transpondRes.json();
    console.log("[forms] Transpond subscriber created/updated:", transpondData?.id || "ok");

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("[forms] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Server error processing form" },
      { status: 500 }
    );
  }
}
