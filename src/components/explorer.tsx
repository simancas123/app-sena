import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Heart,
  ListOrdered,
  LogIn,
  LocateFixed,
  MapPin,
  Search,
  Share2,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { cities, kindLabel, places, type Kind, type Place } from "@/data/places";
import { MapView, type WalkRoute } from "@/components/map-view";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  cityById,
  distanceLabel,
  haversine,
  hoursLabel,
  isOpen,
  normalize,
  walkMinutes,
  type LatLng,
} from "@/lib/geo";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";

const SAVED_KEY = "brujula.saved.v1";
const ITINERARY_KEY = "brujula.itinerary.v1";
type SortKey = "rating" | "distance" | "price";
type KindFilter = "all" | Kind;

type RouteState =
  | { status: "idle" }
  | { status: "loading"; placeId: string }
  | {
      status: "ready";
      placeId: string;
      fromLabel: string;
      meters: number;
      seconds: number;
      coords: [number, number][];
      fallback: boolean;
    };

const kindFilters: { id: KindFilter; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "hotel", label: "Hoteles" },
  { id: "restaurant", label: "Restaurantes" },
  { id: "cafe", label: "Cafés" },
  { id: "bar", label: "Bares" },
];

function useSaved() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setIds(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      /* ignore broken storage */
    }
  }, []);

  function toggle(id: string) {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }

  return { ids, toggle };
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5 text-gold" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className="size-3.5"
          strokeWidth={1.75}
          fill={index < rounded ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function PriceMarks({ level }: { level: number }) {
  return (
    <span className="tabular-nums text-muted" aria-label={`Precio ${level} de 4`}>
      <span className="text-ink">{"$".repeat(level)}</span>
      <span className="opacity-35">{"$".repeat(4 - level)}</span>
    </span>
  );
}

function useItinerary() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ITINERARY_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setIds(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      /* ignore */
    }
  }, []);

  function add(id: string) {
    setIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(next));
      return next;
    });
  }

  function remove(id: string) {
    setIds((prev) => {
      const next = prev.filter((item) => item !== id);
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggle(id: string) {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clear() {
    setIds([]);
    localStorage.removeItem(ITINERARY_KEY);
  }

  function moveUp(id: string) {
    setIds((prev) => {
      const index = prev.indexOf(id);
      if (index <= 0) return prev;
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(next));
      return next;
    });
  }

  function moveDown(id: string) {
    setIds((prev) => {
      const index = prev.indexOf(id);
      if (index < 0 || index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(next));
      return next;
    });
  }

  return { ids, add, remove, toggle, clear, moveUp, moveDown };
}

export function Explorer() {
  const currentUser = useCurrentUser();
  const [cityId, setCityId] = useState(cities[0].id);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [sort, setSort] = useState<SortKey>("rating");
  const [priceMax, setPriceMax] = useState(4);
  const [topRated, setTopRated] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nearId, setNearId] = useState<string | null>(null);
  const [photo, setPhoto] = useState(0);
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [locNote, setLocNote] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [route, setRoute] = useState<RouteState>({ status: "idle" });
  const saved = useSaved();
  const itinerary = useItinerary();
  const [showItinerary, setShowItinerary] = useState(false);

  const city = cityById(cities, cityId);
  const here = userLoc && haversine(userLoc, city) < 40000 ? userLoc : null;
  const origin = here ?? city;

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const near = places.find((place) => place.id === nearId) ?? null;

  const itineraryPlaces = useMemo(() => {
    const result: Place[] = [];
    for (const id of itinerary.ids) {
      const found = places.find((p) => p.id === id);
      if (found && found.cityId === cityId) {
        result.push(found);
      }
    }
    return result;
  }, [itinerary.ids, cityId]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    let list = places.filter((place) => place.cityId === cityId);
    if (onlySaved) list = list.filter((place) => saved.ids.includes(place.id));
    if (kind !== "all") list = list.filter((place) => place.kind === kind);
    if (priceMax < 4) list = list.filter((place) => place.price <= priceMax);
    if (topRated) list = list.filter((place) => place.rating >= 4.5);
    if (onlyOpen && now) list = list.filter((place) => isOpen(place, city.tz, now));
    if (q) {
      list = list.filter((place) =>
        normalize(
          [place.name, place.neighborhood, place.address, place.tags.join(" "), place.blurb, kindLabel[place.kind]].join(
            " ",
          ),
        ).includes(q),
      );
    }
    if (near) {
      list = list.filter(
        (place) => place.id !== near.id && place.kind !== "hotel" && haversine(place, near) <= 1600,
      );
    }
    return [...list].sort((a, b) => {
      if (sort === "price") return a.price - b.price || b.rating - a.rating;
      if (sort === "distance") return haversine(a, origin) - haversine(b, origin);
      return b.rating - a.rating || b.reviewCount - a.reviewCount;
    });
  }, [city.tz, cityId, kind, near, now, onlyOpen, onlySaved, origin, priceMax, query, saved.ids, sort, topRated]);

  const selected = places.find((place) => place.id === selectedId) ?? null;
  const activeFilters = priceMax < 4 || topRated || onlyOpen;

  function changeCity(id: string) {
    setCityId(id);
    setSelectedId(null);
    setNearId(null);
    setRoute({ status: "idle" });
    setPhoto(0);
  }

  function openPlace(id: string) {
    setSelectedId(id);
    setPhoto(0);
  }

  function seeTables(hotel: Place) {
    setNearId(hotel.id);
    setKind("all");
    setOnlySaved(false);
    setShowItinerary(false);
    setSort("distance");
    setSelectedId(null);
    setRoute({ status: "idle" });
  }

  function locate() {
    if (!navigator.geolocation) {
      setLocNote("Este navegador no comparte la ubicación.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLoc(next);
        const far = haversine(next, city) >= 40000;
        setLocNote(
          far
            ? "Estás lejos de esta ciudad. Las distancias salen del centro."
            : "Distancias desde donde estás.",
        );
      },
      () => setLocNote("No pudimos usar tu ubicación. Medimos desde el centro."),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  }

  async function routeTo(place: Place) {
    const from = here ?? { lat: city.lat, lng: city.lng };
    const fromLabel = here ? "Desde tu ubicación" : `Desde el centro de ${city.name}`;
    setRoute({ status: "loading", placeId: place.id });
    const straight: [number, number][] = [
      [from.lat, from.lng],
      [place.lat, place.lng],
    ];
    const meters = haversine(from, place);
    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 8000);
      const url = `https://router.project-osrm.org/route/v1/foot/${from.lng},${from.lat};${place.lng},${place.lat}?overview=full&geometries=geojson`;
      const response = await fetch(url, { signal: controller.signal });
      window.clearTimeout(timer);
      if (!response.ok) throw new Error("route");
      const data = (await response.json()) as {
        routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[];
      };
      const found = data.routes?.[0];
      if (!found) throw new Error("empty");
      setRoute({
        status: "ready",
        placeId: place.id,
        fromLabel,
        meters: found.distance,
        seconds: found.duration,
        coords: found.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        fallback: false,
      });
    } catch {
      setRoute({
        status: "ready",
        placeId: place.id,
        fromLabel,
        meters,
        seconds: (meters / 80) * 60,
        coords: straight,
        fallback: true,
      });
    }
  }

  async function copyAddress(place: Place) {
    const text = `${place.name} — ${place.address}`;
    try {
      await navigator.clipboard.writeText(text);
      setToast("Dirección copiada");
    } catch {
      setToast("No se pudo copiar");
    }
  }

  async function copyItineraryText() {
    if (itineraryPlaces.length === 0) return;
    const text = [
      `🗺️ ITINERARIO EN ${city.name.toUpperCase()}`,
      `Lugares a visitar (${itineraryPlaces.length}):`,
      ...itineraryPlaces.map((p, idx) => `${idx + 1}. ${p.name} (${kindLabel[p.kind]}) - ${p.neighborhood}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setToast("Itinerario copiado al portapapeles");
    } catch {
      setToast("No se pudo copiar el itinerario");
    }
  }

  const walk = route.status === "ready" ? route : null;
  const mapRoute: WalkRoute | null =
    walk && walk.placeId === selected?.id ? { coords: walk.coords, placeId: walk.placeId } : null;

  return (
    <main className="flex h-dvh flex-col bg-paper text-ink md:flex-row">
      <section
        className={cn(
          "relative order-1 h-[44dvh] min-h-0 w-full shrink-0 md:order-2 md:h-dvh md:min-w-0 md:flex-1",
          selected && "max-md:h-[34dvh]",
        )}
      >
        <MapView
          city={city}
          places={showItinerary ? itineraryPlaces : filtered}
          selectedId={selectedId}
          userLoc={here}
          route={mapRoute}
          near={near}
          itineraryPlaces={showItinerary || itineraryPlaces.length > 0 ? itineraryPlaces : undefined}
          onSelect={openPlace}
        />
      </section>

      <aside
        className={cn(
          "order-2 flex h-[56dvh] min-h-0 w-full flex-col border-t border-line bg-paper md:order-1 md:h-dvh md:w-96 md:shrink-0 md:border-t-0 md:border-r",
          selected && "max-md:h-[66dvh]",
        )}
      >
        <header className="shrink-0 space-y-3 border-b border-line px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/travel-logo.jpg"
                alt="Travel Planning"
                className="size-10 rounded-full object-cover border border-line shadow-xs shrink-0"
              />
              <div>
                <h1 className="font-display text-xl leading-none font-semibold">Travel Planning</h1>
                <p className="mt-1 text-xs text-muted">Tu guía para conocer el mundo</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant={showItinerary ? "ink" : "ghost"}
                size="sm"
                onClick={() => {
                  setShowItinerary((val) => !val);
                  setOnlySaved(false);
                  setSelectedId(null);
                }}
                aria-pressed={showItinerary}
                title="Ver itinerario de viaje"
              >
                <ListOrdered className="size-4" />
                <span className="tabular-nums font-medium">{itineraryPlaces.length}</span>
              </Button>
              <Button
                variant={onlySaved ? "ink" : "ghost"}
                size="sm"
                onClick={() => {
                  setOnlySaved((value) => !value);
                  setShowItinerary(false);
                  setSelectedId(null);
                }}
                aria-pressed={onlySaved}
                title="Ver guardados"
              >
                <Heart className="size-4" fill={onlySaved ? "currentColor" : "none"} />
                <span className="tabular-nums">{saved.ids.length}</span>
              </Button>
              {currentUser ? (
                <div className="pl-1 border-l border-line">
                  <UserButton />
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="ink" size="sm" title="Iniciar sesión o registrarse">
                    <LogIn className="size-4" />
                    <span className="hidden sm:inline">Entrar</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="scroll-row">
            {cities.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => changeCity(item.id)}
                className={cn(
                  "h-10 shrink-0 rounded-full px-3 text-sm",
                  item.id === cityId ? "bg-ink text-card" : "bg-card text-ink",
                )}
                aria-pressed={item.id === cityId}
              >
                {item.name}
              </button>
            ))}
          </div>
        </header>

        {selected ? (
          <PlaceDetail
            place={selected}
            cityTz={city.tz}
            now={now}
            photo={photo}
            saved={saved.ids.includes(selected.id)}
            inItinerary={itinerary.ids.includes(selected.id)}
            origin={origin}
            originIsUser={Boolean(here)}
            route={walk && walk.placeId === selected.id ? walk : null}
            routeLoading={route.status === "loading" && route.placeId === selected.id}
            onPhoto={setPhoto}
            onBack={() => setSelectedId(null)}
            onSave={() => saved.toggle(selected.id)}
            onItineraryToggle={() => itinerary.toggle(selected.id)}
            onRoute={() => void routeTo(selected)}
            onTables={() => seeTables(selected)}
            onCopy={() => void copyAddress(selected)}
          />
        ) : showItinerary ? (
          <ItineraryView
            city={city}
            places={itineraryPlaces}
            selectedId={selectedId}
            onSelect={openPlace}
            onMoveUp={(id) => itinerary.moveUp(id)}
            onMoveDown={(id) => itinerary.moveDown(id)}
            onRemove={(id) => itinerary.remove(id)}
            onClear={() => itinerary.clear()}
            onCopy={() => void copyItineraryText()}
            onClose={() => setShowItinerary(false)}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 space-y-3 px-4 pt-3 pb-2">
              <p className="text-sm text-muted">{city.line}</p>
              <label className="flex h-11 items-center gap-2 rounded-full border border-line bg-card px-3">
                <Search className="size-4 shrink-0 text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Busca nombre, barrio o cocina"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
                {query ? (
                  <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda">
                    <X className="size-4 text-muted" />
                  </button>
                ) : null}
              </label>
              <div className="scroll-row">
                {kindFilters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setKind(item.id)}
                    className={cn(
                      "h-10 shrink-0 rounded-full px-3 text-sm",
                      kind === item.id ? "bg-terra text-card" : "bg-card text-ink",
                    )}
                    aria-pressed={kind === item.id}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={activeFilters ? "ink" : "ghost"}
                  size="sm"
                  onClick={() => setFiltersOpen((value) => !value)}
                  aria-expanded={filtersOpen}
                >
                  Filtros
                </Button>
                <label className="ml-auto text-sm text-muted">
                  <span className="sr-only">Ordenar</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="h-10 rounded-full border border-line bg-card px-3 text-sm text-ink"
                  >
                    <option value="rating">Mejor valorados</option>
                    <option value="distance">Más cercanos</option>
                    <option value="price">Precio</option>
                  </select>
                </label>
              </div>
              {filtersOpen ? (
                <div className="space-y-3 rounded-2xl bg-card p-3">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPriceMax(level)}
                        className={cn(
                          "h-10 rounded-full px-3 text-sm",
                          priceMax === level ? "bg-ink text-card" : "bg-paper text-ink",
                        )}
                      >
                        {level === 4 ? "Cualquier precio" : `Hasta ${"$".repeat(level)}`}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <FilterToggle on={topRated} onClick={() => setTopRated((value) => !value)} label="4.5 o más" />
                    <FilterToggle
                      on={onlyOpen}
                      onClick={() => setOnlyOpen((value) => !value)}
                      label="Abiertos ahora"
                    />
                  </div>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted tabular-nums">
                  {filtered.length} {filtered.length === 1 ? "lugar" : "lugares"}
                </p>
                <button type="button" onClick={locate} className="inline-flex items-center gap-1 text-sm text-ink">
                  <LocateFixed className="size-4 text-terra" />
                  Mi ubicación
                </button>
              </div>
              {near ? (
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-paper-2 px-3 py-2 text-sm">
                  <p>Mesas a 1.6 km de {near.name}</p>
                  <button type="button" className="text-terra" onClick={() => setNearId(null)}>
                    Quitar
                  </button>
                </div>
              ) : null}
              {locNote ? <p className="text-xs text-muted">{locNote}</p> : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
                  <p className="font-display text-lg">Nada coincide</p>
                  <p className="mt-1 text-sm text-muted">Prueba otro barrio, quita filtros o cambia de ciudad.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filtered.map((place) => (
                    <li key={place.id}>
                      <PlaceCard
                        place={place}
                        cityTz={city.tz}
                        now={now}
                        saved={saved.ids.includes(place.id)}
                        inItinerary={itinerary.ids.includes(place.id)}
                        meters={haversine(place, origin)}
                        fromUser={Boolean(here)}
                        onOpen={() => openPlace(place.id)}
                        onSave={() => saved.toggle(place.id)}
                        onItineraryToggle={() => itinerary.toggle(place.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-4 text-xs text-muted">
                Precios de referencia, no tarifas en vivo. Mapa © OpenStreetMap © CARTO.
              </p>
            </div>
          </div>
        )}
      </aside>

      {toast ? (
        <p className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-card shadow-lg">
          {toast}
        </p>
      ) : null}
    </main>
  );
}

function FilterToggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn("h-10 rounded-full px-3 text-sm", on ? "bg-terra text-card" : "bg-paper text-ink")}
    >
      {label}
    </button>
  );
}

function PlaceCard({
  place,
  cityTz,
  now,
  saved,
  inItinerary,
  meters,
  fromUser,
  onOpen,
  onSave,
  onItineraryToggle,
}: {
  place: Place;
  cityTz: string;
  now: Date | null;
  saved: boolean;
  inItinerary: boolean;
  meters: number;
  fromUser: boolean;
  onOpen: () => void;
  onSave: () => void;
  onItineraryToggle: () => void;
}) {
  const open = now ? isOpen(place, cityTz, now) : null;
  return (
    <article className="flex gap-2 rounded-2xl bg-card p-2">
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 gap-3 text-left">
        <img
          src={place.photos[0]}
          alt=""
          className="size-20 shrink-0 rounded-xl object-cover"
        />
        <span className="min-w-0 py-0.5">
          <span className="block truncate font-medium">{place.name}</span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <Stars value={place.rating} />
            <span className="tabular-nums text-ink">{place.rating.toFixed(1)}</span>
            <span>({place.reviewCount.toLocaleString("es")})</span>
            <PriceMarks level={place.price} />
          </span>
          <span className="mt-1 block truncate text-xs text-muted">
            {kindLabel[place.kind]} · {place.neighborhood} · {distanceLabel(meters)}
            {fromUser ? "" : " del centro"}
          </span>
          <span className="mt-1 block truncate text-sm">{place.blurb}</span>
          {open === null ? null : (
            <span className={cn("mt-1 inline-block text-xs", open ? "text-terra-deep" : "text-muted")}>
              {open ? "Abierto ahora" : "Cerrado ahora"}
            </span>
          )}
        </span>
      </button>
      <div className="flex flex-col items-center justify-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onSave}
          aria-label={saved ? `Quitar ${place.name} de guardados` : `Guardar ${place.name}`}
          className="grid size-9 place-items-center rounded-full text-terra hover:bg-paper-2"
        >
          <Heart className="size-4" fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={onItineraryToggle}
          aria-label={inItinerary ? `Quitar ${place.name} del itinerario` : `Añadir ${place.name} al itinerario`}
          className={cn(
            "grid size-9 place-items-center rounded-full transition-colors",
            inItinerary ? "bg-terra-deep text-white" : "text-ink hover:bg-paper-2",
          )}
          title={inItinerary ? "En itinerario" : "Añadir a itinerario"}
        >
          <Calendar className="size-4" />
        </button>
      </div>
    </article>
  );
}

function ItineraryView({
  city,
  places,
  selectedId,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  onClear,
  onCopy,
  onClose,
}: {
  city: ReturnType<typeof cityById>;
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCopy: () => void;
  onClose: () => void;
}) {
  const totalMeters = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < places.length - 1; i++) {
      sum += haversine(places[i], places[i + 1]);
    }
    return sum;
  }, [places]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-3 border-b border-line px-4 pt-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold">Itinerario en {city.name}</h2>
            <p className="text-xs text-muted">
              {places.length === 0
                ? "Añade lugares para armar tu ruta"
                : `${places.length} ${places.length === 1 ? "parada" : "paradas"} · ~${distanceLabel(totalMeters)} caminata total`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar itinerario">
            <X className="size-4" />
          </Button>
        </div>

        {places.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ink" onClick={onCopy}>
              <Share2 className="size-3.5" />
              Copiar itinerario
            </Button>
            <Button size="sm" variant="ghost" onClick={onClear}>
              <Trash2 className="size-3.5 text-terra" />
              Vaciar
            </Button>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {places.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <Calendar className="mx-auto size-8 text-muted" />
            <p className="mt-2 font-display text-base font-medium">Tu itinerario está vacío</p>
            <p className="mt-1 text-xs text-muted">
              Explora la lista de hoteles, restaurantes, cafés y bares y presiona el ícono de calendario para agregarlos a tu viaje.
            </p>
            <Button className="mt-4" onClick={onClose}>
              Explorar lugares
            </Button>
          </div>
        ) : (
          <ol className="space-y-2">
            {places.map((place, index) => {
              const isFirst = index === 0;
              const isLast = index === places.length - 1;
              const selected = place.id === selectedId;

              return (
                <li
                  key={place.id}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl bg-card p-2.5 transition-all border border-transparent",
                    selected && "border-ink bg-paper-2",
                  )}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-terra-deep font-sans text-xs font-bold text-white">
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelect(place.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate text-sm font-medium">{place.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {kindLabel[place.kind]} · {place.neighborhood}
                    </span>
                  </button>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onMoveUp(place.id)}
                      disabled={isFirst}
                      aria-label="Mover arriba"
                      className="grid size-8 place-items-center rounded-full text-ink disabled:opacity-20 hover:bg-paper-2"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveDown(place.id)}
                      disabled={isLast}
                      aria-label="Mover abajo"
                      className="grid size-8 place-items-center rounded-full text-ink disabled:opacity-20 hover:bg-paper-2"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(place.id)}
                      aria-label={`Quitar ${place.name}`}
                      className="grid size-8 place-items-center rounded-full text-terra hover:bg-paper-2"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function PlaceDetail({
  place,
  cityTz,
  now,
  photo,
  saved,
  inItinerary,
  origin,
  originIsUser,
  route,
  routeLoading,
  onPhoto,
  onBack,
  onSave,
  onItineraryToggle,
  onRoute,
  onTables,
  onCopy,
}: {
  place: Place;
  cityTz: string;
  now: Date | null;
  photo: number;
  saved: boolean;
  inItinerary: boolean;
  origin: LatLng;
  originIsUser: boolean;
  route: Extract<RouteState, { status: "ready" }> | null;
  routeLoading: boolean;
  onPhoto: (index: number) => void;
  onBack: () => void;
  onSave: () => void;
  onItineraryToggle: () => void;
  onRoute: () => void;
  onTables: () => void;
  onCopy: () => void;
}) {
  const open = now ? isOpen(place, cityTz, now) : null;
  const meters = haversine(place, origin);
  const shot = place.photos[photo] ?? place.photos[0];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="relative">
        <img src={shot} alt={`${place.name} en ${place.neighborhood}`} className="h-52 w-full object-cover md:h-60" />
        <button
          type="button"
          onClick={onBack}
          className="absolute top-3 left-3 inline-flex h-10 items-center gap-1 rounded-full bg-card px-3 text-sm text-ink shadow-sm"
        >
          <ChevronLeft className="size-4" />
          Lista
        </button>
        {place.photos.length > 1 ? (
          <div className="absolute right-3 bottom-3 flex gap-2">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full bg-card text-ink shadow-sm"
              aria-label="Foto anterior"
              onClick={() => onPhoto((photo + place.photos.length - 1) % place.photos.length)}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full bg-card text-ink shadow-sm"
              aria-label="Foto siguiente"
              onClick={() => onPhoto((photo + 1) % place.photos.length)}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-wide text-terra-deep uppercase font-semibold">{kindLabel[place.kind]}</p>
            <h2 className="font-display text-3xl leading-tight font-semibold">{place.name}</h2>
            <p className="mt-1 text-sm text-muted">{place.neighborhood}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSave}
              aria-label={saved ? "Quitar de guardados" : "Guardar lugar"}
              className="grid size-11 place-items-center rounded-full bg-paper-2 text-terra"
            >
              <Heart className="size-5" fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={onItineraryToggle}
              aria-label={inItinerary ? "Quitar del itinerario" : "Añadir al itinerario"}
              className={cn(
                "grid size-11 place-items-center rounded-full transition-colors",
                inItinerary ? "bg-terra-deep text-white" : "bg-paper-2 text-ink",
              )}
              title={inItinerary ? "En el itinerario" : "Añadir al itinerario"}
            >
              <Calendar className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Stars value={place.rating} />
          <span className="font-medium tabular-nums">{place.rating.toFixed(1)}</span>
          <span className="text-muted tabular-nums">{place.reviewCount.toLocaleString("es")} reseñas</span>
          <PriceMarks level={place.price} />
          {open === null ? null : (
            <span className={open ? "text-terra-deep font-medium" : "text-muted"}>
              {open ? "Abierto" : "Cerrado"}
            </span>
          )}
        </div>

        <p className="text-base">{place.blurb}</p>
        <p className="text-sm text-muted">
          {distanceLabel(meters)} {originIsUser ? "desde donde estás" : "del centro"} · unos {walkMinutes(meters)} min a
          pie en línea recta
        </p>

        <div className="flex flex-wrap gap-2">
          <Button onClick={onRoute} disabled={routeLoading}>
            {routeLoading ? "Trazando ruta…" : "Cómo llegar"}
          </Button>
          <Button
            variant={inItinerary ? "ink" : "ghost"}
            onClick={onItineraryToggle}
            className={cn(inItinerary && "bg-terra-deep text-white hover:bg-terra-deep/90")}
          >
            <Calendar className="size-4" />
            {inItinerary ? "En itinerario" : "Añadir a itinerario"}
          </Button>
          {place.kind === "hotel" ? (
            <Button variant="ghost" onClick={onTables}>
              Mesas cerca
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onCopy}>
            Copiar dirección
          </Button>
        </div>

        {route ? (
          <div className="rounded-2xl bg-paper-2 px-3 py-3 text-sm">
            <p className="font-medium">
              {Math.max(1, Math.round(route.seconds / 60))} min a pie · {distanceLabel(route.meters)}
            </p>
            <p className="mt-1 text-muted">
              {route.fromLabel}. {route.fallback ? "Trazo en línea recta; la calle puede alargar el camino." : "Ruta a pie estimada."}
            </p>
          </div>
        ) : null}

        <p className="text-sm leading-6">{place.about}</p>

        <div className="flex flex-wrap gap-2">
          {place.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-paper-2 px-3 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-muted" />
            <div>
              <dt className="text-muted">Horario</dt>
              <dd>{hoursLabel(place)}</dd>
            </div>
          </div>
          <div className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted" />
            <div>
              <dt className="text-muted">Dirección</dt>
              <dd>{place.address}</dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
