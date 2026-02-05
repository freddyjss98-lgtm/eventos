import { supabase } from "./supabase";

export async function uploadEventImage(
  uri: string,
  eventId: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filePath = `events/${eventId}.jpg`;

  const { error } = await supabase.storage
    .from("event-images")
    .upload(filePath, blob, {
      upsert: true,
      contentType: "image/jpeg",
    });

  if (error) {
    throw new Error("Error subiendo imagen");
  }

  const { data } = supabase.storage
    .from("event-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
