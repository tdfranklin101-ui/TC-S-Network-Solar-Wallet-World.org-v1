import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { getOrCreateWalletId } from '@/lib/wallet-id';
import { ONE_SOLAR_KWH } from '@/lib/units';

export const runtime = 'nodejs';
export async function POST() {
  const wallet = getOrCreateWalletId();
  const { error, data } = await supabaseService().rpc('grant_daily_gbi', { p_wallet: wallet, p_kwh: ONE_SOLAR_KWH });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ granted: !!data });
}
