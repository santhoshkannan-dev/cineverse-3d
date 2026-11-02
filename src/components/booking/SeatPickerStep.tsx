"use client";

import { useMemo } from "react";
import {
  useBookingStore,
  SEAT_CATEGORIES,
  CATEGORIES_MAP,
  getHallLayout,
  findBestSeats,
  Seat,
} from "@/data/hall";
import { Sparkles, Eye, X, Check, ArrowRight } from "lucide-react";

interface SeatPickerStepProps {
  onProceed: () => void;
}

export default function SeatPickerStep({ onProceed }: SeatPickerStepProps) {
  const sold = useBookingStore((s) => s.sold);
  const selected = useBookingStore((s) => s.selected);
  const qty = useBookingStore((s) => s.qty);
  const setQty = useBookingStore((s) => s.setQty);
  const focusCat = useBookingStore((s) => s.focusCat);
  const setFocusCat = useBookingStore((s) => s.setFocusCat);
  const setSelected = useBookingStore((s) => s.setSelected);
  const remove = useBookingStore((s) => s.remove);
  const viewSeat = useBookingStore((s) => s.viewSeat);

  const { seats } = useMemo(() => getHallLayout(), []);

  // Selected seat objects
  const selectedSeats: Seat[] = useMemo(() => {
    return selected.map((idx) => seats[idx]).filter(Boolean);
  }, [selected, seats]);

  // Total seat price
  const totalTicketPrice = useMemo(() => {
    return selectedSeats.reduce(
      (acc, s) => acc + (CATEGORIES_MAP[s.cat]?.price || 0),
      0
    );
  }, [selectedSeats]);

  // Handle "Best seats" finder
  const handlePickBest = () => {
    const bestIds = findBestSeats(qty, sold, focusCat || undefined);
    if (bestIds) {
      setSelected(bestIds);
    } else {
      window.dispatchEvent(
        new CustomEvent("cv-toast", {
          detail: `Could not find ${qty} adjacent seats in this class.`,
        })
      );
    }
  };

  return (
    <div className="flex h-full flex-col justify-between p-5 sm:p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Quantity and Smart Best Seats Pick */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Quantity
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setQty(n)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                    qty === n
                      ? "bg-gold text-black shadow-md"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* "✦ Best N seats" Button */}
          <button
            onClick={handlePickBest}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gold/40 bg-gold/10 py-3 text-xs font-bold text-gold transition hover:bg-gold hover:text-black shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>✦ Best {qty} Seats</span>
          </button>
        </div>

        {/* Category Filter & Pricing */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Seat Classes
            </span>
            {focusCat && (
              <button
                onClick={() => setFocusCat(null)}
                className="text-[10px] text-white/40 hover:text-white"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="space-y-2">
            {SEAT_CATEGORIES.map((cat) => {
              const active = focusCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFocusCat(active ? null : cat.id)}
                  className={`group flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-gold/60 bg-gold/10 ring-1 ring-gold/40 shadow-[0_0_20px_rgba(245,185,66,0.12)]"
                      : "border-line bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full shrink-0 shadow-sm transition group-hover:scale-110"
                      style={{ background: cat.color }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{cat.name}</span>
                        {cat.rows && (
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/70">
                            {cat.rows}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-white/50">{cat.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white/90">₹{cat.price}</span>
                    {active && (
                      <div className="text-[9px] font-semibold text-gold">Viewing rows</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Seats List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Selected Seats ({selected.length})
            </span>
            {selected.length > 0 && (
              <span className="text-xs font-bold text-gold">₹{totalTicketPrice}</span>
            )}
          </div>

          {selected.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-4 text-center text-xs text-white/40">
              Click seats in 3D or tap &quot;Best {qty} Seats&quot; above
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((s) => (
                <div
                  key={s.idx}
                  className="flex items-center gap-1.5 rounded-xl border border-mint/40 bg-mint/10 px-2.5 py-1 text-xs text-mint font-bold"
                >
                  <span>{s.id}</span>
                  <button
                    onClick={() => viewSeat(s.idx)}
                    title="View from seat"
                    aria-label={`View from seat ${s.id}`}
                    className="hover:text-white transition"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => remove(s.idx)}
                    title="Remove seat"
                    aria-label={`Remove seat ${s.id}`}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Proceed Button */}
      <div className="mt-6 pt-4 border-t border-line">
        <button
          onClick={onProceed}
          disabled={selected.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-bold text-black shadow-xl transition-all hover:scale-[1.02] disabled:opacity-30 disabled:pointer-events-none"
        >
          <span>Continue ({selected.length} seats)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

