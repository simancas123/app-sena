import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { City, Place } from "@/data/places";
import { kindLetter } from "@/data/places";
import type { LatLng } from "@/lib/geo";

type LeafletNS = typeof import("leaflet");

export type WalkRoute = {
  coords: [number, number][];
  placeId: string;
};

type MapViewProps = {
  city: City;
  places: Place[];
  selectedId: string | null;
  userLoc: LatLng | null;
  route: WalkRoute | null;
  near: Place | null;
  itineraryPlaces?: Place[];
  onSelect: (id: string) => void;
};

function resolveLeaflet(mod: unknown): LeafletNS {
  if (mod && typeof mod === "object" && "map" in mod && typeof (mod as LeafletNS).map === "function") {
    return mod as LeafletNS;
  }
  if (mod && typeof mod === "object" && "default" in mod) {
    const nested = (mod as { default: unknown }).default;
    if (nested) return resolveLeaflet(nested);
  }
  throw new Error("mapa");
}

function token(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function MapView({ city, places, selectedId, userLoc, route, near, itineraryPlaces, onSelect }: MapViewProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletNS | null>(null);
  const onSelectRef = useRef(onSelect);
  const cityRef = useRef(city);
  const viewedCity = useRef<string | null>(null);
  onSelectRef.current = onSelect;
  cityRef.current = city;
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let dead = false;
    let map: LeafletMap | null = null;
    let observer: ResizeObserver | null = null;

    void (async () => {
      try {
        const mod = await import("leaflet");
        if (dead || !hostRef.current) return;
        const L = resolveLeaflet(mod);
        leafletRef.current = L;
        const current = cityRef.current;
        map = L.map(hostRef.current, {
          zoomControl: false,
          attributionControl: true,
        }).setView([current.lat, current.lng], current.zoom);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_4kch_1_7c0d670674dfadc8782aa980", {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);
        if (dead) {
          map.remove();
          map = null;
          return;
        }
        viewedCity.current = current.id;
        mapRef.current = map;
        observer = new ResizeObserver(() => {
          map?.invalidateSize();
        });
        observer.observe(hostRef.current);
        setReady(true);
      } catch {
        if (!dead) setFailed(true);
      }
    })();

    return () => {
      dead = true;
      observer?.disconnect();
      map?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      viewedCity.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (viewedCity.current === city.id) return;
    viewedCity.current = city.id;
    map.flyTo([city.lat, city.lng], city.zoom, { duration: 0.7 });
  }, [city.id, city.lat, city.lng, city.zoom, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !ready) return;

    const layer = L.layerGroup().addTo(map);
    const terra = token("--color-terra", "#c4563a");
    const card = token("--color-card", "#fffaf3");

    if (near) {
      L.circle([near.lat, near.lng], {
        radius: 1200,
        color: terra,
        weight: 1.5,
        dashArray: "5 7",
        fillColor: terra,
        fillOpacity: 0.06,
      }).addTo(layer);
    }

    if (userLoc) {
      L.circleMarker([userLoc.lat, userLoc.lng], {
        radius: 8,
        color: card,
        weight: 3,
        fillColor: terra,
        fillOpacity: 1,
      }).addTo(layer);
    }

    if (route && route.coords.length > 1) {
      const line = L.polyline(route.coords, {
        color: terra,
        weight: 4,
        opacity: 0.92,
      }).addTo(layer);
      map.fitBounds(line.getBounds(), { padding: [48, 48], maxZoom: 16 });
    }

    if (itineraryPlaces && itineraryPlaces.length > 1) {
      const itinCoords: [number, number][] = itineraryPlaces.map((p) => [p.lat, p.lng]);
      const itinLine = L.polyline(itinCoords, {
        color: "#00bf63",
        weight: 3,
        dashArray: "6 6",
        opacity: 0.9,
      }).addTo(layer);
      if (!route) {
        map.fitBounds(itinLine.getBounds(), { padding: [48, 48], maxZoom: 15 });
      }
    }

    const itinMap = new Map<string, number>();
    if (itineraryPlaces) {
      itineraryPlaces.forEach((p, index) => itinMap.set(p.id, index + 1));
    }

    for (const place of places) {
      const selected = place.id === selectedId;
      const itinIndex = itinMap.get(place.id);
      const iconHtml = itinIndex !== undefined
        ? `<div class="pin pin-itinerary${selected ? " is-on" : ""}">${itinIndex}</div>`
        : `<div class="pin pin-${place.kind}${selected ? " is-on" : ""}">${kindLetter[place.kind]}</div>`;

      const icon = L.divIcon({
        className: "pin-wrap",
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([place.lat, place.lng], {
        icon,
        zIndexOffset: selected ? 800 : itinIndex !== undefined ? 500 : 0,
        keyboard: false,
        title: itinIndex !== undefined ? `${itinIndex}. ${place.name}` : place.name,
      })
        .on("click", () => onSelectRef.current(place.id))
        .addTo(layer);
    }

    if (!route && selectedId && !itineraryPlaces?.length) {
      const selected = places.find((place) => place.id === selectedId);
      if (selected) map.panTo([selected.lat, selected.lng], { animate: true });
    }

    return () => {
      layer.remove();
    };
  }, [places, selectedId, userLoc, route, near, itineraryPlaces, ready]);

  return (
    <div className="relative h-full w-full">
      <div ref={hostRef} className="h-full w-full" role="application" aria-label="Mapa de lugares" />
      {failed ? (
        <p className="absolute inset-0 grid place-items-center bg-paper-2 px-6 text-center text-sm text-muted">
          El mapa no cargó. La lista de lugares sigue disponible.
        </p>
      ) : null}
      <div className="map-controls">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-line bg-card text-lg leading-none text-ink"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Acercar mapa"
        >
          +
        </button>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-line bg-card text-lg leading-none text-ink"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Alejar mapa"
        >
          −
        </button>
      </div>
      <p className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-card px-3 py-1 text-xs text-muted">
        H hotel · R restaurante · C café · B bar
      </p>
    </div>
  );
}
