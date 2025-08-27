import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
const COOKIE = 'tcs_wallet';

export function getOrCreateWalletId() {
  const c = cookies(); let id = c.get(COOKIE)?.value;
  if (!id) { id = randomUUID(); c.set(COOKIE, id, { httpOnly:false, sameSite:'lax', secure:true, maxAge:60*60*24*365 }); }
  return id;
}
