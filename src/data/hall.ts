import { create } from "zustand";

export interface SeatCategory {
  id: "recliner" | "balcony" | "prime" | "classic";
  name: string;
  price: number;
  color: string;
  desc: string;
}

export interface Seat {
  idx: number;
  id: string; // e.g. "A12"
  row: string; // e.g. "A"
  num: number; // e.g. 12
  cat: "recliner" | "balcony" | "prime" | "classic";
  block: number;
  x: number;
  y: number;
  z: number;
  rotY: number;
  wide: boolean;
  pair?: number;
}

export interface HallRow {
  row: string;
  cat: "recliner" | "balcony" | "prime" | "classic";
  y: number;
  z: number;
  radius: number;
  seats: number[];
  depth: number;
  tier: "floor" | "balcony";
}

export interface HallLayout {
  seats: Seat[];
  rows: HallRow[];
}

export const SEAT_CATEGORIES: SeatCategory[] = [
  {
    id: "recliner",
    name: "Royal Recliner",
    price: 550,
    color: "#f5b942",
    desc: "Motorised recliners · F&B to seat",
  },
  {
    id: "balcony",
    name: "Balcony",
    price: 320,
    color: "#9b7bff",
    desc: "Elevated view · centre aligned",
  },
  {
    id: "prime",
    name: "Prime",
    price: 240,
    color: "#1fd1a5",
    desc: "Sweet spot for sound & picture",
  },
  {
    id: "classic",
    name: "Classic",
    price: 160,
    color: "#3d8bff",
    desc: "Front rows · big screen energy",
  },
];

export const CATEGORIES_MAP = Object.fromEntries(
  SEAT_CATEGORIES.map((c) => [c.id, c])
) as Record<string, SeatCategory>;

export const HALL_DIMENSIONS = {
  halfWidth: 15,
  backZ: 29.5,
  ceiling: 16.5,
  centerOfCurvatureZ: -32,
};

export const SCREEN_DIMENSIONS = {
  z: 0,
  y: 6.4,
  width: 22,
  height: 9.2,
};

const ROW_CONFIGS = [
  ...Array.from({ length: 5 }, (_, t) => ({
    cat: "classic" as const,
    blocks: [6 + (t >> 1), 12 + t, 6 + (t >> 1)],
    depth: 1.05,
    rise: 0.22,
    tier: "floor" as const,
  })),
  ...Array.from({ length: 8 }, (_, t) => ({
    cat: "prime" as const,
    blocks: [8 + (t >> 2), 16 + (t >> 1), 8 + (t >> 2)],
    depth: 1.05,
    rise: 0.36,
    tier: "floor" as const,
  })),
  ...Array.from({ length: 3 }, () => ({
    cat: "recliner" as const,
    blocks: [4, 8, 4],
    depth: 1.75,
    rise: 0.5,
    tier: "floor" as const,
  })),
  ...Array.from({ length: 6 }, (_, t) => ({
    cat: "balcony" as const,
    blocks: [7 + (t >> 1), 14 + (t >> 1), 7 + (t >> 1)],
    depth: 1.05,
    rise: 0.48,
    tier: "balcony" as const,
  })),
];

const ROW_LETTERS = "ABCDEFGHJKLMNPQRSTUVWX".split("");

let cachedLayout: HallLayout | null = null;

