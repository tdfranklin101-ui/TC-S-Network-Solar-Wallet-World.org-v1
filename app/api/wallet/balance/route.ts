import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { getOrCreateWalletId } from '@/lib/wallet-id';

export const runtime = 'nodejs';

export default async function GET() {
  const wallet = getOrCreateWalletId();
  const sb = supabaseService();

  const { data, error } = await sb
    .from('tcs_balances')
    .select('kwh')
    .eq('wallet_id', wallet)
    .single();

  if (error) {
    // still return 0 so the UI doesn't break
    return NextResponse.json({ wallet, kwh: 0, error: error.message }, { status: 200 });
  }

  return NextResponse.json({ wallet, kwh: data?.kwh ?? 0 });
}
