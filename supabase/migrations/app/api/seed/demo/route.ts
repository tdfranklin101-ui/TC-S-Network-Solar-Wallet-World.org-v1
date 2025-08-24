import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';

export const runtime = 'nodejs';

/**
 * POST /api/seed/demo
 * Headers: Authorization: Bearer <SEED_SECRET>
 * Idempotent: will not duplicate items if titles already exist.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const secret = process.env.SEED_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const sb = supabaseService();

  // Ensure system wallets exist (just in case)
  await sb.rpc('ensure_balance', { p_wallet: 'tcs_seed_wallet' });
  await sb.rpc('ensure_balance', { p_wallet: 'tcs_foundation_wallet' });

  // Seed catalog (titles act like natural keys for idempotency)
  const seed = [
    { title:'Solar Rays Recipe Pack', desc:'10 energy-smart recipes (PDF)', kwh:12,
      img:'https://images.unsplash.com/photo-1506354666786-959d6d497f1a' },
    { title:'Ambient Music Loop', desc:'Meditative solar loops (FLAC)', kwh:74,
      img:'https://images.unsplash.com/photo-1511379938547-c1f69419868d' },
    { title:'Golden Spiral Poster', desc:'Printable A2 PDF (vector)', kwh:18,
      img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' },
    { title:'Coding Snippets Pack', desc:'Next.js/Wallet utils (zip)', kwh:30,
      img:'https://images.unsplash.com/photo-1518779578993-ec3579fee39f' },
    { title:'Digital Coupon: Coffee', desc:'Redeemable once (QR)', kwh:8,
      img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085' },
  ];

  // Upsert-by-title behavior
  for (const s of seed) {
    // Does an item with this title exist?
    const { data:exists, error:e1 } = await sb
      .from('tcs_items')
      .select('id')
      .eq('title', s.title)
      .maybeSingle();

    if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });
    if (exists) continue; // idempotent: skip

    const { error:e2 } = await sb
      .from('tcs_items')
      .insert({
        owner_wallet: 'tcs_seed_wallet',
        title: s.title,
        description: s.desc,
        image_url: s.img,
        price_kwh: s.kwh,
        status: 'active'
      });
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
