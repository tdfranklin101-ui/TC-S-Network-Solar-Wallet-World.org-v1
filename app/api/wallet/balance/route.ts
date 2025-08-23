import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { getOrCreateWalletId } from '@/lib/wallet-id';

export const runtime = 'nodejs';
export async function GET() {
  const wallet = getOrCreateWalletId();
  const sb = supabaseService();
  const { data } = await sb.from('tcs_balances').select('kwh').eq('wallet_id', wallet).maybeSingle();
  return NextResponse.json({ wallet, kwh: data?.kwh ?? 0 });
}

}
