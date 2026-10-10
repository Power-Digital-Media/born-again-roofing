// Display-only helpers: build readable headings, titles and meta descriptions from the ORIGINAL
// project record. The stored description/title/category are never modified or rewritten; the full
// original description is still rendered verbatim on the page.
//
// Rules:
//  - An existing, meaningful enrichment title is preserved as-is.
//  - Otherwise the heading is the first complete clause of the technician/AI description.
//  - Place names inside the text are removed from the heading and the recorded city is appended
//    exactly once, so a heading never names two different cities.
//  - Headings are never cut mid-word or on a dangling word, and never end on an incomplete phrase.

type PinLike = { title?: string; service?: string; description: string; location?: string; date?: string };

const STATE = "(?:[A-Z]{2}|ms|Mississippi|Texas|Arkansas|Alabama|Louisiana|Tennessee|Georgia|Florida|Oklahoma|Missouri|Michigan)";
const PLACE_WITH_STATE = new RegExp(`\\s+(?:in|at|near)\\s+[A-Z][a-z]+(?:\\s[A-Z][a-z]+){0,2},?\\s*${STATE},?(?=[\\s.;]|$)`, "g");
const PLACE_AT_END = /\s+(?:in|at|near)\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)?$/;
const COMPANY_NAME = /born again home remodeling (?:and|&) roofing(?:,?\s*llc)?\.?/i;
const COMPANY_PREFIX = new RegExp(`^${COMPANY_NAME.source}\\s*`, "i");
const LEAD_IN_DATE = /^on [A-Za-z]+\.? \d{1,2},? \d{4},?\s*/i;
const MID_DATE = /\s+on [A-Z][a-z]+\.? \d{1,2},? \d{4},?/g;
const LEAD_IN_CITY = /^in [A-Za-z][A-Za-z ]*,\s*(?:Mississippi|[A-Za-z]{2}),?\s*/i;
const ACTOR_PREFIX = /^(?:a |the |our )?(?:roofing |general |local )?(?:contractors?|team|crew|technicians?|roofers?|workers?)(?: (?:at|from) [A-Z][\w &]*?)?,? (?=[a-z]+ed |[a-z]+s |performed|completed|replaced|installed|repaired|removed|inspected)/i;
const DANGLING = /\s+(in|at|on|for|of|and|or|the|a|an|to|with|new|old|existing|into|from|by|that|which|along|around|over|under|between|about|through|onto|near|inside|outside|so|using|while|after|because|then|also|is|are|affecting|including|causing|resulting|requiring|leading|involving|ensuring|providing|allowing|helping|showing|during|before|located|which|located)$/i;
const MAX_CLAUSE = 90;

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function trimDangling(s: string): string {
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace(/[,;:\s]+$/, "").replace(DANGLING, "");
  }
  return s;
}

function cityOf(loc?: string): string {
  return (loc || "").split(",")[0].trim();
}

/** Word-boundary clip with an ellipsis; never ends on a dangling word. */
export function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  const base = trimDangling(sp > 0 ? cut.slice(0, sp) : cut);
  return /[.!?]$/.test(base) ? base : base + "\u2026";
}

function shortenClause(s: string): string {
  if (s.length <= MAX_CLAUSE) return s;
  const window = s.slice(0, MAX_CLAUSE + 1);
  // Cut at the LAST natural clause boundary that fits (a trailing cut infinitive is removed by the caller).
  let best = -1;
  for (const m of window.matchAll(/,| and | to | for | with | after | while | because | which | that | so | using | by /g)) {
    if (m.index !== undefined && m.index >= 36) best = m.index;
  }
  if (best > 0) return s.slice(0, best);
  const sp = window.lastIndexOf(" ");
  return s.slice(0, sp > 20 ? sp : MAX_CLAUSE);
}

function isGenericTitle(pin: PinLike): boolean {
  const t = (pin.title || "").trim().toLowerCase();
  return !!t && !!pin.service && t.startsWith(pin.service.toLowerCase() + " in ");
}

