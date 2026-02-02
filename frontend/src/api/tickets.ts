import { api } from "./client";

export async function buyTicket(eventId: string) {
  const res = await api.post("/tickets/buy", {
    eventId,
  });
  return res.data;
}