export function getHallLayout(): HallLayout {
  if (cachedLayout) return cachedLayout;

  const seats: Seat[] = [];
  const rows: HallRow[] = [];

  let floorZ = 7.2;
  let floorY = 0;
  let balconyZ = 0;
  let balconyY = 0;

  ROW_CONFIGS.forEach((cfg, rowIdx) => {
    const isBalcony = cfg.tier === "balcony";
    if (isBalcony && balconyZ === 0) {
      balconyZ = 21.4;
      balconyY = 9.4;
    }

    const curZ = isBalcony ? balconyZ : floorZ;
    const curY = isBalcony ? balconyY : floorY;
    const radius = curZ - HALL_DIMENSIONS.centerOfCurvatureZ;
    const seatWidth = cfg.cat === "recliner" ? 0.98 : 0.64;
    const rowLetter = ROW_LETTERS[rowIdx];
    const totalRowSeats = cfg.blocks[0] + cfg.blocks[1] + cfg.blocks[2];
    let arcPos = -((totalRowSeats * seatWidth + 2.5) / 2) + seatWidth / 2;

    const rowSeatIndices: number[] = [];
    let seatNum = totalRowSeats;

    cfg.blocks.forEach((blockCount, blockIdx) => {
      for (let n = 0; n < blockCount; n++) {
        const angle = arcPos / radius;
        const seatObj: Seat = {
          idx: seats.length,
          id: `${rowLetter}${seatNum}`,
          row: rowLetter,
          num: seatNum,
          cat: cfg.cat,
          block: blockIdx,
          x: Math.sin(angle) * radius,
          y: curY,
          z: HALL_DIMENSIONS.centerOfCurvatureZ + Math.cos(angle) * radius,
          rotY: angle,
          wide: cfg.cat === "recliner",
        };

        if (seatObj.wide) {
          seatObj.pair = n % 2 === 0 ? seatObj.idx + 1 : seatObj.idx - 1;
        }

        rowSeatIndices.push(seatObj.idx);
        seats.push(seatObj);
        arcPos += seatWidth;
        seatNum--;
      }
      arcPos += 1.25; // Aisle gap
    });

    rows.push({
      row: rowLetter,
      cat: cfg.cat,
      y: curY,
      z: curZ,
      radius,
      seats: rowSeatIndices,
      depth: cfg.depth,
      tier: cfg.tier,
    });

    if (isBalcony) {
      balconyZ += cfg.depth;
      balconyY += cfg.rise;
    } else {
      floorZ += cfg.depth;
      floorY += cfg.rise;
    }
  });

  cachedLayout = { seats, rows };
  return cachedLayout;
}

export function findBestSeats(
  qty: number,
  soldSet: Set<number>,
  chosenCategory?: string
): number[] | null {
  const { seats, rows } = getHallLayout();
  let best: { score: number; ids: number[] } | null = null;

  for (const row of rows) {
    if (chosenCategory && row.cat !== chosenCategory) continue;

    for (let r = 0; r + qty <= row.seats.length; r++) {
      const windowSeats = row.seats.slice(r, r + qty);
      const targetBlock = seats[windowSeats[0]].block;

      // Check if any seat is sold or crosses an aisle
      if (
        windowSeats.some((id) => soldSet.has(id) || seats[id].block !== targetBlock)
      ) {
        continue;
      }

      // Check if window splits a couple recliner pair
      if (
        windowSeats.some(
          (id) => seats[id].pair !== undefined && !windowSeats.includes(seats[id].pair!)
        )
      ) {
        continue;
      }

      // Distance from center line (x=0) and sweet spot row (z=15.5)
      const avgX = windowSeats.reduce((acc, id) => acc + seats[id].x, 0) / qty;
      const score =
        1.2 * Math.abs(avgX) +
        Math.abs(row.z - 15.5) * (row.tier === "balcony" ? 0.6 : 1);

      if (!best || score < best.score) {
        best = { score, ids: windowSeats };
      }
    }
  }

  return best?.ids ?? null;
}

function seededRng(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let t = h >>> 0;
  return function () {
    t |= 0;
    let e = Math.imul((t = (t + 0x6d2b79f5) | 0) ^ (t >>> 15), 1 | t);
    return (((e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e) ^ (e >>> 14)) >>> 0) / 0x100000000;
  };
}

export function generateSoldSeats(seedKey: string, fill = 0.25): Set<number> {
  const { seats, rows } = getHallLayout();
  const rng = seededRng(`sold|${seedKey}`);
  const sold = new Set<number>();
  const totalTarget = Math.round(seats.length * Math.min(0.5, fill));
  const f = Math.min(0.5, fill);
  const factor = (f / (2.5 - 1.5 * f)) * 1.15;

  for (const row of rows) {
    let t = 0;
    while (t < row.seats.length) {
      const seat = seats[row.seats[t]];
      const prob =
        factor *
        (0.55 + 0.7 * (1 - Math.min(1, Math.abs(seat.x) / 12))) *
        (row.cat === "classic" ? 0.6 : 1);

      if (rng() < prob) {
        const cluster = 1 + Math.floor(4 * rng());
        for (let n = 0; n < cluster && t < row.seats.length; n++, t++) {
          sold.add(row.seats[t]);
        }
      } else {
        t++;
      }
    }
  }

  // Ensure pairs are sold together
  for (const id of Array.from(sold)) {
    if (seats[id].pair !== undefined) {
      sold.add(seats[id].pair!);
    }
  }

  // Trim if needed
  const arr = Array.from(sold);
  while (sold.size > totalTarget && arr.length) {
    const idx = Math.floor(rng() * arr.length);
    const removed = arr.splice(idx, 1)[0];
    if (sold.delete(removed) && seats[removed].pair !== undefined) {
      sold.delete(seats[removed].pair!);
    }
  }

  return sold;
}

