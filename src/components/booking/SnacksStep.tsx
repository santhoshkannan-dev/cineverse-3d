"use client";

import { useState } from "react";
import Image from "next/image";
import {
  SNACKS,
  SNACK_CATEGORIES,
  calculateBill,
  SnackItem,
} from "@/data/snacks";
import { useBookingStore, getHallLayout, CATEGORIES_MAP } from "@/data/hall";
import { Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";

interface SnacksStepProps {
  onBack: () => void;
  onProceed: () => void;
}

export default function SnacksStep({ onBack, onProceed }: SnacksStepProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const snacks = useBookingStore((s) => s.snacks);
  const addSnack = useBookingStore((s) => s.addSnack);
  const selectedSeats = useBookingStore((s) => s.selected);

  const { seats } = getHallLayout();
  const ticketPrices = selectedSeats.map(
    (idx) => CATEGORIES_MAP[seats[idx]?.cat]?.price || 0
  );

  const bill = calculateBill(ticketPrices, snacks);

  const filteredSnacks = SNACKS.filter((s) => {
    if (activeCategory === "all") return true;
    return s.cat === activeCategory;
  });

  return (
    <div className="flex h-full flex-col justify-between p-5 sm:p-6 overflow-y-auto">
      <div className="space-y-5">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none]">
          {SNACK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? "border-white bg-white text-black"
                  : "border-line bg-white/[0.02] text-white/60 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Snack Items Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredSnacks.map((item) => {
            const count = snacks[item.id] || 0;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-2.5 transition ${
                  count > 0
                    ? "border-gold bg-gold/5"
                    : "border-line bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {/* Images row */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/5 mb-2">
                  <div className="flex h-full w-full">
                    {item.img.map((src, i) => (
                      <div key={src} className="relative h-full flex-1">
                        <Image
                          src={src}
                          alt={item.name}
                          fill
                          sizes="150px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Veg Tag */}
                  {item.veg && (
                    <span className="absolute left-1.5 top-1.5 grid h-3.5 w-3.5 place-items-center rounded bg-black/70 border border-[#22a45d]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22a45d]" />
                    </span>
                  )}

                  {/* Promo Tag */}
                  {item.tag && (
                    <span className="absolute right-1.5 top-1.5 rounded bg-gold px-1.5 py-0.5 text-[9px] font-bold text-black shadow-sm">
                      {item.tag}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-white/50 line-clamp-1">
                    {item.desc}
                  </p>
                </div>

                {/* Price and Counter */}
                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-line/60">
                  <span className="text-xs font-bold text-gold">₹{item.price}</span>

                  {count === 0 ? (
                    <button
                      onClick={() => addSnack(item.id, 1)}
                      className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-gold hover:text-black"
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 rounded-lg bg-gold px-1 py-0.5 text-black">
                      <button
                        onClick={() => addSnack(item.id, -1)}
                        className="px-1 text-xs font-bold hover:scale-110"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-extrabold w-3 text-center">
                        {count}
                      </span>
                      <button
                        onClick={() => addSnack(item.id, 1)}
                        disabled={count >= 9}
                        className="px-1 text-xs font-bold hover:scale-110 disabled:opacity-40"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions & Price Summary */}
      <div className="mt-6 pt-4 border-t border-line space-y-3">
        {bill.food > 0 && (
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Food & beverages</span>
            <span className="font-bold text-gold">₹{bill.food}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white/5 text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <button
            onClick={onProceed}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-bold text-black shadow-xl transition-all hover:scale-[1.02]"
          >
            <span>{bill.food > 0 ? "Review Order" : "Skip Snacks"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

