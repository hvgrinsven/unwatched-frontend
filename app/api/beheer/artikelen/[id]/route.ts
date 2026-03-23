import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAuthenticated(): boolean {
  const token = cookies().get("beheer_auth")?.value;
  const password = process.env.BEHEER_WACHTWOORD;
  if (!token || !password) return false;
  return (
    token ===
    crypto.createHmac("sha256", password).update("beheer-session").digest("hex")
  );
}

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = (await req.json()) as Record<string, unknown>;

  const { error } = await supabaseAdmin
    .from("artikelen")
    .update(data)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("artikelen")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
