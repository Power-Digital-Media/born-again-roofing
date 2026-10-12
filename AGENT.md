# Pin Drop & Born Again Roofing — Agent Handoff Log

**Last Updated:** October 11, 2026  
**Active Production Deploy ID:** `6acc596be1c3c9000808f2a4` (Published: 2026-10-12T03:53:01Z)  
**Active Production Commit:** `ba36374542472a7a2ae4981ad25eca5cf4da5bd4` (`ba36374`)  
**Production Rollback Target:** `a8c4105f557252b1bdba25680ccdf07033239086` (`a8c4105`) / Netlify Deploy `6aca32a07693205670a44052`  
**Git Branch Status:** `master` is clean and in sync with `origin/master`.

---

## 1. What Was Completed & Deployed

### A. Two-Tier Role Authentication (`tech` vs `admin`)
1. **Technician Workflow Preserved:**
   * Field technicians share a single roofer passcode (`BornAgain2026` or the custom passcode stored in Firestore).
   * **No individual accounts, no usernames, and zero workflow disruptions for crews in the field.**
   * Login via `POST /api/auth/login` returns `{ success: true, role: "tech", token }`.
   * Field crews have direct access to geocode, take/upload photos (`/api/upload`), and submit project pins (`/api/pins/`).
2. **Administrator Role:**
   * Entering `PINDROP_ADMIN_PASSCODE` issues a token with `{ role: "admin", token }`.
   * Unlocks the Unified Integrations panel in `/admin/drop-pin` (Google Maps sync, Transpond CRM keys, review URL, roofer passcode reset).
3. **Hard Security Boundary on Sensitive Endpoints:**
   * The following routes enforce `requireAdminSession()` unconditionally (regardless of `PINDROP_AUTH_ENFORCED`):
     * `GET` & `POST` `/api/auth/transpond/settings`
     * `GET` `/api/auth/google/locations`
     * `GET` `/api/auth/google/login`
   * Calls from unauthenticated users return `401 Unauthorized`.
   * Calls from technicians return `403 Forbidden`.

### B. Authenticated Firestore Settings Helper
* Located in `src/lib/firestore-admin.ts`.
* Uses Node's native `crypto` to sign RS256 JWT assertions for Google OAuth token exchange (`https://oauth2.googleapis.com/token`) with scope `https://www.googleapis.com/auth/datastore`.
* Tokens are cached in-memory and automatically refreshed when within 5 minutes of expiration.
* **Non-Destructive Partial Updates:** Uses the Firestore REST `updateMask` query parameter to patch only specified fields (e.g. Google tokens), preserving Transpond settings, selected GBP location ID, and team technician lists.
* **Multi-Tenant Isolation:** Strictly targets `settings/born-again-roofing` under `pdm-pindrop-central` via `PDM_CLIENT_ID`.

### C. Secure Google Business Profile OAuth Flow
* **Initiation:**
  * Administrator clicks "Connect Maps Profile" in `/admin/drop-pin`.
  * Frontend executes an authenticated `fetch('/api/auth/google/login')` with `Authorization: Bearer <admin_token>` and `Accept: application/json`.
  * **No session tokens are passed in URL query strings.**
  * Server validates admin role, sets an HTTP-only, secure, SameSite=Lax cookie `gmb_oauth_state` (`path=/api/auth/google`), and returns `{ url: <google_oauth_url> }`.
  * Browser redirects to Google consent screen.
* **Callback Security:**
  * Google redirects back to `/api/auth/google/callback?code=...&state=...`.
  * Route compares `state` against `gmb_oauth_state` cookie.
  * Forged, unauthenticated, or technician-initiated callbacks fail closed with HTTP 307 redirect and an error notice (`Security check failed`).
  * On valid admin callback: exchanges code for Google tokens, patches `settings/born-again-roofing` in Firestore, and redirects to `/admin/drop-pin?google_sync=success`.

---

## 2. Production Netlify Environment Variables

All 10 required environment variables are configured and verified active in Netlify:
* `FIREBASE_PROJECT_ID`: `pdm-pindrop-central`
* `FIREBASE_CLIENT_EMAIL`: `pin-drop-settings-server@pdm-pindrop-central.iam.gserviceaccount.com`
* `FIREBASE_PRIVATE_KEY`: Secret RSA private key PEM block
* `PDM_CLIENT_ID`: `born-again-roofing`
* `PINDROP_SESSION_SECRET`: 32-byte cryptographically secure random base64 secret
* `PINDROP_ADMIN_PASSCODE`: Masked administrator secret passcode
* `GOOGLE_CLIENT_ID`: Google OAuth client ID (`credible-runner-447821-k5`)
* `GOOGLE_CLIENT_SECRET`: Masked Google client secret
* `TRANSPOND_API_KEY`: Masked Transpond integration key
* `TRANSPOND_GROUP_ID`: Transpond audience group ID

---

## 3. Current External Blocker / Pending Item

* **Google Business Profile API Quota:**
  * Google Support Case: `5-9192000041345`
  * Initial GBP API quota is `0 req/min` pending Google business verification (standard 7–10 business day timeline).
  * **Current behavior:** OAuth account connection and token saving to Firestore succeed. However, querying location lists or publishing live GBP posts will return a quota exceeded error until Google completes the case review and approves the quota increase.
  * **Transpond publishing and CRM lead capture are 100% operational.**

---

## 4. Key Files to Know

* `src/lib/pindrop-auth.ts`: Two-tier role definitions (`tech` vs `admin`), token signing/verification, and `requireAdminSession()`.
* `src/lib/firestore-admin.ts`: Service account authenticator, `getClientSettings()`, and non-destructive `patchClientSettings()`.
* `src/app/admin/drop-pin/page.tsx`: Technician pin drop portal, photo upload, and role-gated Unified Integrations accordion.
* `src/app/api/auth/login/route.ts`: Evaluates admin passcode vs roofer technician passcode, returns signed role tokens.
* `src/app/api/auth/google/login/route.ts`: Admin-only OAuth initiation route.
* `src/app/api/auth/google/callback/route.ts`: OAuth callback with CSRF cookie verification.
* `src/app/api/auth/transpond/settings/route.ts`: Admin-only settings reader/writer.
* `src/app/api/forms/route.ts`: Public website contact form handler syncing to Transpond / Capsule CRM.

---

## 5. Instructions for Next Agent

* **Do not modify Firebase security rules:** Pin Drop client code relies on existing collection security settings.
* **Do not bypass `requireAdminSession()`:** Any new settings or administrative routes must be protected with `requireAdminSession()`.
* **Field tech passcodes:** Keep technician login single-field and frictionless unless the client explicitly instructs to roll out multi-user technician authentication.
* **If rolling back:** Instant rollback is deploy ID `6aca32a07693205670a44052` / commit `a8c4105`.
