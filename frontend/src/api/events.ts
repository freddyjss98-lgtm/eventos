import { api } from "./client";

export async function getEvents() {
  const res = await api.get("/events");
  return res.data;
}

export async function getEventById(id: string) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}
