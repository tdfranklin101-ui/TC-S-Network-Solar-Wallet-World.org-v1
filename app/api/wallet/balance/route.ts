import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  const { data } = await supabase.from("tcs_balances").select("rays").eq("wallet", wallet).maybeSingle();
  return NextResponse.json({ wallet, rays: data?.rays ?? 0 });
}
