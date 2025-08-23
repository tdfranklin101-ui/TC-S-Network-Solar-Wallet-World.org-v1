import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const sb = supabaseService();
  const url = new URL(req.url);
  const cursor = url.searchParams.get('cursor'); // created_at ISO
  let q = sb.from('tcs_items').select('id,title,price_kwh,image_url,created_at').eq('status','active').order('created_at',{ascending:false}).limit(20);
  if (cursor) q = q.lt('created_at', cursor);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status:500 });
  return NextResponse.json({ items: data ?? [], nextCursor: data?.length ? data[data.length-1].created_at : null });
}
