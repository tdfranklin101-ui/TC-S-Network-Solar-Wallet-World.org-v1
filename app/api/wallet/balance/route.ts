
import { NextRequest } from 'next/server'
export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')
  if(!wallet) return new Response(JSON.stringify({error:'wallet required'}),{status:400})
  const rays = 10000
  return new Response(JSON.stringify({ wallet, rays, solar: (rays/10000).toFixed(4) }), { headers: {'Content-Type':'application/json'} })
}
