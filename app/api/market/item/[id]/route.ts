// app/api/market/item/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } } // 👈 inline the exact shape
) {
  const { id } = params;

  // TODO: real fetch here
  // const item = await getItemById(id);

  return NextResponse.json({ id });
}

