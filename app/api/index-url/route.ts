import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

export async function POST(req: NextRequest) {
  // Authenticatie: controleer geheime header
  const secret = req.headers.get("x-indexing-secret");
  if (secret !== process.env.INDEXING_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Haal URL op uit de body
  let url: string;
  try {
    const body = await req.json() as { url?: unknown };
    if (typeof body.url !== "string" || !body.url) {
      return NextResponse.json({ error: "Missing or invalid url" }, { status: 400 });
    }
    url = body.url;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Bouw Google service account credentials op uit env vars
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/\\n/g, "\n")
    .replace(/\r/g, "");
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !privateKey) {
    console.error("Google service account credentials ontbreken");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      }
    );

    const data = await response.json() as unknown;

    if (!response.ok) {
      console.error("Google Indexing API fout:", data);
      return NextResponse.json({ error: "Indexing API fout", details: data }, { status: 502 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Indexing API aanroep mislukt:", message);
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 });
  }
}
