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
      page_url = "",
      addressStreet = "",
      addressCity = "",
      addressState = "",
      addressZip = "",
      damageSeverity = "",
      insuranceCompany = "",
      scheduleType = ""
    } = body;

    const fullAddress = addressStreet
      ? `${addressStreet}, ${addressCity}, ${addressState} ${addressZip}`.trim()
      : "";

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

    let noteLines = "";
    if (_form_source === "storm-damage-emergency" || _form_source === "emergency-lead") {
      noteLines = [
        `# ⚠️ URGENT STORM DAMAGE DISPATCH`,
        `**Submitted:** ${timestamp}`,
        `**Source:** ${_form_source}`,
        "",
        `**Name:** ${name}`,
        `**Phone:** ${phone}`,
        email ? `**Email:** ${email}` : "",
        fullAddress ? `**Property Address:** ${fullAddress}` : "",
        damageSeverity ? `**Damage Severity:** ${damageSeverity}` : "",
        insuranceCompany ? `**Insurance Provider:** ${insuranceCompany}` : "",
        "",
        message ? `### Message / Urgent Details\n${message}` : ""
      ].filter(Boolean).join("\n");
    } else if (_form_source === "quick-callback") {
      noteLines = [
        `## 📞 Quick Callback Request`,
        `**Submitted:** ${timestamp}`,
        `**Source:** ${_form_source}`,
        "",
        `**Name:** ${name}`,
        `**Phone:** ${phone}`,
        email ? `**Email:** ${email}` : "",
        page_url ? `**Page:** ${page_url}` : "",
        "",
        message ? `### Message / Question\n${message}` : ""
      ].filter(Boolean).join("\n");
    } else {
      let scheduleLabel = "";
      if (scheduleType === "schedule-inspection") scheduleLabel = "Inspection";
      else if (scheduleType === "schedule-call") scheduleLabel = "Call";
      else if (scheduleType === "schedule-meeting") scheduleLabel = "Meeting";

      noteLines = [
        `## 📋 Free Estimate Request`,
        `**Submitted:** ${timestamp}`,
        `**Source:** ${_form_source}`,
        "",
        `**Name:** ${name}`,
        `**Phone:** ${phone}`,
        email ? `**Email:** ${email}` : "",
        scheduleLabel ? `**Appointment Type:** ${scheduleLabel}` : "",
        date ? `**Requested Date:** ${date}` : "",
        timeSlot ? `**Time Slot:** ${timeSlot}` : "",
        service ? `**Service Interest:** ${service}` : "",
        fullAddress ? `**Property Address:** ${fullAddress}` : "",
        page_url ? `**Page:** ${page_url}` : "",
        "",
        message ? `### Message\n${message}` : ""
      ].filter(Boolean).join("\n");
    }

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
        ...(scheduleType ? [scheduleType] : []),
        ...(_form_source === "storm-damage-emergency" || _form_source === "emergency-lead" ? ["emergency-lead", "storm-damage", "emergency-request"] : []),
        ...(_form_source === "quick-callback" ? ["quick-callback"] : []),
        ...(service 
          ? service.split(", ").map((s: string) => 
              s.toLowerCase()
               .replace(/\s+\/\s+/g, "-") 
               .replace(/\s+/g, "-") 
               .replace(/[^a-z0-9-]/g, "")
            )
          : [])
      ],
      customFields: {
        "_capsule_firstName": firstName,
        "_capsule_lastName": lastName,
        "_capsule_name": name,
        "_capsule_person": true,
        "_capsule_phone": phone,
        "_capsule_Service": service || _form_source,
        "_capsule_Message": message || "",
        "_capsule_service": service || _form_source,
        "_capsule_message": message || "",
        ...(addressStreet ? { 
          "_capsule_street": addressStreet,
          "_capsule_city": addressCity,
          "_capsule_state": addressState,
          "_capsule_zip": addressZip,
          "_capsule_hasAddress": true
        } : {}),
        ...(date ? { "_capsule_Appointment_Date": date } : {}),
        ...(timeSlot ? { "_capsule_Appointment_Time": timeSlot } : {}),
        ...(damageSeverity ? { 
          "DAMAGE_SEVERITY": damageSeverity,
          "_capsule_damage_severity": damageSeverity
        } : {}),
        ...(insuranceCompany ? { 
          "INSURANCE_PROVIDER": insuranceCompany,
          "_capsule_insurance_provider": insuranceCompany
        } : {}),
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
    const subscriberId = transpondData?.id || transpondData?.Subscriber?.id || transpondData?.Subscriber?.subscriberId;
    console.log("[forms] Transpond subscriber created/updated:", subscriberId || "ok");

    // ── Attach Numeric Tag IDs to Subscriber ──
    if (subscriberId) {
      const tagMap: Record<string, number> = {
        "estimate-request": 625032,
        "emergency-request": 625033,
        "storm-damage-emergency": 625033,
        "quick-callback": 625034,
        "roof-replacement": 625088,
        "roof-repair": 625089,
        "metal-roofing": 625090,
        "storm-damage-restoration": 625091,
        "home-remodeling-additions": 625092,
        "schedule-call": 625097,
        "schedule-meeting": 625099,
        "schedule-inspection": 625100
      };

      const tagsToMatch = [
        _form_source,
        ...(scheduleType ? [scheduleType] : []),
        ...(service 
          ? service.split(", ").map((s: string) => 
              s.toLowerCase()
               .replace(/\s+\/\s+/g, "-") 
               .replace(/\s+/g, "-") 
               .replace(/[^a-z0-9-]/g, "")
            )
          : [])
      ];

      const tagIds = tagsToMatch
        .map(t => tagMap[t])
        .filter((id): id is number => id !== undefined);

      if (tagIds.length > 0) {
        try {
          const tagsRes = await fetch(`https://api.transpond.io/subscriber/${subscriberId}/tags`, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${transpondKey}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({ tags: tagIds })
          });
          if (!tagsRes.ok) {
            const tagsErrText = await tagsRes.text();
            console.error("[forms] Transpond tag attachment error:", tagsRes.status, tagsErrText);
          } else {
            console.log("[forms] Transpond tags attached successfully:", tagIds);
          }
        } catch (tagErr) {
          console.error("[forms] Error attaching tags:", tagErr);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("[forms] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Server error processing form" },
      { status: 500 }
    );
  }
}
