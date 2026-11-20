import { NextResponse } from "next/server";
import { getCloudflareBindings } from "@/lib/cloudflare/context";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { DB } = await getCloudflareBindings();
    await DB.prepare("SELECT id FROM projects LIMIT 1").all();
    return NextResponse.json({ ok: true, message: "Cloudflare D1 tersedia." });
  } catch {
    return NextResponse.json({
      ok: false,
      kind: "cloudflare_unavailable",
      message: "Konfigurasi Cloudflare D1 belum tersedia.",
    }, { status: 503 });
  }
}
