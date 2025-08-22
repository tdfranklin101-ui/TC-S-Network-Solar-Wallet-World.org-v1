import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("tcs_items")
    .select("id,title,description,rays_price")
    .eq("status","active")
    .order("created_at",{ ascending:false })
    .limit(24);
  if (error) return NextResponse.json({ items: [], error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
