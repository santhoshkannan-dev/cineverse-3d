export interface SnackItem {
  id: string;
  cat: "combos" | "popcorn" | "hot" | "drinks" | "desserts";
  veg: boolean;
  name: string;
  desc: string;
  price: number;
  tag?: string;
  img: string[];
}

export interface SnackCategory {
  id: string;
  label: string;
}

export const SNACK_CATEGORIES: SnackCategory[] = [
  { id: "all", label: "All" },
  { id: "combos", label: "Combos" },
  { id: "popcorn", label: "Popcorn" },
  { id: "hot", label: "Hot food" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

export const SNACKS: SnackItem[] = [
  {
    id: "combo-duo",
    cat: "combos",
    veg: true,
    name: "Duo Combo",
    desc: "1 large popcorn + 2 colas",
    price: 520,
    tag: "Save ₹130",
    img: ["/snacks/popcorn-salted.webp", "/snacks/cola.webp"],
  },
  {
    id: "combo-family",
    cat: "combos",
    veg: true,
    name: "Family Combo",
    desc: "2 popcorn + nachos + 4 colas",
    price: 1090,
    tag: "Save ₹300",
    img: ["/snacks/popcorn-caramel.webp", "/snacks/nachos.webp", "/snacks/cola.webp"],
  },
  {
    id: "popcorn-salted",
    cat: "popcorn",
    veg: true,
    name: "Salted Popcorn",
    desc: "Large tub, classic butter-salt",
    price: 290,
    tag: "Bestseller",
    img: ["/snacks/popcorn-salted.webp"],
  },
  {
    id: "popcorn-caramel",
    cat: "popcorn",
    veg: true,
    name: "Caramel Popcorn",
    desc: "Large tub, glazed crunch",
    price: 340,
    img: ["/snacks/popcorn-caramel.webp"],
  },
  {
    id: "nachos",
    cat: "hot",
    veg: true,
    name: "Cheese Nachos",
    desc: "Jalapeño, olives & warm cheese dip",
    price: 260,
    img: ["/snacks/nachos.webp"],
  },
  {
    id: "samosa",
    cat: "hot",
    veg: true,
    name: "Samosa Duo",
    desc: "Two Punjabi samosas, mint chutney",
    price: 140,
    img: ["/snacks/samosa.webp"],
  },
  {
    id: "puff",
    cat: "hot",
    veg: true,
    name: "Veg Puff",
    desc: "Flaky pastry, spiced potato",
    price: 90,
    img: ["/snacks/puff.webp"],
  },
  {
    id: "chips",
    cat: "hot",
    veg: true,
    name: "Potato Chips",
    desc: "Salted, crunchy, 52 g",
    price: 60,
    img: ["/snacks/chips.webp"],
  },
  {
    id: "cola",
    cat: "drinks",
    veg: true,
    name: "Cola",
    desc: "Large 750 ml, chilled",
    price: 180,
    img: ["/snacks/cola.webp"],
  },
  {
    id: "cold-coffee",
    cat: "drinks",
    veg: true,
    name: "Cold Coffee",
    desc: "Thick shake, cocoa dusted",
    price: 220,
    img: ["/snacks/cold-coffee.webp"],
  },
  {
    id: "water",
    cat: "drinks",
    veg: true,
    name: "Mineral Water",
    desc: "1 litre, chilled",
    price: 50,
    img: ["/snacks/water.webp"],
  },
  {
    id: "icecream",
    cat: "desserts",
    veg: true,
    name: "Choco Cone",
    desc: "Chocolate ice cream cone",
    price: 120,
    tag: "Cold",
    img: ["/snacks/icecream.webp"],
  },
];

export const SNACKS_MAP: Record<string, SnackItem> = Object.fromEntries(
  SNACKS.map((s) => [s.id, s])
);

export function calculateBill(ticketPrices: number[], snacksSelected: Record<string, number> = {}) {
  const tickets = ticketPrices.reduce((a, b) => a + b, 0);
  const food = Object.entries(snacksSelected).reduce((acc, [id, qty]) => {
    return acc + (SNACKS_MAP[id]?.price ?? 0) * qty;
  }, 0);
  const fee = Math.round(0.06 * tickets);
  const gst = Math.round(0.18 * fee);
  const total = tickets + food + fee + gst;

  return {
    tickets,
    food,
    fee,
    gst,
    total,
  };
}

