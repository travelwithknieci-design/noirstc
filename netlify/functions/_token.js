import crypto from "node:crypto";

const SECRET = process.env.AUTH_SECRET || "noir-dev-secret-change-me";
const TOKEN_LIFETIME_MS = 12 * 60 * 60 * 1000; // 12 hours

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64url(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function signToken(payload) {
  const body = { ...payload, exp: Date.now() + TOKEN_LIFETIME_MS };
  const bodyStr = base64url(JSON.stringify(body));
  const sig = crypto.createHmac("sha256", SECRET).update(bodyStr).digest("base64url");
  return `${bodyStr}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [bodyStr, sig] = token.split(".");
  const expectedSig = crypto.createHmac("sha256", SECRET).update(bodyStr).digest("base64url");
  const sigBuf = Buffer.from(sig || "");
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }
  let payload;
  try {
    payload = JSON.parse(fromBase64url(bodyStr));
  } catch {
    return null;
  }
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload;
}
