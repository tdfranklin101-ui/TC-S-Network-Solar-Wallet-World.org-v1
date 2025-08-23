import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { getOrCreateWalletId } from '@/lib/wallet-id';

export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  const actor = getOrCreateWalletId();
  const { toWallet, kwh, memo } = await req.json();
  if (!toWallet || !kwh || kwh <= 0) return NextResponse.json({ error: 'toWallet & positive kwh required' }, { status: 400 });
  const { error } = await supabaseService().rpc('apply_transfer', { p_from: actor, p_to: toWallet, p_kwh: kwh, p_memo: memo ?? 'transfer', p_kind: 'transfer' });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
