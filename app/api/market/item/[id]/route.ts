// app/api/market/item/[id]/route.ts
import { NextResponse } from 'next/server';

type Params = { id: string };

export async function GET(
  _request: Request,
  { params }: { params: Params }
) {
  const { id } = params;

  // TODO: replace with your real data fetch
  // const item = await fetchItem(id);

  return NextResponse.json({ id }); // or: return new Response(JSON.stringify(item), { headers: { 'content-type': 'application/json' }});
}


