'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { kwhToRays, kwhToSolar, fmtRays, fmtSolar } from '@/lib/units';

export default function Market() {
  const [items,setItems]=useState<any[]>([]); const [cursor,setCursor]=useState<string|null>(null); const [done,setDone]=useState(false);

  async function loadMore() {
    if (done) return;
    const r = await fetch('/api/market/list'+(cursor?`?cursor=${encodeURIComponent(cursor)}`:''));
    const j = await r.json();
    setItems(prev=>[...prev,...(j.items||[])]);
    setCursor(j.nextCursor); if (!j.nextCursor) setDone(true);
  }
  useEffect(()=>{ loadMore(); },[]);

  return (
    <div className="space-y-3">
      {items.map(it=>(
        <Link href={`/market/${it.id}`} key={it.id} className="block p-3 border rounded hover:bg-gray-50">
          <div className="font-medium">{it.title}</div>
          <div className="text-sm opacity-70">
            {fmtRays(kwhToRays(it.price_kwh))} Rays · {fmtSolar(kwhToSolar(it.price_kwh))} Solar
          </div>
        </Link>
      ))}
      {!done && <button onClick={loadMore} className="px-3 py-2 border rounded">Load more</button>}
      {items.length===0 && <div className="opacity-60">No listings yet.</div>}
    </div>
  );
}
