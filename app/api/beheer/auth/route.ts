import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function sessionToken(password: string): string {
  return crypto.createHmac("sha256", password).update("beheer-session").digest("hex");
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { wachtwoord?: string };
  const expected = process.env.BEHEER_WACHTWOORD;

  if (!expected || body.wachtwoord !== expected) {
    return NextResponse.json({ error: "Ongeldig wachtwoord" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("beheer_auth", sessionToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 uur
    path: "/",
  });
  return res;
}
