"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Ticket, MapPin, ChevronDown } from "lucide-react";
import { useUserStore, useCurrentCity, useTicketStore } from "@/store/userStore";
import { CITIES } from "@/data/theatres";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const currentCity = useCurrentCity();
  const setCity = useUserStore((s) => s.setCity);
  const setSearchOpen = useUserStore((s) => s.setSearchOpen);
  const intro = useUserStore((s) => s.intro);
  const ticketCount = useTicketStore((s) => s.tickets.length);

  // Hide nav on booking full-screen view
  const isBookingPage = pathname.startsWith("/book/");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isBookingPage) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 md:px-8 pointer-events-none">
      <nav
        className={`mx-auto flex max-w-7xl items-center gap-3 rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3 transition-all duration-500 pointer-events-auto ${
          scrolled
            ? "border-line bg-ink/85 shadow-2xl backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand Logo */}
        <Link
          data-nav-logo="true"
          href="/"
          className={`group flex shrink-0 items-center gap-2 transition-opacity duration-300 ${
            intro ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gold text-black shadow-md transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6V6Z" />
            </svg>
          </span>
          <span className="font-display text-lg tracking-wider sm:text-xl text-white">
            CINEVERSE
          </span>
        </Link>

        {/* Center Links */}
        <div className="ml-6 hidden items-center gap-6 text-sm text-white/70 lg:flex">
          <Link href="/#now-showing" className="transition hover:text-white">
            Movies
          </Link>
          <span className="cursor-not-allowed opacity-40">Events</span>
          <span className="cursor-not-allowed opacity-40">Plays</span>
          <span className="cursor-not-allowed opacity-40">Sports</span>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-line bg-white/5 text-sm text-white/60 transition hover:bg-white/10 sm:w-auto sm:px-3 md:w-64 md:justify-start"
            aria-label="Search movies"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search movies, theatres...</span>
          </button>

          {/* My Tickets */}
          <Link
            href="/bookings"
            aria-label="My tickets"
            className="relative flex h-10 w-10 items-center justify-center gap-2 rounded-xl border border-line bg-white/5 text-sm transition hover:bg-white/10 sm:w-auto sm:px-3"
          >
            <Ticket className="h-4 w-4" />
            <span className="hidden font-semibold sm:inline">My tickets</span>
            {ticketCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black shadow-md">
                {ticketCount}
              </span>
            )}
          </Link>

          {/* City Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              aria-label={`City: ${currentCity.name}`}
              className="flex h-10 items-center gap-1.5 rounded-xl border border-line bg-white/5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold transition hover:bg-white/10"
            >
              <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
              <span>{currentCity.name}</span>
              <ChevronDown
                className={`h-3 w-3 text-white/50 transition-transform duration-200 ${
                  cityDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-line bg-ink-2/95 p-1.5 shadow-2xl backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Select City
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setCity(city.id);
                      setCityDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                      city.id === currentCity.id
                        ? "bg-gold text-black font-bold"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{city.name}</span>
                    <span
                      className={`text-[10px] ${
                        city.id === currentCity.id ? "text-black/60" : "text-white/40"
                      }`}
                    >
                      {city.state}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

