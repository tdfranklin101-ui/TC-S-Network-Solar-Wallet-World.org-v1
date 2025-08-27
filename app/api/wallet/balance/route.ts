import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { getOrCreateWalletId } from '@/lib/wallet-id';

export const runtime = 'nodejs';

export async function GET() {
  const wallet = getOrCreateWalletId();
  const sb = supabaseService();

  const { data, error } = await sb
    .from('tcs_balances')
    .select('kwh')
    .eq('wallet_id', wallet)
    .single();   // <-- guarantees one row, not an array

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    walletId: wallet,
    kwh: data?.kwh ?? 0,
  });
}
