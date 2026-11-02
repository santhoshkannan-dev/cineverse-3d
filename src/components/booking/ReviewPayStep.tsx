"use client";

import { useState } from "react";
import Image from "next/image";
import { Movie } from "@/data/movies";
import { Theatre } from "@/data/theatres";
import { calculateBill, SNACKS_MAP } from "@/data/snacks";
import { useBookingStore, getHallLayout, CATEGORIES_MAP } from "@/data/hall";
import { useTicketStore, BookedTicket } from "@/store/userStore";
import { ArrowLeft, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface ReviewPayStepProps {
  movie: Movie;
  theatre?: Theatre;
  cityName: string;
  cityId: string;
  dateStr: string;
  dateIdx: number;
  time: string;
  format: string;
  onBack: () => void;
  onSuccess: (ticket: BookedTicket) => void;
}

export default function ReviewPayStep({
  movie,
  theatre,
  cityName,
  cityId,
  dateStr,
  dateIdx,
  time,
  format,
  onBack,
  onSuccess,
}: ReviewPayStepProps) {
  const [paying, setPaying] = useState(false);
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");

  const selectedSeatIndices = useBookingStore((s) => s.selected);
  const snacks = useBookingStore((s) => s.snacks);
  const addTicket = useTicketStore((s) => s.addTicket);

  const { seats } = getHallLayout();
  const selectedSeats = selectedSeatIndices.map((i) => seats[i]).filter(Boolean);
  const ticketPrices = selectedSeats.map((s) => CATEGORIES_MAP[s.cat]?.price || 0);

  const bill = calculateBill(ticketPrices, snacks);

  const handlePay = () => {
    setPaying(true);

    setTimeout(() => {
      // Trigger festive confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f5b942", "#2cf5b9", "#ffffff", "#9b7bff"],
        });
      } catch {}

      const bookingId = `CV-${Math.floor(100000 + Math.random() * 900000)}`;

      const snackList = Object.entries(snacks).map(([id, qty]) => ({
        name: SNACKS_MAP[id]?.name || id,
        qty,
        price: SNACKS_MAP[id]?.price || 0,
      }));

      const newTicket: BookedTicket = {
        bookingId,
        movieSlug: movie.slug,
        movieTitle: movie.title,
        moviePoster: `/posters/${movie.slug}.webp`,
        cert: movie.cert,
        runtime: movie.runtime,
        cityId,
        cityName,
        theatreId: theatre?.id || "theatre",
        theatreName: theatre?.name || "Cinema Hall",
        dateIdx,
        dateStr,
        timeStr: time,
        format,
        seats: selectedSeats.map((s) => s.id),
        seatTier: selectedSeats[0] ? CATEGORIES_MAP[selectedSeats[0].cat]?.name : "Standard",
        snacks: snackList,
        breakdown: bill,
        bookedAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        qrPayload: `CINEVERSE:${bookingId}:${movie.slug}:${selectedSeats.map((s) => s.id).join(",")}`,
      };

      addTicket(newTicket);
      setPaying(false);
      onSuccess(newTicket);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col justify-between p-5 sm:p-6 overflow-y-auto">
      <div className="space-y-5">
        {/* Movie summary header */}
        <div className="flex gap-3 rounded-2xl border border-line bg-white/[0.02] p-3">
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
            <Image
              src={`/posters/${movie.slug}.webp`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg uppercase tracking-wide text-white truncate">
              {movie.title}
            </h3>
            <p className="text-xs text-gold font-medium truncate">
              {theatre?.name || "Cinema Hall"}
            </p>
            <p className="mt-1 text-[11px] text-white/50">
              {dateStr} · {time} · {format}
            </p>
            <div className="mt-1 text-xs font-bold text-mint">
              Seats: {selectedSeats.map((s) => s.id).join(", ")}
            </div>
          </div>
        </div>

        {/* Price Breakdown Card */}
        <div className="rounded-2xl border border-line bg-white/[0.02] p-4 text-xs space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">
            Payment Summary
          </div>

          <div className="flex items-center justify-between text-white/70">
            <span>Ticket Price ({selectedSeats.length} seats)</span>
            <span className="font-semibold text-white">₹{bill.tickets}</span>
          </div>

          {bill.food > 0 && (
            <div className="flex items-center justify-between text-white/70">
              <span>Food & Beverages</span>
              <span className="font-semibold text-white">₹{bill.food}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-white/70">
            <span>Convenience fee (6%)</span>
            <span className="font-semibold text-white">₹{bill.fee}</span>
          </div>

          <div className="flex items-center justify-between text-white/70">
            <span>Integrated GST (18%)</span>
            <span className="font-semibold text-white">₹{bill.gst}</span>
          </div>

          <div className="border-t border-line/60 pt-2 flex items-center justify-between text-sm font-bold text-white">
            <span>Total Payable</span>
            <span className="text-gold text-base">₹{bill.total}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Payment Method (Demo Mode)
          </div>

          <div className="space-y-1.5">
            {[
              { id: "upi" as const, label: "UPI (Google Pay, PhonePe, Paytm)" },
              { id: "card" as const, label: "Credit / Debit Card" },
              { id: "netbanking" as const, label: "Netbanking" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPayMethod(m.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-medium transition ${
                  payMethod === m.id
                    ? "border-gold bg-gold/10 text-white font-bold"
                    : "border-line bg-white/[0.02] text-white/70 hover:border-white/20"
                }`}
              >
                <span>{m.label}</span>
                {payMethod === m.id && (
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-white/40 justify-center">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Demo checkout · Instant simulated payment</span>
        </div>
      </div>

      {/* Pay action */}
      <div className="mt-6 pt-4 border-t border-line flex items-center gap-2">
        <button
          onClick={onBack}
          disabled={paying}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white/5 text-white transition hover:bg-white/10 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <button
          onClick={handlePay}
          disabled={paying}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-bold text-black shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {paying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <span>Pay ₹{bill.total}</span>
          )}
        </button>
      </div>
    </div>
  );
}

