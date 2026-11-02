// Theatres, Cities, and Showtimes data & generator

export interface Area {
  id: string;
  name: string;
  x: number;
  z: number;
}

export interface City {
  id: string;
  name: string;
  state: string;
  areas: Area[];
  water?: any[];
}

export interface Theatre {
  id: string;
  name: string;
  areaId: string;
  x: number;
  z: number;
  screens: number;
  amenities: string[];
}

export interface Show {
  time: string;
  label: string;
  format: string;
  fill: number;
}

export interface TheatreShows {
  theatre: Theatre;
  shows: Show[];
}

export interface AreaShows {
  area: Area;
  theatres: TheatreShows[];
  total: number;
}

export interface DateOption {
  idx: number;
  dow: string;
  day: number;
  month: string;
  long: string;
}

function createArea(name: string, x: number, z: number): Area {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    x,
    z,
  };
}

export const CITIES: City[] = [
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    water: [{ kind: "sea", fromX: 8.5 }],
    areas: [
      createArea("Perambur", 0, -10),
      createArea("Anna Nagar", -4.5, -5.5),
      createArea("Koyambedu", -8, -3),
      createArea("Egmore", 2, -5),
      createArea("Vadapalani", -5, 0),
      createArea("T. Nagar", -1, 1.5),
      createArea("Mylapore", 4.5, 1),
      createArea("Porur", -11, 3),
      createArea("Guindy", -3.5, 5.5),
      createArea("Velachery", 0.5, 8.5),
      createArea("OMR", 5.5, 10),
      createArea("Tambaram", -6, 12),
    ],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    water: [{ kind: "lake", x: 1.5, z: -2, r: 2.2 }],
    areas: [
      createArea("Kukatpally", -6, -8),
      createArea("Kondapur", -10, -3),
      createArea("Hitech City", -7, -2),
      createArea("Gachibowli", -10, 2.5),
      createArea("Jubilee Hills", -4, 0.5),
      createArea("Banjara Hills", -1.5, 2.5),
      createArea("Ameerpet", -2, -4),
      createArea("Secunderabad", 4.5, -6.5),
      createArea("Abids", 3.5, 3.5),
      createArea("Mehdipatnam", -2.5, 7),
      createArea("Dilsukhnagar", 8, 5),
      createArea("LB Nagar", 10, 8.5),
    ],
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    water: [
      { kind: "lake", x: 7, z: -6, r: 1.6 },
      { kind: "lake", x: -3, z: 3.5, r: 1.1 },
    ],
    areas: [
      createArea("Yelahanka", -1, -12),
      createArea("Hebbal", 0, -7),
      createArea("Malleshwaram", -4, -3.5),
      createArea("Rajajinagar", -8, -1.5),
      createArea("MG Road", 1.5, -0.5),
      createArea("Indiranagar", 5, -1.5),
      createArea("Whitefield", 11, -2),
      createArea("Marathahalli", 8, 2.5),
      createArea("Koramangala", 3, 4),
      createArea("Jayanagar", -2, 7),
      createArea("JP Nagar", -1, 10.5),
      createArea("Electronic City", 5, 12),
    ],
  },
  {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    water: [
      { kind: "seaWest", toX: -9 },
      { kind: "lake", x: -5, z: 2, r: 2.4 },
    ],
    areas: [
      createArea("Aluva", 4, -12),
      createArea("Edappally", 2, -5),
      createArea("Kaloor", -0.5, -1.5),
      createArea("Kakkanad", 8, -2.5),
      createArea("MG Road", -1.5, 2.5),
      createArea("Vyttila", 3.5, 4.5),
      createArea("Fort Kochi", -10.5, 4.5),
      createArea("Tripunithura", 7.5, 8),
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    water: [{ kind: "seaWest", toX: -8 }],
    areas: [
      createArea("Borivali", -4, -12),
      createArea("Malad", -5, -8),
      createArea("Thane", 8, -9),
      createArea("Andheri", -5, -3.5),
      createArea("Powai", 2.5, -4),
      createArea("Juhu", -7, -1),
      createArea("Ghatkopar", 4, 0),
      createArea("Vashi", 10, 2),
      createArea("Bandra", -5.5, 3),
      createArea("Dadar", -3, 6.5),
      createArea("Lower Parel", -4.5, 9.5),
      createArea("Colaba", -6, 13),
    ],
  },
];

export const THEATRE_NAMES = [
  "Cineverse IMAX",
  "Aurora Multiplex",
  "Galaxy Screens",
  "Regal Talkies",
  "Nova Cinemas",
  "Luxe Picture Palace",
  "Starlight Cinemas",
  "Meridian Screens",
];

export const AMENITIES = [
  "Recliners",
  "Dolby Atmos",
  "4K Laser",
  "F&B to seat",
  "Parking",
  "Wheelchair access",
  "IMAX",
];

