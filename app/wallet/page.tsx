'use client';
import { useEffect, useState } from 'react';
import { kwhToRays, kwhToSolar, fmtRays, fmtSolar, ONE_SOLAR_KWH } from '@/lib/units';

export default function Wallet() {
  const [kwh,setKwh] = useState(0); const [msg,setMsg] = useState<string>();

  const load = async()=>{ const r = await fetch('/api/wallet/balance'); const j = await r.json(); setKwh(j.kwh||0); };
  useEffect(()=>{ load(); },[]);

  const daily = async()=>{ const r = await fetch('/api/wallet/daily',{method:'POST'}); const j = await r.json(); setMsg(j.granted?'Granted +1 Solar':'Already claimed'); load(); };

  return (
    <div className="max-w-xl space-y-4">
      <div className="p-3 border rounded">
        <div className="text-sm opacity-70">Balance</div>
        <div className="text-lg">{fmtRays(kwhToRays(kwh))} Rays</div>
        <div className="text-sm opacity-70">{fmtSolar(kwhToSolar(kwh))} Solar</div>
      </div>
      <button onClick={daily} className="px-4 py-2 bg-emerald-600 text-white rounded">Claim +1 Solar</button>
      {msg && <div className="text-sm opacity-70">{msg}</div>}
    </div>
  );
}
