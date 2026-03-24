import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0"));
  const limit = Math.min(32, Math.max(1, parseInt(searchParams.get("limit") ?? "16")));

  const { data, error } = await supabase
    .from("artikelen")
    .select("*")
    .eq("gepubliceerd", true)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
