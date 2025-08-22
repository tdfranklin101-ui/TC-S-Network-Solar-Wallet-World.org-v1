export const dynamic = "force-dynamic";

async function getItems() {
  const base = process.env.NEXT_PUBLIC_VERCEL_URL ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : "";
  const res = await fetch(`${base}/api/market/list`, { cache: "no-store" });
  try { return res.ok ? await res.json() : { items: [] }; } catch { return { items: [] }; }
}

export default async function MarketPage() {
  const { items } = await getItems();
  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Market</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it: any)=>(
          <div key={it.id} className="rounded border bg-white p-4">
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-500">{it.description}</div>
            <div className="mt-2 text-sm">Price: <b>{Number(it.rays_price).toLocaleString()}</b> Rays</div>
          </div>
        ))}
        {items.length===0 && <div className="text-gray-500">No listings yet.</div>}
      </div>
    </div>
  );
}
