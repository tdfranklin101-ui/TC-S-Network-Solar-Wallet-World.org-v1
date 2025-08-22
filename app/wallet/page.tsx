
'use client'
import { useState } from 'react'
export default function Wallet(){
  const [wallet,setWallet]=useState('')
  const [bal,setBal]=useState<any>(null)
  const load=async()=>{
    const r=await fetch('/api/wallet/balance?wallet='+encodeURIComponent(wallet))
    const j=await r.json(); setBal(j)
  }
  return (<main style={{maxWidth:720,margin:'24px auto',padding:'0 16px'}}>
    <h1>Solar Wallet</h1>
    <input placeholder="Wallet address" value={wallet} onChange={e=>setWallet(e.target.value)} />
    <button onClick={load}>Load Balance</button>
    {bal && <p><b>{bal.solar} Solar</b> ({bal.rays} Rays)</p>}
  </main>)
}
