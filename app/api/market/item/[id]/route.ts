import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseService().from('tcs_items').select('*').eq('id', params.id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status:500 });
  if (!data) return NextResponse.json({ error:'not found' }, { status:404 });
  return NextResponse.json({ item: data });
}
