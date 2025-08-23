import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { kwhToRays, kwhToSolar, ONE_SOLAR_KWH } from '@/lib/units';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { description } = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const prompt = `Estimate electricity used (kWh) to create/provide this digital item or service.
Only return a number. Text: """${description ?? ''}"""`;

  let kwh = 1;
  try {
    const r = await openai.chat.completions.create({ model:'gpt-4o-mini', temperature:0.2, messages:[{role:'user',content:prompt}] });
    const text = r.choices[0]?.message?.content ?? '1';
    kwh = Math.max(0.001, parseFloat((text.match(/[\d.]+/)||['1'])[0]));
  } catch {}
  return NextResponse.json({ kwh, solar: kwhToSolar(kwh), rays: kwhToRays(kwh), note:`1 Solar = ${ONE_SOLAR_KWH} kWh` });
}
