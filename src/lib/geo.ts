import type { City, Place } from "@/data/places";

export type LatLng = { lat: number; lng: number };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function haversine(a: LatLng, b: LatLng): number {
  const r = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function distanceLabel(meters: number): string {
  if (meters < 950) return `${Math.max(10, Math.round(meters / 10) * 10)} m`;
  const km = meters / 1000;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function walkMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

export function isOpen(place: Place, tz: string, now: Date): boolean {
  if (place.alwaysOpen) return true;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const day = WEEKDAYS.indexOf(weekday);
  if ((place.hours.closed ?? []).includes(day)) return false;
  const [openH, openM] = place.hours.open.split(":").map(Number);
  const [closeH, closeM] = place.hours.close.split(":").map(Number);
  const current = hour * 60 + minute;
  const start = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  if (end === start) return true;
  if (end > start) return current >= start && current < end;
  return current >= start || current < end;
}

export function hoursLabel(place: Place): string {
  if (place.alwaysOpen) return "Recepción abierta las 24 h";
  const span = `${place.hours.open} – ${place.hours.close}`;
  const closed = place.hours.closed ?? [];
  if (!closed.length) return span;
  return `${span} · cierra ${closed.map((day) => DAY_NAMES[day]).join(" y ")}`;
}

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function cityById(cities: City[], id: string): City {
  const city = cities.find((item) => item.id === id);
  if (!city) throw new Error(`Ciudad desconocida: ${id}`);
  return city;
}
