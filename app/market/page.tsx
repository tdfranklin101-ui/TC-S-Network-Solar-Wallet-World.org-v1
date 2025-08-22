// app/market/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { createClient } from "@supabase/supabase-js";

export default async function MarketPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: items, error } = await supabase.from("tcs_items").select("*");

  if (error) {
    console.error(error);
    return <div>Failed to load market items</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Market</h1>
      <ul className="space-y-2">
        {items?.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            {item.name} – {item.price} Rays
          </li>
        ))}
      </ul>
    </div>
  );
}
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { supabase } from "@/lib/supabase";

export default async function MarketPage() {
  const { data, error } = await supabase
    .from("tcs_items")
    .select("id,title,description,rays_price")
    .eq("status","active")
    .order("created_at",{ ascending:false })
    .limit(24);

  const items = data ?? [];

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
