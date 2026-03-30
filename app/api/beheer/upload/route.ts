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

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;

  if (!file || !slug) {
    return NextResponse.json({ error: "Bestand en slug zijn verplicht" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const bestandsnaam = `${slug}.jpg`;

  const { error } = await supabaseAdmin.storage
    .from("thumbnails")
    .upload(bestandsnaam, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("Supabase Storage upload fout:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage
    .from("thumbnails")
    .getPublicUrl(bestandsnaam);

  return NextResponse.json({ url: data.publicUrl });
}
