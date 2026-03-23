import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/beheer", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
  );
  res.cookies.delete("beheer_auth");
  return res;
}
