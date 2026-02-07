// frontend/src/api/events.ts
import { api } from "./client";
import { Event } from "../types";

export async function getEvents(): Promise<Event[]> {
  const res = await api.get("/events");
  return res.data as Event[];
}

export async function getEventById(id: string): Promise<Event> {
  const res = await api.get(`/events/${id}`);
  return res.data as Event;
}

export async function getNearbyEvents(
  lat: number,
  lng: number,
  radius = 10
): Promise<Event[]> {
  const res = await api.get("/events/nearby", {
    params: { lat, lng, radius },
  });
  return res.data as Event[];
}
