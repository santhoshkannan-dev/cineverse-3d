"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTicketStore, BookedTicket } from "@/store/userStore";
import { Ticket, Calendar, MapPin, Trash2, ArrowLeft, QrCode, X } from "lucide-react";
import Footer from "@/components/Footer";

export default function BookingsPage() {
  const tickets = useTicketStore((s) => s.tickets);
  const cancelTicket = useTicketStore((s) => s.cancelTicket);
  const [selectedTicket, setSelectedTicket] = useState<BookedTicket | null>(null);

  return (
    <main className="min-h-screen bg-ink pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-line pb-6">
          <Link
            href="/"
            aria-label="Back to home"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white">
              My Tickets
            </h1>
            <p className="text-xs text-white/50">
              {tickets.length} {tickets.length === 1 ? "booking" : "bookings"} recorded
            </p>
          </div>
        </div>

        {/* Tickets List */}
        <div className="mt-8 space-y-4">
          {tickets.length === 0 ? (
            <div className="rounded-3xl border border-line bg-white/[0.02] p-16 text-center">
              <Ticket className="mx-auto h-12 w-12 text-white/20 mb-3" />
              <h3 className="text-lg font-bold text-white">No tickets booked yet</h3>
              <p className="mt-1 text-xs text-white/50 max-w-md mx-auto">
                Explore now showing movies and experience the 3D theatre seat selection.
              </p>
              <Link
                href="/#now-showing"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gold px-6 py-3 text-xs font-bold text-black shadow-lg hover:scale-105 transition"
              >
                <span>Browse Movies</span>
              </Link>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.bookingId}
                className="group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-line bg-ink-2 shadow-xl transition hover:border-white/20"
              >
                {/* Poster */}
                <div className="relative h-44 sm:h-auto sm:w-40 shrink-0 overflow-hidden bg-white/5">
                  <Image
                    src={ticket.moviePoster}
                    alt={ticket.movieTitle}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-ink-2/90 via-transparent to-transparent" />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-gold">
                        #{ticket.bookingId}
                      </span>
                      <span className="rounded-md border border-line bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                        {ticket.cert}
                      </span>
                    </div>

                    <h3 className="mt-1 font-display text-2xl uppercase tracking-wider text-white">
                      {ticket.movieTitle}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                      <span className="flex items-center gap-1 text-gold">
                        <MapPin className="h-3.5 w-3.5" />
                        {ticket.theatreName} ({ticket.cityName})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-white/40" />
                        {ticket.dateStr} · {ticket.timeStr}
                      </span>
                      <span>Format: {ticket.format}</span>
                    </div>

                    {/* Seats */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-white/40">Seats:</span>
                      {ticket.seats.map((seatId) => (
                        <span
                          key={seatId}
                          className="rounded-lg border border-mint/40 bg-mint/10 px-2 py-0.5 text-xs font-bold text-mint"
                        >
                          {seatId}
                        </span>
                      ))}
                      <span className="text-[11px] text-white/50 ml-1">
                        ({ticket.seatTier})
                      </span>
                    </div>

                    {/* Snacks */}
                    {ticket.snacks && ticket.snacks.length > 0 && (
                      <div className="mt-2 text-xs text-white/50">
                        Snacks:{" "}
                        {ticket.snacks
                          .map((s) => `${s.name} × ${s.qty}`)
                          .join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-line/60">
                    <span className="text-sm font-bold text-white">
                      Total: <span className="text-gold">₹{ticket.breakdown.total}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
                      >
                        <QrCode className="h-3.5 w-3.5 text-gold" />
                        <span>View QR</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Cancel booking ${ticket.bookingId}?`)) {
                            cancelTicket(ticket.bookingId);
                          }
                        }}
                        aria-label="Cancel booking"
                        className="grid h-8 w-8 place-items-center rounded-xl border border-line text-white/40 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QR Code Inspection Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedTicket(null)}
          />
          <div className="relative w-full max-w-sm rounded-3xl border border-line bg-ink-2 p-6 text-center shadow-2xl">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-line text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-display text-xl uppercase tracking-wider text-white">
              {selectedTicket.movieTitle}
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              ID: {selectedTicket.bookingId} · Seats: {selectedTicket.seats.join(", ")}
            </p>

            <div className="my-6 mx-auto w-40 h-40 rounded-2xl border-4 border-white bg-white p-2 flex items-center justify-center">
              <QrCode className="h-32 w-32 text-black" />
            </div>

            <p className="text-[11px] text-white/40">
              Scan this code at the theatre ticket counter or turnstile.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

