export type Kind = "hotel" | "restaurant" | "cafe" | "bar";

export type Review = {
  name: string;
  stars: number;
  text: string;
};

export type Place = {
  id: string;
  cityId: string;
  kind: Kind;
  name: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  price: 1 | 2 | 3 | 4;
  priceNote: string;
  tags: string[];
  blurb: string;
  about: string;
  hours: { open: string; close: string; closed?: number[] };
  alwaysOpen?: boolean;
  amenities: string[];
  photos: string[];
  reviews: Review[];
};

export type City = {
  id: string;
  name: string;
  country: string;
  tz: string;
  lat: number;
  lng: number;
  zoom: number;
  line: string;
};

export const kindLabel: Record<Kind, string> = {
  hotel: "Hotel",
  restaurant: "Restaurante",
  cafe: "Café",
  bar: "Bar",
};

export const kindLetter: Record<Kind, string> = {
  hotel: "H",
  restaurant: "R",
  cafe: "C",
  bar: "B",
};

export const cities: City[] = [
  {
    id: "bog",
    name: "Bogotá",
    country: "Colombia",
    tz: "America/Bogota",
    lat: 4.711,
    lng: -74.072,
    zoom: 13,
    line: "La Candelaria, Chapinero y el centro histórico.",
  },
  {
    id: "med",
    name: "Medellín",
    country: "Colombia",
    tz: "America/Bogota",
    lat: 6.247,
    lng: -75.566,
    zoom: 13,
    line: "El Poblado, Laureles y la comuna 13.",
  },
  {
    id: "ctg",
    name: "Cartagena",
    country: "Colombia",
    tz: "America/Bogota",
    lat: 10.399,
    lng: -75.514,
    zoom: 14,
    line: "Ciudad amurallada, Getsemaní y la bahía.",
  },
  {
    id: "cal",
    name: "Cali",
    country: "Colombia",
    tz: "America/Bogota",
    lat: 3.451,
    lng: -76.532,
    zoom: 13,
    line: "San Antonio, Granada y el ritmo de la salsa.",
  },
];

