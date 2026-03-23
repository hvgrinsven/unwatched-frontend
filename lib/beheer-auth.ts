import { cookies } from "next/headers";
import crypto from "crypto";

export function beheerToken(): string {
  const password = process.env.BEHEER_WACHTWOORD ?? "";
  return crypto.createHmac("sha256", password).update("beheer-session").digest("hex");
}

export function isAuthenticated(): boolean {
  const token = cookies().get("beheer_auth")?.value;
  if (!token || !process.env.BEHEER_WACHTWOORD) return false;
  return token === beheerToken();
}
