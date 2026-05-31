import jwt from "jsonwebtoken";

const SECRET  = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const EXPIRES = Number(process.env.JWT_EXPIRES_IN ?? 28800);

export interface AdminPayload {
  id:    string;
  email: string;
  name:  string;
  role:  string; // "admin" | "editor"
}

export function signJWT(payload: AdminPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

export function verifyJWT(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = "ecadellabs_admin";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge:   EXPIRES,
  path:     "/",
};
