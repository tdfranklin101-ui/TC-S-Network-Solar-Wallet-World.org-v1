"use client";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async (w: string) => {
    setLoading(true);
    const res = await fetch(`/api/wallet/balance?wallet=${encodeURIComponent(w)}`);
    const json = await res.json();
    setBalance(json.rays ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const w = url.searchParams.get("wallet") ?? "";
    if (w) { setWallet(w); fetchBalance(w); }
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Wallet</h1>
      <div className="flex gap-2">
        <input value={wallet} onChange={(e)=>setWallet(e.target.value)}
               placeholder="wallet id (e.g., wallet_demo_123)"
               className="border rounded px-3 py-2 w-full"/>
        <button onClick={()=>wallet && fetchBalance(wallet)} className="rounded bg-sky-600 text-white px-4 py-2">Load</button>
      </div>
      <div className="rounded border bg-white p-4">
        {loading ? "Loading…" : balance !== null ? (
          <div><div className="text-sm text-gray-500">Rays balance</div>
          <div className="text-3xl font-semibold">{balance.toLocaleString()}</div></div>
        ) : "Enter a wallet and click Load"}
      </div>
    </div>
  );
}
