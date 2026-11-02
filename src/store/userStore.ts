import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City, CITIES } from "@/data/theatres";

export interface BookedTicket {
  bookingId: string;
  movieSlug: string;
  movieTitle: string;
  moviePoster: string;
  cert: string;
  runtime: string;
  cityId: string;
  cityName: string;
  theatreId: string;
  theatreName: string;
  dateIdx: number;
  dateStr: string;
  timeStr: string;
  format: string;
  seats: string[]; // e.g. ["P14", "P15"]
  seatTier: string;
  snacks: { name: string; qty: number; price: number }[];
  breakdown: {
    tickets: number;
    food: number;
    fee: number;
    gst: number;
    total: number;
  };
  bookedAt: string;
  qrPayload: string;
}

interface UserState {
  cityId: string;
  cityChosen: boolean;
  intro: boolean;
  searchOpen: boolean;
  setCity: (cityId: string) => void;
  setIntro: (intro: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      cityId: "chennai",
      cityChosen: false,
      intro: true,
      searchOpen: false,
      setCity: (cityId: string) => set({ cityId, cityChosen: true }),
      setIntro: (intro: boolean) => set({ intro }),
      setSearchOpen: (searchOpen: boolean) => set({ searchOpen }),
    }),
    {
      name: "cv-user-prefs",
      partialize: (state) => ({ cityId: state.cityId, cityChosen: state.cityChosen }),
    }
  )
);

export function useCurrentCity(): City {
  const cityId = useUserStore((s) => s.cityId);
  return CITIES.find((c) => c.id === cityId) || CITIES[0];
}

interface TicketStore {
  tickets: BookedTicket[];
  addTicket: (ticket: BookedTicket) => void;
  cancelTicket: (bookingId: string) => void;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: [],
      addTicket: (ticket) =>
        set((state) => ({
          tickets: [ticket, ...state.tickets.filter((t) => t.bookingId !== ticket.bookingId)],
        })),
      cancelTicket: (bookingId) =>
        set((state) => ({
          tickets: state.tickets.filter((t) => t.bookingId !== bookingId),
        })),
    }),
    {
      name: "cineverse-tickets",
    }
  )
);

