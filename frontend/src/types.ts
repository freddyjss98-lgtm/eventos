// frontend/src/types.ts
export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  imagenUrl?: string | null;
  category?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
};
