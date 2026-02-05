import { supabase } from "./supabase";

export async function uploadEventImage(
  uri: string,
  eventId: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const fileExt = uri.split(".").pop() || "jpg";
  const fileName = `${eventId}.${fileExt}`;
  const filePath = `events/${fileName}`;

  const { error } = await supabase.storage
    .from("event-images")
    .upload(filePath, blob, {
      upsert: true,
      contentType: blob.type,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("event-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
