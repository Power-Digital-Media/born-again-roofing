import crypto from 'crypto';

/**
 * Service Account Authenticator for Firestore REST API
 * Uses Node.js native crypto to sign JWTs for Google Datastore / Firestore access.
 * Runs strictly server-side.
 */

export type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string | number }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }
  | { timestampValue: string }
  | { nullValue: null };

export type FirestoreFields = Record<string, FirestoreValue>;

export function getStringValue(val?: FirestoreValue): string {
  if (val && 'stringValue' in val && typeof val.stringValue === 'string') {
    return val.stringValue;
  }
  return '';
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getFirestoreAccessToken(): Promise<string | null> {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Normalize escaped newlines from environment variable strings
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const now = Math.floor(Date.now() / 1000);

  // Return cached token if valid for at least 5 more minutes
  if (cachedToken && cachedToken.expiresAt > now + 300) {
    return cachedToken.token;
  }

  try {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const claimSet = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const base64UrlEncode = (obj: object | string): string => {
      const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
      return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedClaimSet = base64UrlEncode(claimSet);
    const unsignedJwt = `${encodedHeader}.${encodedClaimSet}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedJwt);
    signer.end();

    const signature = signer
      .sign(privateKey, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const signedJwt = `${unsignedJwt}.${signature}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: signedJwt,
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('[FirestoreAdmin] Token exchange failed:', tokenRes.status, errBody);
      return null;
    }

    const tokenData = await tokenRes.json();
    cachedToken = {
      token: tokenData.access_token,
      expiresAt: now + (tokenData.expires_in || 3600),
    };

    return cachedToken.token;
  } catch (err) {
    console.error('[FirestoreAdmin] Failed to generate access token:', err);
    return null;
  }
}

/**
 * Perform an authenticated GET request on a Firestore document
 */
export async function getFirestoreDocument(
  documentPath: string
): Promise<{ ok: boolean; status: number; data: { fields?: FirestoreFields } | null }> {
  const token = await getFirestoreAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`https://firestore.googleapis.com/v1/${documentPath}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    return { ok: false, status: res.status, data: null };
  }

  const data = await res.json();
  return { ok: true, status: res.status, data };
}

/**
 * Perform an authenticated partial PATCH on a Firestore document using updateMask
 * Preserves all other fields in the document!
 */
export async function patchFirestoreDocumentFields(
  documentPath: string,
  fields: FirestoreFields
): Promise<{ ok: boolean; status: number; error?: string }> {
  const token = await getFirestoreAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fieldPaths = Object.keys(fields);
  if (fieldPaths.length === 0) {
    return { ok: true, status: 200 };
  }

  const updateMaskParams = fieldPaths
    .map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`)
    .join('&');

  const url = `https://firestore.googleapis.com/v1/${documentPath}?${updateMaskParams}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return { ok: false, status: res.status, error: errorText };
  }

  return { ok: true, status: res.status };
}

/**
 * Tenant-scoped helper: Get settings document for a client
 */
export function getSettingsDocPath(
  clientId: string,
  firebaseProjectId = process.env.FIREBASE_PROJECT_ID || 'pdm-pindrop-central'
): string {
  if (!clientId || !/^[a-zA-Z0-9_-]+$/.test(clientId)) {
    throw new Error(`Invalid clientId: "${clientId}" contains disallowed characters.`);
  }
  if (!firebaseProjectId || !/^[a-zA-Z0-9_-]+$/.test(firebaseProjectId)) {
    throw new Error(`Invalid firebaseProjectId: "${firebaseProjectId}" contains disallowed characters.`);
  }
  return `projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;
}

export async function getClientSettings(
  clientId: string,
  firebaseProjectId?: string
): Promise<{ ok: boolean; status: number; fields: FirestoreFields }> {
  const path = getSettingsDocPath(clientId, firebaseProjectId);
  const res = await getFirestoreDocument(path);
  if (!res.ok || !res.data) {
    return { ok: false, status: res.status, fields: {} };
  }
  return { ok: true, status: res.status, fields: res.data.fields || {} };
}

export async function patchClientSettings(
  clientId: string,
  fields: FirestoreFields,
  firebaseProjectId?: string
): Promise<{ ok: boolean; status: number; error?: string }> {
  const path = getSettingsDocPath(clientId, firebaseProjectId);
  return patchFirestoreDocumentFields(path, fields);
}
