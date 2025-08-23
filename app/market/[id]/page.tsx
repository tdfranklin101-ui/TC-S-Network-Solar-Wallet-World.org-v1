'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { kwhToRays, kwhToSolar, fmtRays, fmtSolar } from '@/lib/units';

export default function ItemPage() {
  const { id } = useParams() as { id: string };
  const R = useRouter();
  const [it,setIt]=useState<any|null>(null);
  const [err,setErr]=useState<string|undefined>();
  useEffect(()=>{ (async()=>{ const r=await fetch(`/api/market/item/${id}`); setIt((await r.json()).item); })(); },[id]);

  async function buy() {
    setErr(undefined);
    const r = await fetch('/api/market/buy', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ itemId: Number(id) }) });
    const j = await r.json(); if (!r.ok) { setErr(j.error||'Buy failed'); return; }
    R.push('/wallet');
  }
  if(!it) return <div>Loading…</div>;
  return (
    <div className="space-y-3">
      {it.image_url && <img src={it.image_url} alt="" className="w-48 h-48 object-cover rounded" />}
      <div className="text-xl font-semibold">{it.title}</div>
      <div className="text-sm opacity-80">{it.description}</div>
      <div className="text-sm">
        {fmtRays(kwhToRays(it.price_kwh))} Rays · {fmtSolar(kwhToSolar(it.price_kwh))} Solar
      </div>
      <button onClick={buy} className="px-4 py-2 bg-indigo-600 text-white rounded">Buy</button>
      {err && <div className="text-red-600 text-sm">{err}</div>}
    </div>
  );
}
