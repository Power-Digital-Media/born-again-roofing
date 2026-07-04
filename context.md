# Project Context: Born Again Roofing & Remodeling

This document serves as the handoff and context file for the next AI agent session. It outlines the current state of the codebase, recent features completed, and technical specifications for the upcoming CRM integration.

---

## 🚀 Current Project Stack & Architecture
* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript
* **Styling**: Vanilla CSS (`src/app/globals.css`) for fine-grained control and high-end design aesthetics.
* **Hosting**: Configured for deployment to Netlify via GitHub.
* **GitHub Repository**: [https://github.com/Power-Digital-Media/born-again-roofing](https://github.com/Power-Digital-Media/born-again-roofing)

---

## ✨ Features Implemented & Redesigned

### 1. Faith-First AEO/GEO Portals & Service Subpages
* **Scope**: Created comprehensive Q&A educational articles for **17 service subpages** and **3 core portals** (Residential Roofing, Metal Roofing, Storm Damage Repair).
* **Themes**: Incorporates honest stewardship, transparent pricing (**Proverbs 11:1**), and quality craftsmanship (**Colossians 3:23**).
* **Optimization**: Designed to rank highly for AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and SEO. All new paths have been registered in `public/llms.txt` and `src/data/serviceArticles.tsx`.
* **Scripture Choice**:
  * **Whole House Remodeling**: Features **Ezra 5:11** (*"We are the servants of the God of heaven and earth, and we are rebuilding the house..."*).

### 2. Homepage & About Us Visual Modernization
* **Homepage**: Replaced raw emojis in the services bento grid with custom gold vector SVGs that invert color on hover. Upgraded FAQs to use double-bezel cards and gold Q badges.
* **About Us**: Styled difference cards, added expertise checklist layout dividers, and formatted David Dilmore's signature block with script-cursive typography.

### 3. Reviews Page Redesign (`src/app/reviews/page.tsx` & `src/components/ReviewsList.tsx`)
* **Asymmetrical Bento Grid**: Reviews are dynamically rendered in a responsive Bento Grid layout (`span 8`, `span 6`, `span 4`, `span 12`) using an intelligent space-filling script (`getBentoClass`) to eliminate gaps.
* **Trust Scoreboard Banner**: Centered at the top. Shows the 5.0 score, local trust checkmarks, and a gold **"See All Google Reviews"** CTA button linking to the Google Business Profile.
* **Review Cards**: Upgraded with gold SVG stars, location pin markers, and a GAF-gold quote ornament (`“`).
* **Spacious Bottom Form**: Moved the `ContactForm` to the bottom of the page in a centered `680px` container to prevent form fields from squishing or overlapping. Changed the title color to white to fix dark-mode contrast.

### 4. Project Check-in & Image Corrections
* **Fencing**: Replaced a mismatched brick chimney image with a premium wood privacy fence image (`wp_premium-privacy-fence.png`).
* **Bathroom**: Replaced a mismatched driveway SUV image with a real tile walk-in shower photo (`wp_bathroom-h.jpg`).
* **Corrupt Assets**: Fixed a 0-byte corrupt addition image reference.
* **Bento Grid Image Mappings**: Solved the issue of different service and storm damage pages displaying identical fallback images in their case studies grids. Formulated a comprehensive dictionary (`serviceBentoImages` and `subpageBentoImages`) that maps each of the 17 services, storm damage subpages, and metal roofing subpages to unique, high-quality, local job site photos corresponding to their specific category.
* **Mobile Responsive Fixes**: Addressed layout overflows, overlapping text, and vertical scoreboard line bugs on mobile devices:
  - *Grid Min-Width Shrinking*: Resized all dynamic grid layout columns from a rigid `minmax(320px/300px, 1fr)` to a flexible `minmax(280px, 1fr)`, ensuring elements adjust naturally on iPhone SE and smaller viewports without overflowing.
  - *Flex-Column Stacking Overrides*: Converted the CSS Grid `.bento-grid` container to `display: flex; flex-direction: column;` on screens under `900px` (tablets and mobiles) and set columns to `grid-column: auto`. This completely eliminates the CSS Grid bug where specifying `span 12` inside a single-column layout forced implicit column generation and stretched/clipped cards off-screen.
  - *Concentric Padding Reduction & Outer Bezel Collapse*: Configured responsive media queries to completely collapse the outer `.double-bezel-wrapper` layer on mobile devices (setting padding to 0, removing borders, and hiding background shadows), and reduced the inner `.double-bezel-inner` padding to `1.5rem 1.15rem` on mobile and `1.25rem 0.85rem` on screens under `480px`. This prevents content (especially form inputs inside `<ContactForm />`) from being severely squished into a narrow column.
  - *Mobile Split Card Fixes*: Corrected an invalid `@media (max-content-width: 991px)` query in `ServiceBentoGrid.tsx` to `@media (max-width: 991px)`, forcing the split cards' text and image columns to stack vertically at 100% width on tablet/mobile screens, rather than squeezing content into unreadable narrow columns.
  - *Mobile Scoreboard Border Reset*: Styled the reviews scoreboard panel border responsively, removing the awkward right vertical line on mobile screens and replacing it with a clean bottom border.
  - *Typography Rescaling*: Rescaled large header font sizes (`h1`, `h2`, `h3`, and hero elements) on devices under `768px` and `480px` to prevent aggressive word wrapping and clipping.
  - *Hero Section Overlay Calibration & Height Limits*: Balanced the tinted background overlays and limited image height on mobile. Reduced the dark gradient overlays to `0.45 - 0.55` (approx 50%) for dynamic service pages (where images are clean and sky-focused). On the homepage hero, we moved the background image and dark gradient overlay (`0.72 - 0.82` opacity) to a absolute pseudo-element (`::before`) capped at `520px` tall with a bottom fade directly to the page background (`var(--bg)`). This ensures the background photo only covers the hero text content, and cleanly transitions into a solid dark backdrop behind the estimate form, preventing the background wood shingle image from stretching down into a massive, cluttered vertical wall.
  - *Sleek Mobile Capsule Navbar*: Addressed layout crowding in the sticky header. We hide the redundant `.logo-text-wrapper` text brand next to the logo on mobile viewports since the company name is already clearly embedded inside the hexagon badge image. Concurrently, we reduced the capsule container padding (`0 1.25rem`) and height (`60px`) to float as a compact, balanced utility bar at the top of mobile screens.

---

## 🛠️ Upcoming Task: CRM & Telephony Integration

The next phase of development involves integrating CRM and telephony workflows. 

### Key Integration Points:
1. **Contact Form (`src/components/ContactForm.tsx`)**:
   * Currently, submissions only update local React state.
   * You need to hook this form up to send leads to the target CRM.
   * *Note*: The `ContactForm` is rendered on multiple pages:
     - Contact Us page (`src/app/contact-us/page.tsx`)
     - Reviews page (`src/components/ReviewsList.tsx`)
     - Individual service subpages.
2. **CRM Options**:
   * Standard setups for this stack typically integrate with CRM systems such as **Capsule CRM** and email marketing platforms like **Transpond**.
3. **Telephony Workflows**:
   * If integrating VoIP, **Ultatel Cloud Phones** can be linked using webhook handlers or click-to-call API triggers.

### Reference Skills Available:
* Check for the presence of the `telephony-crm-setup` skill in the agent context which provides step-by-step instructions for integrating **Ultatel**, **Transpond**, and **Capsule CRM** on a Next.js stack.
