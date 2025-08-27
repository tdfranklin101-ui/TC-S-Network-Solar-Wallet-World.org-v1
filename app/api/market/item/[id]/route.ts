iimport { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const sb = supabaseService();

  const { data, error } = await sb
    .from('tcs_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}
