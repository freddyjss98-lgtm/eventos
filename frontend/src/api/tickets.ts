import { api } from "./client";

export async function buyTicket(
  eventId: string,
  quantity: number
) {
  const res = await api.post("/tickets/buy", {
    eventId,
    quantity,
  });

  return res.data;
}