export const FORMATS = ["2D", "2D", "2D", "Dolby Atmos", "IMAX", "4DX", "3D"];

export const TIME_SLOTS = [
  "07:45",
  "09:30",
  "10:15",
  "11:40",
  "13:05",
  "14:20",
  "15:50",
  "17:10",
  "18:45",
  "19:30",
  "21:15",
  "22:40",
  "23:55",
];

export function getCityById(id: string): City {
  return CITIES.find((c) => c.id === id) || CITIES[0];
}

export function createSeededRandom(seedStr: string): () => number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let t = h >>> 0;
  return function () {
    t |= 0;
    let e = Math.imul((t = (t + 0x6d2b79f5) | 0) ^ (t >>> 15), 1 | t);
    return (((e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e) ^ (e >>> 14)) >>> 0) / 0x100000000;
  };
}

const theatreCache = new Map<string, Theatre[]>();

export function getTheatresForCity(city: City): Theatre[] {
  const cached = theatreCache.get(city.id);
  if (cached) return cached;

  const results: Theatre[] = [];
  for (const area of city.areas) {
    const rng = createSeededRandom(`th|${city.id}|${area.id}`);
    const count = 1 + Math.floor(3 * rng());
    const used = new Set<string>();

    for (let i = 0; i < count; i++) {
      let name = THEATRE_NAMES[Math.floor(rng() * THEATRE_NAMES.length)];
      while (used.has(name)) {
        name = THEATRE_NAMES[(THEATRE_NAMES.indexOf(name) + 1) % THEATRE_NAMES.length];
      }
      used.add(name);

      const angle = rng() * Math.PI * 2;
      const radius = 0.6 + 0.9 * rng();
      const screens = 3 + Math.floor(5 * rng());

      // Amenities selection
      const aRng = createSeededRandom(`amenities|${city.id}|${area.id}|${i}`);
      const amenities: string[] = [];
      for (const a of AMENITIES) {
        if (aRng() > 0.35) amenities.push(a);
      }
      if (amenities.length === 0) amenities.push("Dolby Atmos", "4K Laser");

      results.push({
        id: `${city.id}-${area.id}-${i}`,
        name: `${name}: ${area.name}`,
        areaId: area.id,
        x: area.x + Math.cos(angle) * radius,
        z: area.z + Math.sin(angle) * radius,
        screens,
        amenities,
      });
    }
  }

  theatreCache.set(city.id, results);
  return results;
}

export function getTheatreById(cityId: string, theatreId: string): Theatre | undefined {
  const city = getCityById(cityId);
  return getTheatresForCity(city).find((t) => t.id === theatreId);
}

export function formatTimeLabel(time: string): string {
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function getSeatAvailability(fill: number): "almost-full" | "filling" | "available" {
  return fill > 0.42 ? "almost-full" : fill > 0.3 ? "filling" : "available";
}

export function getDateOptions(days = 7): DateOption[] {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    return {
      idx: i,
      dow: i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      day: d.getDate(),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      long: d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }),
    };
  });
}

export function getShowsForMovie(movieSlug: string, city: City, dayIdx: number): AreaShows[] {
  const theatres = getTheatresForCity(city);
  const isFeatured = ["ramayana", "jailer-2", "coolie", "toxic"].includes(movieSlug);

  const areasMap = city.areas.map((area) => {
    const rng = createSeededRandom(`${movieSlug}|${city.id}|${area.id}|${dayIdx}`);
    const shouldShow = rng() < (isFeatured ? 0.9 : 0.6);

    const areaTheatres: TheatreShows[] = shouldShow
      ? theatres
          .filter((t) => t.areaId === area.id && rng() > 0.2)
          .map((theatre) => {
            const count = 2 + Math.floor(rng() * (isFeatured ? 5 : 3));
            const shuffledTimes = [...TIME_SLOTS];
            for (let i = shuffledTimes.length - 1; i > 0; i--) {
              const j = Math.floor(rng() * (i + 1));
              [shuffledTimes[i], shuffledTimes[j]] = [shuffledTimes[j], shuffledTimes[i]];
            }

            const chosen = shuffledTimes
              .slice(0, count)
              .sort()
              .map((time) => {
                const format = FORMATS[Math.floor(rng() * FORMATS.length)];
                const fill = Math.min(
                  0.5,
                  0.25 * rng() + (time >= "18:00" ? 0.15 : 0.03) + (isFeatured ? 0.08 : 0)
                );
                return {
                  time,
                  label: formatTimeLabel(time),
                  format,
                  fill,
                };
              });

            return {
              theatre,
              shows: chosen,
            };
          })
      : [];

    return {
      area,
      theatres: areaTheatres,
      total: areaTheatres.reduce((acc, t) => acc + t.shows.length, 0),
    };
  });

  return areasMap.sort((a, b) => b.total - a.total);
}
