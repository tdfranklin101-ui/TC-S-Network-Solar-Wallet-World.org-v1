
'use client'
import Link from 'next/link'
export default function Home(){
  const appId = process.env.NEXT_PUBLIC_APP_ID
  const base = process.env.NEXT_PUBLIC_WORLD_LINK_BASE || 'https://world.org/mini-app'
  const deep = (p:string)=>`${base}?app_id=${appId}&path=${encodeURIComponent(p)}`
  return (<main style={{maxWidth:860,margin:'24px auto',padding:'0 16px'}}>
    <h1>TC-S • World Mini</h1>
    <div><Link href="/identify"><button>Identify</button></Link> <Link href="/market"><button>Market</button></Link> <Link href="/wallet"><button>Wallet</button></Link></div>
    <div><b>Open in World App</b>
      <p><a href={deep('/identify')}>Identify</a></p>
      <p><a href={deep('/market')}>Market</a></p>
      <p><a href={deep('/wallet')}>Wallet</a></p>
    </div>
  </main>)
}
