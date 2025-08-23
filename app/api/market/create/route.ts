import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase-server';
import { putPublicArtifact } from '@/lib/storage';
import { getOrCreateWalletId } from '@/lib/wallet-id';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function maybeGenAi(theme: string) {
  if (!theme) return { url: null, extraKwh: 0 };
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const img = await openai.images.generate({ model:'gpt-image-1', prompt:`Minimal square artwork themed: "${theme}"`, size:'1024x1024' });
  const b64 = img.data[0].b64_json!;
  const bytes = Buffer.from(b64, 'base64');
  const url = await putPublicArtifact(bytes, 'ai.png', 'image/png');
  return { url, extraKwh: 0.05 }; // generation footprint
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const title = (form.get('title') as string || '').trim();
  const description = (form.get('description') as string || '').trim();
  const priceMode = (form.get('priceMode') as string) || 'auto';
  const manualKwh = parseFloat((form.get('priceKwh') as string) || '0');
  const theme = (form.get('theme') as string || '').trim();
  const ai = (form.get('ai') as string) === 'on';
  const file = form.get('file') as File | null;
  if (!title) return NextResponse.json({ error:'title required' }, { status:400 });

  const wallet = getOrCreateWalletId();
  const sb = supabaseService();

  let imageUrl: string | null = null, kwhFootprint = 0;

  if (ai) {
    const { url, extraKwh } = await maybeGenAi(theme || title);
    imageUrl = url; kwhFootprint += extraKwh;
  } else if (file && file.size > 0) {
    const buf = Buffer.from(await file.arrayBuffer());
    imageUrl = await putPublicArtifact(buf, file.name || 'upload.bin', file.type || 'application/octet-stream');
    kwhFootprint += 0.01; // small storage footprint
  }

  let price_kwh = 0;
  if (priceMode === 'manual' && manualKwh > 0) {
    price_kwh = manualKwh + kwhFootprint;
  } else {
    const est = await fetch(new URL('/api/identify', req.url), { method:'POST', body: JSON.stringify({ description }) });
    const j = await est.json(); price_kwh = (j.kwh || 1) + kwhFootprint;
  }

  const { data, error } = await sb.from('tcs_items').insert({
    owner_wallet: wallet, title, description, image_url: imageUrl, price_kwh, theme, status:'active'
  }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status:500 });
  return NextResponse.json({ ok:true, id:data.id, price_kwh, imageUrl });
}
