import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { getOrCreateWalletId } from '@/lib/wallet-id';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const buyer = getOrCreateWalletId();
  const { itemId } = await req.json();
  const sb = supabaseService();

  const { data:item, error:e1 } = await sb.from('tcs_items').select('id,owner_wallet,price_kwh,status').eq('id', itemId).maybeSingle();
  if (e1) return NextResponse.json({ error:e1.message }, { status:500 });
  if (!item || item.status !== 'active') return NextResponse.json({ error:'item unavailable' }, { status:400 });

  const { error:e2 } = await sb.rpc('apply_transfer', { p_from: buyer, p_to: item.owner_wallet, p_kwh: item.price_kwh, p_memo:`buy item #${item.id}`, p_kind:'order' });
  if (e2) return NextResponse.json({ error:e2.message }, { status:400 });

  const { error:e3 } = await sb.from('tcs_orders').insert({
    buyer_wallet: buyer, seller_wallet: item.owner_wallet, item_id: item.id, amount_kwh: item.price_kwh, status:'settled'
  });
  if (e3) return NextResponse.json({ error:e3.message }, { status:500 });

  return NextResponse.json({ ok:true });
}
