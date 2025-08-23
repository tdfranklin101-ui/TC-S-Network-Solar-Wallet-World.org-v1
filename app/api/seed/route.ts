import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
const SEED_SECRET = process.env.SEED_SECRET;

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (!SEED_SECRET || auth !== `Bearer ${SEED_SECRET}`) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sb = supabaseService();
  const seed = [
    { title:'Solar Rays Recipe Pack', desc:'10 high-energy recipes', kwh:12, img:'https://images.unsplash.com/photo-1506354666786-959d6d497f1a' },
    { title:'Ambient Music Loop', desc:'Meditative solar loops (FLAC)', kwh:74, img:'https://images.unsplash.com/photo-1511379938547-c1f69419868d' },
    { title:'Golden Spiral Poster', desc:'Printable A2 PDF', kwh:18, img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' },
    { title:'Coding Snippets Pack', desc:'Next.js/Wallet utils', kwh:30, img:'https://images.unsplash.com/photo-1518779578993-ec3579fee39f' },
    { title:'Digital Coupon: Coffee', desc:'Redeemable once', kwh:8, img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085' },
  ];
  const rows = seed.map(s=>({ owner_wallet:'seed', title:s.title, description:s.desc, image_url:s.img, price_kwh:s.kwh, status:'active' }));
  const { error } = await sb.from('tcs_items').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true, inserted: rows.length });
}