export const places: Place[] = [
  // ——— Bogotá ———
  {
    id: "hotel-casa-deco",
    cityId: "bog",
    kind: "hotel",
    name: "Hotel Casa Deco",
    neighborhood: "La Candelaria",
    address: "Calle 12C # 2-36, La Candelaria",
    lat: 4.5965,
    lng: -74.0732,
    rating: 4.6,
    reviewCount: 1240,
    price: 3,
    priceNote: "Habitación desde $280.000 COP",
    tags: ["Colonial", "Centro", "Diseño"],
    blurb: "Casona colonial convertida en hotel boutique en pleno centro histórico.",
    about:
      "Patio interior, habitaciones con detalle artesanal y a pocos pasos de la Plaza de Bolívar y el Museo del Oro.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Desayuno", "Terraza", "Wifi", "Recepción 24 h"],
    photos: ["/places/hotel-courtyard.jpg", "/places/hotel-tiles.jpg"],
    reviews: [
      {
        name: "Camila R.",
        stars: 5,
        text: "Despertar con vista al patio y salir caminando a todo el centro. Perfecto.",
      },
      {
        name: "Andrés M.",
        stars: 4,
        text: "Habitaciones pequeñas pero con mucho carácter. Ideal para 2-3 noches.",
      },
    ],
  },
  {
    id: "four-seasons-bogota",
    cityId: "bog",
    kind: "hotel",
    name: "Four Seasons Casa Medina",
    neighborhood: "Chapinero",
    address: "Carrera 7 # 69A-22, Chapinero",
    lat: 4.653,
    lng: -74.057,
    rating: 4.8,
    reviewCount: 1890,
    price: 4,
    priceNote: "Habitación desde $850.000 COP",
    tags: ["Lujo", "Chapinero", "Histórico"],
    blurb: "Mansión histórica de lujo en el corazón de Chapinero.",
    about:
      "Arquitectura republicana, jardines internos y servicio impecable. Una de las mejores experiencias hoteleras de Bogotá.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Spa", "Restaurante", "Bar", "Wifi", "Recepción 24 h"],
    photos: ["/places/Four Seasons Casa Medina.jpg", "/places/CasaMedina.avif"],
    reviews: [
      {
        name: "Elena V.",
        stars: 5,
        text: "El edificio es una joya. El desayuno y la atención superan las expectativas.",
      },
    ],
  },
  {
    id: "andres-carne-de-res",
    cityId: "bog",
    kind: "restaurant",
    name: "Andrés Carne de Res",
    neighborhood: "Chía",
    address: "Calle 3 # 11A-56, Chía",
    lat: 4.862,
    lng: -74.041,
    rating: 4.6,
    reviewCount: 18500,
    price: 3,
    priceNote: "Desde $90.000 COP por persona",
    tags: ["Carne", "Ambiente", "Fiesta"],
    blurb: "El clásico bogotano: carne, música y ambiente de fiesta.",
    about:
      "Icono de la comida y la celebración en Colombia. Ideal para ir en grupo y quedarse hasta tarde.",
    hours: { open: "12:00", close: "02:00" },
    amenities: ["Música en vivo", "Terraza", "Estacionamiento", "Wifi"],
    photos: ["/places/Carnederes1.jpg", "/places/CarnederesA.jpg"],
    reviews: [
      {
        name: "Laura P.",
        stars: 5,
        text: "No es solo un restaurante, es una experiencia completa.",
      },
      {
        name: "Diego S.",
        stars: 4,
        text: "Caro pero vale la pena al menos una vez.",
      },
    ],
  },
  {
    id: "criterion",
    cityId: "bog",
    kind: "restaurant",
    name: "Criterion",
    neighborhood: "Chapinero",
    address: "Calle 69A # 5-75, Chapinero",
    lat: 4.651,
    lng: -74.055,
    rating: 4.8,
    reviewCount: 2100,
    price: 4,
    priceNote: "Menú degustación desde $320.000 COP",
    tags: ["Alta cocina", "Francesa", "Chapinero"],
    blurb: "Alta cocina franco-colombiana de los hermanos Rausch.",
    about:
      "Uno de los restaurantes más premiados de Colombia. Técnica impecable y productos locales.",
    hours: { open: "12:30", close: "22:30", closed: [0, 1] },
    amenities: ["Reserva", "Menú degustación", "Maridaje", "Terraza"],
    photos: ["/places/dish-fine.jpg", "/places/dish-mole.jpg"],
    reviews: [
      {
        name: "Sofía G.",
        stars: 5,
        text: "Cada plato es una obra. El servicio también es excelente.",
      },
    ],
  },
  {
    id: "cafe-san-alberto",
    cityId: "bog",
    kind: "cafe",
    name: "Café San Alberto",
    neighborhood: "Chapinero",
    address: "Calle 70 # 5-24, Chapinero",
    lat: 4.649,
    lng: -74.058,
    rating: 4.7,
    reviewCount: 980,
    price: 2,
    priceNote: "Café desde $12.000 COP",
    tags: ["Especialidad", "Origen", "Chapinero"],
    blurb: "Café de origen colombiano con tostión propia.",
    about:
      "Uno de los mejores lugares para probar café de especialidad en Bogotá. Ambiente tranquilo y buena atención.",
    hours: { open: "08:00", close: "19:00" },
    amenities: ["Wifi", "Terraza", "Métodos filtrados"],
    photos: ["/places/CafeSanAlberto.jpeg", "/places/CafeSanAlberto2.jpeg"],
    reviews: [
      {
        name: "Sofía V.",
        stars: 5,
        text: "El V60 de Huila es excelente. Vuelvo siempre.",
      },
    ],
  },
  {
    id: "amor-perfecto",
    cityId: "bog",
    kind: "cafe",
    name: "Amor Perfecto",
    neighborhood: "Usaquén",
    address: "Carrera 6 # 119-25, Usaquén",
    lat: 4.703,
    lng: -74.031,
    rating: 4.6,
    reviewCount: 1450,
    price: 2,
    priceNote: "Café desde $11.000 COP",
    tags: ["Especialidad", "Usaquén", "Brunch"],
    blurb: "Café de especialidad y brunch en el norte de Bogotá.",
    about:
      "Tostión propia y un menú de brunch muy completo. Ideal para mañanas de fin de semana.",
    hours: { open: "08:00", close: "20:00" },
    amenities: ["Wifi", "Brunch", "Pastelería"],
    photos: ["/places/Amorperfecto.jpg", "/places/Amor.jpg"],
    reviews: [
      {
        name: "Juan C.",
        stars: 5,
        text: "El flat white y el avocado toast son imbatibles.",
      },
    ],
  },
  {
    id: "theatron",
    cityId: "bog",
    kind: "bar",
    name: "Theatron",
    neighborhood: "Chapinero",
    address: "Calle 58 # 10-32, Chapinero",
    lat: 4.641,
    lng: -74.064,
    rating: 4.5,
    reviewCount: 3200,
    price: 2,
    priceNote: "Entrada + consumos desde $50.000 COP",
    tags: ["Discoteca", "LGBT+", "Chapinero"],
    blurb: "La discoteca más grande de Latinoamérica, varios ambientes en uno.",
    about:
      "Varios salones con distintos estilos de música. Ideal para salir de noche en Bogotá.",
    hours: { open: "22:00", close: "05:00", closed: [1, 2] },
    amenities: ["Múltiples pistas", "Bar", "Ambiente diverso"],
    photos: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80",
    ],
    reviews: [
      {
        name: "Mateo L.",
        stars: 5,
        text: "Siempre hay algo pasando. Hay que ir al menos una vez.",
      },
    ],
  },
  {
    id: "el-violonchelo",
    cityId: "bog",
    kind: "bar",
    name: "El Violonchelo",
    neighborhood: "Chapinero",
    address: "Calle 60 # 5-39, Chapinero",
    lat: 4.644,
    lng: -74.06,
    rating: 4.6,
    reviewCount: 870,
    price: 2,
    priceNote: "Cócteles desde $35.000 COP",
    tags: ["Cócteles", "Música", "Chapinero"],
    blurb: "Bar de cócteles con buena música y ambiente íntimo.",
    about:
      "Ideal para una noche más relajada. Carta de cócteles creativa y buena selección de vinos.",
    hours: { open: "18:00", close: "02:00", closed: [0] },
    amenities: ["Cócteles", "Música en vivo", "Terraza"],
    photos: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-tapas.jpg",
    ],
    reviews: [
      {
        name: "Valentina R.",
        stars: 5,
        text: "El ambiente es perfecto y los cócteles están muy bien logrados.",
      },
    ],
  },

  // ——— Medellín ———
  {
    id: "click-clack-hotel",
    cityId: "med",
    kind: "hotel",
    name: "Click Clack Hotel",
    neighborhood: "El Poblado",
    address: "Calle 11A # 31A-35, El Poblado",
    lat: 6.208,
    lng: -75.567,
    rating: 4.6,
    reviewCount: 2100,
    price: 3,
    priceNote: "Habitación desde $320.000 COP",
    tags: ["Diseño", "Poblado", "Terraza"],
    blurb: "Hotel de diseño en el corazón de El Poblado.",
    about:
      "Ambiente joven, terraza con buena vista y ubicación perfecta para explorar Medellín.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Terraza", "Restaurante", "Wifi", "Recepción 24 h"],
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-terrace.jpg",
    ],
    reviews: [
      {
        name: "Valentina C.",
        stars: 5,
        text: "Ubicación y diseño impecables. El desayuno es muy bueno.",
      },
    ],
  },
  {
    id: "charlee-hotel",
    cityId: "med",
    kind: "hotel",
    name: "The Charlee Hotel",
    neighborhood: "El Poblado",
    address: "Calle 9A # 37-16, El Poblado",
    lat: 6.209,
    lng: -75.569,
    rating: 4.7,
    reviewCount: 1650,
    price: 4,
    priceNote: "Habitación desde $480.000 COP",
    tags: ["Lujo", "Poblado", "Vista"],
    blurb: "Hotel de lujo con vistas espectaculares de la ciudad.",
    about:
      "Diseño contemporáneo, piscina en la azotea y una de las mejores ubicaciones de El Poblado.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Piscina", "Spa", "Restaurante", "Bar", "Wifi"],
    photos: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    reviews: [
      {
        name: "Carlos M.",
        stars: 5,
        text: "La vista desde la piscina al atardecer no tiene precio.",
      },
    ],
  },
  {
    id: "carmen-restaurante",
    cityId: "med",
    kind: "restaurant",
    name: "Carmen",
    neighborhood: "El Poblado",
    address: "Calle 9 # 43B-29, El Poblado",
    lat: 6.2095,
    lng: -75.568,
    rating: 4.7,
    reviewCount: 1850,
    price: 4,
    priceNote: "Menú degustación desde $280.000 COP",
    tags: ["Alta cocina", "Colombiana", "Poblado"],
    blurb: "Alta cocina colombiana con productos locales.",
    about:
      "Uno de los restaurantes más reconocidos de Medellín. Reservar con anticipación.",
    hours: { open: "12:00", close: "22:00", closed: [0, 1] },
    amenities: ["Reserva", "Menú degustación", "Maridaje"],
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-fish.jpg",
    ],
    reviews: [
      {
        name: "Juan P.",
        stars: 5,
        text: "Cada plato cuenta una historia de Colombia. Excelente.",
      },
    ],
  },
  {
    id: "el-cielo",
    cityId: "med",
    kind: "restaurant",
    name: "El Cielo",
    neighborhood: "El Poblado",
    address: "Calle 7 # 43A-25, El Poblado",
    lat: 6.207,
    lng: -75.57,
    rating: 4.8,
    reviewCount: 2400,
    price: 4,
    priceNote: "Menú degustación desde $350.000 COP",
    tags: ["Alta cocina", "Sensorial", "Poblado"],
    blurb: "Experiencia gastronómica sensorial de Juan Manuel Barrientos.",
    about:
      "Menú degustación que juega con los sentidos. Una de las experiencias más originales de Colombia.",
    hours: { open: "12:30", close: "22:00", closed: [0] },
    amenities: ["Reserva", "Menú degustación", "Maridaje"],
    photos: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-fine.jpg",
    ],
    reviews: [
      {
        name: "Ana L.",
        stars: 5,
        text: "Nunca había comido algo así. Una experiencia completa.",
      },
    ],
  },
  {
    id: "pergamino-cafe",
    cityId: "med",
    kind: "cafe",
    name: "Pergamino Café",
    neighborhood: "El Poblado",
    address: "Carrera 37 # 8A-37, El Poblado",
    lat: 6.21,
    lng: -75.57,
    rating: 4.8,
    reviewCount: 2400,
    price: 2,
    priceNote: "Café desde $10.000 COP",
    tags: ["Especialidad", "Origen", "Poblado"],
    blurb: "Referente del café de especialidad en Medellín.",
    about:
      "Tostión propia y métodos de preparación cuidadosos. Ambiente ideal para trabajar o conversar.",
    hours: { open: "08:00", close: "20:00" },
    amenities: ["Wifi", "Métodos filtrados", "Pastelería"],
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-terrace.jpg",
    ],
    reviews: [
      {
        name: "Ana M.",
        stars: 5,
        text: "El mejor flat white de la ciudad. Siempre vuelvo.",
      },
    ],
  },
  {
    id: "urbano-cafe",
    cityId: "med",
    kind: "cafe",
    name: "Urbano Café",
    neighborhood: "Laureles",
    address: "Carrera 70 # 44A-20, Laureles",
    lat: 6.245,
    lng: -75.593,
    rating: 4.5,
    reviewCount: 920,
    price: 2,
    priceNote: "Café desde $9.000 COP",
    tags: ["Especialidad", "Laureles", "Brunch"],
    blurb: "Café de barrio con muy buen ambiente en Laureles.",
    about:
      "Ideal para trabajar o reunirse. Buena carta de brunch y café de especialidad.",
    hours: { open: "08:00", close: "19:00" },
    amenities: ["Wifi", "Brunch", "Terraza"],
    photos: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-tiles.jpg",
    ],
    reviews: [
      {
        name: "Diego R.",
        stars: 4,
        text: "Buen café y ambiente tranquilo. Perfecto para trabajar.",
      },
    ],
  },
  {
    id: "velvet-club",
    cityId: "med",
    kind: "bar",
    name: "Velvet Club",
    neighborhood: "El Poblado",
    address: "Calle 10 # 40-15, El Poblado",
    lat: 6.2085,
    lng: -75.566,
    rating: 4.4,
    reviewCount: 1800,
    price: 3,
    priceNote: "Entrada + consumos desde $60.000 COP",
    tags: ["Discoteca", "Electrónica", "Poblado"],
    blurb: "Uno de los clubs más reconocidos de la noche de Medellín.",
    about:
      "Música electrónica y ambiente sofisticado. Ideal para una noche de baile en El Poblado.",
    hours: { open: "22:00", close: "04:00", closed: [0, 1] },
    amenities: ["DJ", "Bar", "Ambiente premium"],
    photos: [
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    ],
    reviews: [
      {
        name: "Laura M.",
        stars: 4,
        text: "Buena música y ambiente. Llega temprano si quieres evitar la fila.",
      },
    ],
  },

  // ——— Cartagena ———
  {
    id: "hotel-santa-clara",
    cityId: "ctg",
    kind: "hotel",
    name: "Hotel Sofitel Legend Santa Clara",
    neighborhood: "Centro Histórico",
    address: "Calle del Torno # 39-29, Centro",
    lat: 10.425,
    lng: -75.551,
    rating: 4.8,
    reviewCount: 3200,
    price: 4,
    priceNote: "Habitación desde $1.200.000 COP",
    tags: ["Lujo", "Histórico", "Colonial"],
    blurb: "Convento del siglo XVII convertido en hotel de lujo.",
    about:
      "Uno de los hoteles más emblemáticos de Cartagena. Patio colonial, spa y ubicación privilegiada dentro de las murallas.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Piscina", "Spa", "Restaurante", "Bar", "Wifi"],
    photos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-courtyard.jpg",
    ],
    reviews: [
      {
        name: "María F.",
        stars: 5,
        text: "El patio y la piscina son un sueño. Servicio de primer nivel.",
      },
    ],
  },
  {
    id: "casa-san-agustin",
    cityId: "ctg",
    kind: "hotel",
    name: "Casa San Agustín",
    neighborhood: "Centro Histórico",
    address: "Calle de la Unidad # 36-44, Centro",
    lat: 10.423,
    lng: -75.549,
    rating: 4.9,
    reviewCount: 1450,
    price: 4,
    priceNote: "Habitación desde $950.000 COP",
    tags: ["Boutique", "Colonial", "Lujo"],
    blurb: "Hotel boutique de lujo en tres casas coloniales unidas.",
    about:
      "Diseño impecable, piscina en el centro y una de las mejores experiencias de Cartagena.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Piscina", "Spa", "Restaurante", "Wifi", "Concierge"],
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-tiles.jpg",
    ],
    reviews: [
      {
        name: "Andrés G.",
        stars: 5,
        text: "El hotel más hermoso en el que he estado. Detalles perfectos.",
      },
    ],
  },
  {
    id: "carmen-cartagena",
    cityId: "ctg",
    kind: "restaurant",
    name: "Carmen Cartagena",
    neighborhood: "Centro Histórico",
    address: "Calle del Colegio # 34-14, Centro",
    lat: 10.424,
    lng: -75.55,
    rating: 4.7,
    reviewCount: 1680,
    price: 4,
    priceNote: "Menú desde $180.000 COP",
    tags: ["Alta cocina", "Caribeña", "Centro"],
    blurb: "Cocina caribeña contemporánea en el centro histórico.",
    about:
      "Productos del Caribe colombiano con técnica moderna. Ambiente elegante y servicio excelente.",
    hours: { open: "12:00", close: "22:00", closed: [0] },
    amenities: ["Reserva", "Terraza", "Maridaje"],
    photos: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-fish.jpg",
    ],
    reviews: [
      {
        name: "Camila S.",
        stars: 5,
        text: "El pescado y los cócteles son excepcionales. Reservar con tiempo.",
      },
    ],
  },
  {
    id: "la-cocina-de-pepina",
    cityId: "ctg",
    kind: "restaurant",
    name: "La Cocina de Pepina",
    neighborhood: "Getsemaní",
    address: "Calle de la Sierpe # 10-36, Getsemaní",
    lat: 10.418,
    lng: -75.545,
    rating: 4.6,
    reviewCount: 980,
    price: 2,
    priceNote: "Platos desde $35.000 COP",
    tags: ["Tradicional", "Caribeña", "Getsemaní"],
    blurb: "Comida típica cartagenera en un ambiente auténtico.",
    about:
      "Recetas tradicionales de la costa en un local pequeño y con mucho sabor. Ideal para probar la comida local.",
    hours: { open: "12:00", close: "21:00", closed: [1] },
    amenities: ["Ambiente local", "Precios justos"],
    photos: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-tacos.jpg",
    ],
    reviews: [
      {
        name: "Pedro L.",
        stars: 5,
        text: "La mejor comida típica que probé en Cartagena. Sencillo y delicioso.",
      },
    ],
  },
  {
    id: "epoca-cafe",
    cityId: "ctg",
    kind: "cafe",
    name: "Época Café",
    neighborhood: "Centro Histórico",
    address: "Calle San Juan de Dios # 3-24, Centro",
    lat: 10.422,
    lng: -75.548,
    rating: 4.5,
    reviewCount: 720,
    price: 2,
    priceNote: "Café desde $10.000 COP",
    tags: ["Especialidad", "Centro", "Brunch"],
    blurb: "Café de especialidad en una casona del centro histórico.",
    about:
      "Buen café, pastelería y un patio fresco. Ideal para descansar del calor de Cartagena.",
    hours: { open: "08:00", close: "18:00" },
    amenities: ["Wifi", "Patio", "Pastelería"],
    photos: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-terrace.jpg",
    ],
    reviews: [
      {
        name: "Laura V.",
        stars: 4,
        text: "Buen café y el patio es muy agradable. Un respiro del sol.",
      },
    ],
  },
  {
    id: "cafe-del-mar",
    cityId: "ctg",
    kind: "bar",
    name: "Café del Mar",
    neighborhood: "Centro Histórico",
    address: "Baluarte de Santo Domingo, Centro",
    lat: 10.426,
    lng: -75.553,
    rating: 4.4,
    reviewCount: 4500,
    price: 3,
    priceNote: "Cócteles desde $40.000 COP",
    tags: ["Atardecer", "Vista", "Murallas"],
    blurb: "El atardecer más famoso de Cartagena sobre las murallas.",
    about:
      "Bar en las murallas con vista al mar. Ideal para ver el atardecer con un cóctel. Llega temprano.",
    hours: { open: "17:00", close: "01:00" },
    amenities: ["Vista al mar", "Cócteles", "Ambiente"],
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    ],
    reviews: [
      {
        name: "Sofía R.",
        stars: 5,
        text: "El atardecer desde aquí es mágico. Hay que ir al menos una vez.",
      },
    ],
  },
  {
    id: "alquimico",
    cityId: "ctg",
    kind: "bar",
    name: "Alquímico",
    neighborhood: "Centro Histórico",
    address: "Calle del Colegio # 34-24, Centro",
    lat: 10.4235,
    lng: -75.5495,
    rating: 4.7,
    reviewCount: 2100,
    price: 3,
    priceNote: "Cócteles desde $45.000 COP",
    tags: ["Cócteles", "Azotea", "Centro"],
    blurb: "Bar de cócteles en una casona colonial de tres pisos.",
    about:
      "Tres ambientes distintos: sótano, salón principal y azotea. Carta de cócteles creativa y ambiente sofisticado.",
    hours: { open: "18:00", close: "02:00" },
    amenities: ["Cócteles", "Azotea", "Música"],
    photos: [
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80",
    ],
    reviews: [
      {
        name: "Mateo S.",
        stars: 5,
        text: "Los cócteles son excelentes y la azotea tiene muy buen ambiente.",
      },
    ],
  },

  // ——— Cali ———
  {
    id: "hotel-ms-ciudad-jardin",
    cityId: "cal",
    kind: "hotel",
    name: "Hotel MS Ciudad Jardín",
    neighborhood: "Ciudad Jardín",
    address: "Calle 16 # 100-30, Ciudad Jardín",
    lat: 3.385,
    lng: -76.53,
    rating: 4.5,
    reviewCount: 980,
    price: 3,
    priceNote: "Habitación desde $280.000 COP",
    tags: ["Moderno", "Ciudad Jardín", "Piscina"],
    blurb: "Hotel moderno en el sur de Cali con buena ubicación.",
    about:
      "Instalaciones contemporáneas, piscina y fácil acceso a restaurantes y vida nocturna de Ciudad Jardín.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Piscina", "Restaurante", "Wifi", "Estacionamiento"],
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-courtyard.jpg",
    ],
    reviews: [
      {
        name: "Andrés V.",
        stars: 4,
        text: "Buen hotel, limpio y con buena atención. Ideal para negocios o turismo.",
      },
    ],
  },
  {
    id: "casa-de-la-musica",
    cityId: "cal",
    kind: "hotel",
    name: "Hotel Casa de la Música",
    neighborhood: "San Antonio",
    address: "Carrera 4 # 4-25, San Antonio",
    lat: 3.448,
    lng: -76.538,
    rating: 4.6,
    reviewCount: 640,
    price: 2,
    priceNote: "Habitación desde $180.000 COP",
    tags: ["Boutique", "San Antonio", "Colonial"],
    blurb: "Hotel boutique en el barrio histórico de San Antonio.",
    about:
      "Ambiente acogedor, a poca distancia del centro y de los mejores lugares de salsa de Cali.",
    hours: { open: "00:00", close: "23:59" },
    alwaysOpen: true,
    amenities: ["Desayuno", "Terraza", "Wifi"],
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-tiles.jpg",
    ],
    reviews: [
      {
        name: "Paula M.",
        stars: 5,
        text: "Ubicación perfecta para explorar San Antonio a pie. Muy acogedor.",
      },
    ],
  },
  {
    id: "platillos-voladores",
    cityId: "cal",
    kind: "restaurant",
    name: "Platillos Voladores",
    neighborhood: "San Antonio",
    address: "Carrera 3 # 7-25, San Antonio",
    lat: 3.45,
    lng: -76.537,
    rating: 4.7,
    reviewCount: 1250,
    price: 3,
    priceNote: "Platos desde $55.000 COP",
    tags: ["Fusión", "Colombiana", "San Antonio"],
    blurb: "Cocina de autor con productos del Valle del Cauca.",
    about:
      "Uno de los restaurantes más reconocidos de Cali. Carta creativa y ambiente agradable.",
    hours: { open: "12:00", close: "22:00", closed: [0] },
    amenities: ["Reserva", "Terraza", "Vinos"],
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-steak.jpg",
    ],
    reviews: [
      {
        name: "Carolina R.",
        stars: 5,
        text: "Comida excelente y ambiente muy agradable. Altamente recomendado.",
      },
    ],
  },
  {
    id: "el-gato",
    cityId: "cal",
    kind: "restaurant",
    name: "El Gato",
    neighborhood: "Granada",
    address: "Calle 15A # 3-45, Granada",
    lat: 3.455,
    lng: -76.535,
    rating: 4.5,
    reviewCount: 890,
    price: 2,
    priceNote: "Platos desde $40.000 COP",
    tags: ["Tradicional", "Vallecaucana", "Granada"],
    blurb: "Comida típica del Valle en un ambiente relajado.",
    about:
      "Buen lugar para probar sancocho, chontaduro y otros platos de la región.",
    hours: { open: "11:30", close: "21:30" },
    amenities: ["Ambiente local", "Terraza"],
    photos: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-tacos.jpg",
    ],
    reviews: [
      {
        name: "Juan D.",
        stars: 4,
        text: "Buena comida típica a buen precio. Ideal para almorzar.",
      },
    ],
  },
  {
    id: "macondo-cafe",
    cityId: "cal",
    kind: "cafe",
    name: "Macondo Café",
    neighborhood: "San Antonio",
    address: "Carrera 5 # 3-12, San Antonio",
    lat: 3.449,
    lng: -76.536,
    rating: 4.6,
    reviewCount: 780,
    price: 2,
    priceNote: "Café desde $9.000 COP",
    tags: ["Especialidad", "San Antonio", "Libros"],
    blurb: "Café con librería en el barrio más bonito de Cali.",
    about:
      "Ambiente bohemio, buen café y libros. Ideal para pasar una tarde en San Antonio.",
    hours: { open: "09:00", close: "20:00" },
    amenities: ["Wifi", "Libros", "Terraza"],
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
      "/places/hotel-terrace.jpg",
    ],
    reviews: [
      {
        name: "Diana P.",
        stars: 5,
        text: "El ambiente es único. Café bueno y muy buena atención.",
      },
    ],
  },
  {
    id: "zaperoco",
    cityId: "cal",
    kind: "bar",
    name: "Zaperoco",
    neighborhood: "San Antonio",
    address: "Carrera 4 # 5-20, San Antonio",
    lat: 3.447,
    lng: -76.539,
    rating: 4.7,
    reviewCount: 2100,
    price: 2,
    priceNote: "Entrada + consumos desde $40.000 COP",
    tags: ["Salsa", "En vivo", "San Antonio"],
    blurb: "El templo de la salsa en Cali.",
    about:
      "Música en vivo, ambiente auténtico y la mejor salsa de la ciudad. Hay que ir a bailar.",
    hours: { open: "21:00", close: "03:00", closed: [0, 1] },
    amenities: ["Música en vivo", "Pista de baile", "Bar"],
    photos: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1200&q=80",
    ],
    reviews: [
      {
        name: "Felipe R.",
        stars: 5,
        text: "La mejor noche de salsa que he tenido. No te lo puedes perder.",
      },
    ],
  },
  {
    id: "tin-tin-deo",
    cityId: "cal",
    kind: "bar",
    name: "Tin Tin Deo",
    neighborhood: "San Antonio",
    address: "Calle 5 # 4-15, San Antonio",
    lat: 3.4485,
    lng: -76.5375,
    rating: 4.5,
    reviewCount: 1350,
    price: 2,
    priceNote: "Entrada + consumos desde $35.000 COP",
    tags: ["Salsa", "Clásico", "San Antonio"],
    blurb: "Clásico de la salsa caleña desde hace décadas.",
    about:
      "Ambiente más tradicional. Ideal si quieres vivir la salsa auténtica de Cali.",
    hours: { open: "21:00", close: "03:00", closed: [0, 1] },
    amenities: ["Música en vivo", "Pista de baile", "Bar"],
    photos: [
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
      "/places/dish-tapas.jpg",
    ],
    reviews: [
      {
        name: "Mariana L.",
        stars: 5,
        text: "Un clásico que no decepciona. La gente baila de verdad.",
      },
    ],
  },
];
