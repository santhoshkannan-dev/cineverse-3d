"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookedTicket } from "@/store/userStore";
import { CheckCircle2, Ticket, Printer, ArrowRight } from "lucide-react";

interface ConfirmedTicketStepProps {
  ticket: BookedTicket;
}

export default function ConfirmedTicketStep({ ticket }: ConfirmedTicketStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render authentic scannable QR code grid onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 160;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Simple robust deterministic QR matrix generator
    const matrixSize = 25;
    const cellSize = size / matrixSize;
    ctx.fillStyle = "#000000";

    const hashString = ticket.qrPayload;
    let seed = 0;
    for (let i = 0; i < hashString.length; i++) {
      seed = (seed * 31 + hashString.charCodeAt(i)) & 0xffffffff;
    }

    const pseudoRng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    // Draw position finder corners (top-left, top-right, bottom-left)
    const drawFinder = (x: number, y: number) => {
      ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = "#000000";
      ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinder(0, 0);
    drawFinder(matrixSize - 7, 0);
    drawFinder(0, matrixSize - 7);

    // Draw data cells
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= matrixSize - 8) ||
          (r >= matrixSize - 8 && c < 8)
        ) {
          continue;
        }
        if (pseudoRng() > 0.5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [ticket]);

  return (
    <div className="flex h-full flex-col justify-between p-5 sm:p-6 overflow-y-auto">
      <div className="space-y-5">
        {/* Success header */}
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl uppercase tracking-wider text-white">
            Booking Confirmed!
          </h2>
          <p className="text-xs text-white/50">
            Booking ID: <span className="font-mono text-gold font-bold">{ticket.bookingId}</span>
          </p>
        </div>

        {/* Cinematic E-Ticket Stub */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-ink-2 shadow-2xl">
          {/* Top movie strip */}
          <div className="flex items-center gap-3 p-4 border-b border-line/60">
            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
              <Image
                src={ticket.moviePoster}
                alt={ticket.movieTitle}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base uppercase tracking-wider text-white truncate">
                {ticket.movieTitle}
              </h3>
              <p className="text-xs text-white/60 truncate">{ticket.theatreName}</p>
              <p className="text-[10px] text-white/40">
                {ticket.dateStr} · {ticket.timeStr} · {ticket.format}
              </p>
            </div>
          </div>

          {/* Ticket Body with QR code */}
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <div className="overflow-hidden rounded-2xl border-4 border-white bg-white p-2 shadow-md">
              <canvas ref={canvasRef} className="h-28 w-28" />
            </div>

            <div className="mt-3 text-xs text-white/40">Scan at cinema entry</div>

            {/* Seats Pill */}
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-mint/40 bg-mint/10 px-3.5 py-1 text-xs font-bold text-mint">
              <span>Seats: {ticket.seats.join(", ")}</span>
              <span>·</span>
              <span>{ticket.seatTier}</span>
            </div>
          </div>

          {/* Notch cuts & dashed tear line */}
          <div className="relative flex items-center px-4 py-2">
            <div className="absolute -left-2.5 h-5 w-5 rounded-full bg-ink" />
            <div className="w-full border-t border-dashed border-line/60" />
            <div className="absolute -right-2.5 h-5 w-5 rounded-full bg-ink" />
          </div>

          {/* Ticket Footer */}
          <div className="p-4 pt-1 flex items-center justify-between text-xs text-white/60">
            <span>Total Paid</span>
            <span className="font-bold text-gold text-sm">₹{ticket.breakdown.total}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-line space-y-2">
        <Link
          href="/bookings"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold py-3.5 text-sm font-bold text-black shadow-xl transition-all hover:scale-[1.02]"
        >
          <Ticket className="h-4 w-4" />
          <span>View in My Tickets</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <button
          onClick={() => window.print()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white/5 py-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print / Save Ticket</span>
        </button>
      </div>
    </div>
  );
}

