import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { getOrCreateWalletId } from '@/lib/wallet-id';

export const runtime = 'nodejs';

export default async function GET() {
  const wallet = getOrCreateWalletId();
  const sb = supabaseService();

  const { data, error } = await sb.rpc('tcs_grant_daily_gbi', { p_wallet: wallet });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }
  return NextResponse.json({ ok: true, granted: data ?? 0 });
}