export function buildHeading(pin: PinLike): string {
  const loc = (pin.location || "").trim();
  const t = (pin.title || "").trim();
  if (t && !isGenericTitle(pin)) {
    // Existing title is preserved; only a dangling "In <city>, MS," lead-in is tidied.
    return LEAD_IN_CITY.test(t) ? cap(t.replace(LEAD_IN_CITY, "")) || t : t;
  }

  const firstLine = pin.description.replace(/\\n/g, " ").split(/\n/).map((l) => l.trim()).find(Boolean) || pin.description;
  let d = firstLine.replace(/\s+/g, " ").trim();
  d = d.replace(LEAD_IN_DATE, "").replace(COMPANY_PREFIX, "").replace(LEAD_IN_CITY, "");
  d = d.replace(PLACE_WITH_STATE, "").replace(MID_DATE, "");
  d = d.replace(COMPANY_NAME, "").replace(/\s{2,}/g, " ").trim();
  d = d.replace(ACTOR_PREFIX, "").replace(LEAD_IN_CITY, "");
  d = (d.split(/(?<=[A-Za-z0-9)])\.\s+(?=[A-Z0-9])/)[0] || d).replace(/\.$/, "");
  d = d.replace(PLACE_AT_END, "");
  d = d.replace(/^(\w{4,}) (\1\w*ing)\b/i, "$2"); // "Install installing ..." -> "Installing ..."

  const before = d;
  d = shortenClause(cap(d));
  if (d !== cap(before)) d = d.replace(/\s+to\s+\w+$/i, ""); // never end on a cut infinitive ("to prepare")
  d = trimDangling(d);
  if (d.split(" ").filter(Boolean).length < 2) d = "Project completed";

  const city = cityOf(loc);
  const mentionsCity = !!city && d.toLowerCase().includes(city.toLowerCase());
  // Another bare place left mid-sentence ("... in Wesson area"): do not add a second, conflicting city.
  const otherPlace = /\b(?:in|at|near) (?!the\b|a\b|an\b)[A-Z][a-z]+\b/.test(d.replace(/^[A-Z][a-z]+/, ""));
  return mentionsCity || otherPlace || !loc ? d : `${d} in ${loc}`;
}

/** <title> text (the site template adds " | Born Again Roofing"). Prefers a complete heading over an ellipsis. */
export function buildTitle(pin: PinLike): string {
  const h = buildHeading(pin);
  if (h.length <= 72) return h;
  const noCity = h.replace(/ in [A-Z][A-Za-z ]+, [A-Z]{2}$/, "");
  if (noCity.length <= 72) return noCity;
  const cut = noCity.slice(0, 72);
  return trimDangling(cut.slice(0, cut.lastIndexOf(" ")));
}

/** Meta description derived from the original text; conflicting place names are replaced by the recorded city. */
export function buildMetaDescription(pin: PinLike): string {
  const loc = (pin.location || "").trim();
  const city = cityOf(loc);
  const mentions = (s: string) => !!city && s.toLowerCase().includes(city.toLowerCase());
  const MAX = 158;
  let text = pin.description.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
  text = text.replace(new RegExp(COMPANY_NAME.source, "gi"), "Born Again Home Remodeling and Roofing LLC");
  text = text.replace(PLACE_WITH_STATE, (m) => (mentions(m) ? m : ""));
  text = text.replace(/\s{2,}/g, " ").replace(/\s+([,.;])/g, "$1").trim();
  if (!/[.!?]$/.test(text)) text += ".";

  if (text.length < 110) {
    const tail = ` Completed ${pin.date || "recently"}${loc ? ` in ${loc}` : ""} by Born Again Home Remodeling and Roofing.`;
    return clip(text + tail, MAX);
  }
  let out = text;
  if (text.length > MAX) {
    // Prefer ending at a complete sentence.
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text];
    out = "";
    for (const s of sentences) {
      if ((out + s).trim().length > MAX) break;
      out += s;
    }
    out = out.trim();
    if (out.length < 70) out = clip(text, MAX);
  }
  const suffix = loc ? ` Project in ${loc}.` : "";
  if (loc && !mentions(out) && (out + suffix).length <= MAX) out += suffix;
  return out;
}