// Seat pairing helper
export function getSeatWithPair(seatIdx: number): number[] {
  const seat = getHallLayout().seats[seatIdx];
  return seat?.pair !== undefined ? [seatIdx, seat.pair] : [seatIdx];
}

// Camera presets
export const CAMERA_PRESETS = {
  overview: {
    label: "Overview",
    shot: [7, 14.6, 19.6, 0, 2.5, 7], // [camX, camY, camZ, targetX, targetY, targetZ]
  },
  stage: {
    label: "From stage",
    shot: [0, 4.2, 2.6, 0, 6.5, 22],
  },
  balcony: {
    label: "Balcony",
    shot: [0, 13.4, 23.2, 0, SCREEN_DIMENSIONS.y, 0],
  },
  top: {
    label: "Bird's eye",
    shot: [0, HALL_DIMENSIONS.ceiling - 1.8, 25, 0, 0, 11],
  },
};

export type CameraPresetKey = keyof typeof CAMERA_PRESETS;

export interface BookingState {
  sold: Set<number>;
  selected: number[];
  hover: number | null;
  focusCat: string | null;
  qty: number;
  preset: CameraPresetKey;
  seatView: number | null;
  tour: boolean;
  hd: boolean;
  lights: boolean;
  camTick: number;
  snacks: Record<string, number>;

  addSnack: (id: string, delta: number) => void;
  init: (sold: Set<number>) => void;
  toggle: (seatIdx: number) => { ok: boolean; reason?: string };
  setSelected: (seats: number[]) => void;
  remove: (seatIdx: number) => void;
  setHover: (seatIdx: number | null) => void;
  setFocusCat: (cat: string | null) => void;
  setQty: (qty: number) => void;
  goPreset: (preset: CameraPresetKey) => void;
  viewSeat: (seatIdx: number) => void;
  setTour: (tour: boolean) => void;
  setHd: (hd: boolean) => void;
  setLights: (lights: boolean) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  sold: new Set(),
  selected: [],
  hover: null,
  focusCat: null,
  qty: 2,
  preset: "overview",
  seatView: null,
  tour: false,
  hd: true,
  lights: true,
  camTick: 0,
  snacks: {},

  addSnack: (id, delta) => {
    const cur = get().snacks;
    const nextVal = Math.max(0, Math.min(9, (cur[id] ?? 0) + delta));
    const next = { ...cur, [id]: nextVal };
    if (!nextVal) delete next[id];
    set({ snacks: next });
  },

  init: (sold) =>
    set({
      sold,
      selected: [],
      snacks: {},
      seatView: null,
      preset: "overview",
      camTick: get().camTick + 1,
    }),

  toggle: (seatIdx) => {
    const { sold, selected } = get();
    if (sold.has(seatIdx)) {
      return { ok: false, reason: "That seat is already booked." };
    }
    const group = getSeatWithPair(seatIdx);
    if (selected.includes(seatIdx)) {
      set({ selected: selected.filter((id) => !group.includes(id)) });
      return { ok: true };
    }
    if (selected.length + group.length > 10) {
      return { ok: false, reason: "You can book up to 10 seats at a time." };
    }
    set({ selected: [...selected, ...group.filter((id) => !selected.includes(id))] });
    return { ok: true };
  },

  setSelected: (selected) => set({ selected }),
  remove: (seatIdx) => {
    const group = getSeatWithPair(seatIdx);
    set({ selected: get().selected.filter((id) => !group.includes(id)) });
  },
  setHover: (hover) => set({ hover }),
  setFocusCat: (focusCat) => set({ focusCat }),
  setQty: (qty) => set({ qty: Math.max(1, Math.min(10, qty)) }),
  goPreset: (preset) =>
    set({ preset, seatView: null, camTick: get().camTick + 1 }),
  viewSeat: (seatView) =>
    set({ seatView, camTick: get().camTick + 1 }),
  setTour: (tour) => set({ tour }),
  setHd: (hd) => set({ hd }),
  setLights: (lights) => set({ lights }),
}));

