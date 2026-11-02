"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 border-t border-line bg-ink-2/60 pt-16 pb-12 text-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand & description */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gold text-black font-bold">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6V6Z" />
                </svg>
              </span>
              <span className="font-display text-xl tracking-wider text-white">
                CINEVERSE
              </span>
            </Link>
            <p className="mt-3 text-xs text-white/50 leading-relaxed">
              A next-generation 3D movie ticket booking experience. Real-time 3D cinema hall seat
              picker, screen POV preview, and seamless booking flow.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-xs">
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">
                Cinemas
              </h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/#now-showing" className="hover:text-white transition">Now Showing</Link></li>
                <li><Link href="/#now-showing" className="hover:text-white transition">Coming Soon</Link></li>
                <li><span className="opacity-40">IMAX Experiences</span></li>
                <li><span className="opacity-40">4DX Theatres</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">
                Account
              </h4>
              <ul className="space-y-2 text-white/50">
                <li><Link href="/bookings" className="hover:text-white transition">My Tickets</Link></li>
                <li><span className="opacity-40">Favorite Theatres</span></li>
                <li><span className="opacity-40">Food & Beverages</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">
                Supported Cities
              </h4>
              <ul className="space-y-2 text-white/50">
                <li>Chennai · Hyderabad</li>
                <li>Bengaluru · Kochi</li>
                <li>Mumbai</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line/60 pt-8 text-[11px] text-white/40 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Cineverse · Design demo with dummy show & payment data. Posters belong to their respective studios. Seat model &quot;Cinema Seat&quot; by connorwassall (CC-BY, Sketchfab).
          </p>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 self-start text-white/50 transition hover:text-white md:self-auto"
          >
            <span>Back to top</span>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-line transition group-hover:-translate-y-0.5 group-hover:border-gold group-hover:text-gold">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

