import { api } from "./client";

export async function getEvents() {
  const res = await api.get("/events");
  return res.data;
}

export async function getEventById(id: string) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

export async function getNearbyEvents(lat: number, lng: number, radius = 10) {
  const res = await api.get("/events/nearby", {
    params: { lat, lng, radius },
  });
  return res.data;
}