import { supabaseService } from './supabase-server';
export async function putPublicArtifact(bytes: Buffer, fileName: string, contentType: string) {
  const sb = supabaseService();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${fileName}`;
  const { error } = await sb.storage.from('artifacts').upload(path, bytes, { contentType, upsert: false });
  if (error) throw error;
  const { data } = sb.storage.from('artifacts').getPublicUrl(path);
  return data.publicUrl;
}
