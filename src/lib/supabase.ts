import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload a file to Supabase Storage.
 * Falls back to a local object URL when Supabase is not configured.
 */
export async function uploadMedia(
  file: File,
  projectId: string
): Promise<string> {
  if (!supabase) {
    // Local fallback: return a temporary object URL
    return URL.createObjectURL(file);
  }

  const ext = file.name.split(".").pop();
  const path = `${projectId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("audit-media")
    .upload(path, file, { upsert: false });

  if (error) {
    // Bucket não configurado ou sem permissão — usa URL local temporária
    console.warn("[upload] Supabase falhou, usando URL local:", error.message);
    return URL.createObjectURL(file);
  }

  const { data } = supabase.storage.from("audit-media").getPublicUrl(path);
  return data.publicUrl;
}
