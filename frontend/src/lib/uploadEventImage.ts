// frontend/src/lib/uploadEventImage.ts
import { supabase } from "./supabase";

/**
 * Sube una imagen al bucket "event-images".
 * - Si pasas eventId, el archivo será events/{eventId}.{ext} (ideal para upsert).
 * - Si no pasas eventId, se usa timestamp para crear un nombre único.
 */
export async function uploadEventImage(
  uri: string,
  eventId?: string,
  upsert = false
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const mime = blob.type || "image/jpeg";
  // Try to detect extension from MIME or from uri
  const extFromMime = mime.split("/")[1];
  const extFromUri = uri.split(".").pop();
  const ext = extFromMime || extFromUri || "jpg";

  const fileName = eventId ? `${eventId}.${ext}` : `${Date.now()}.${ext}`;
  const filePath = `events/${fileName}`;

  const { error } = await supabase.storage
    .from("event-images")
    .upload(filePath, blob, {
      upsert,
      contentType: mime,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("event-images").getPublicUrl(filePath);
  return data.publicUrl;
}
