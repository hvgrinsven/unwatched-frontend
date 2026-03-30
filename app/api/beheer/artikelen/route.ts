import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAuthenticated(): boolean {
  const token = cookies().get("beheer_auth")?.value;
  const password = process.env.BEHEER_WACHTWOORD;
  if (!token || !password) return false;
  return token === crypto.createHmac("sha256", password).update("beheer-session").digest("hex");
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json() as Record<string, unknown>;

  const { data: nieuw, error } = await supabaseAdmin
    .from("artikelen")
    .insert(data)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: nieuw.id }, { status: 201 });
}
