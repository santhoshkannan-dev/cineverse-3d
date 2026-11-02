"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Film, MapPin, Star } from "lucide-react";
import { useUserStore, useCurrentCity } from "@/store/userStore";
import { ALL_MOVIES, Movie } from "@/data/movies";
import { getTheatresForCity, Theatre } from "@/data/theatres";

export default function SearchModal() {
  const searchOpen = useUserStore((s) => s.searchOpen);
  const setSearchOpen = useUserStore((s) => s.setSearchOpen);
  const currentCity = useCurrentCity();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingMovies: Movie[] = trimmed
    ? ALL_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(trimmed) ||
          m.lang.toLowerCase().includes(trimmed) ||
          m.director.toLowerCase().includes(trimmed) ||
          m.cast.some((c) => c.toLowerCase().includes(trimmed)) ||
          m.genres.some((g) => g.toLowerCase().includes(trimmed))
      ).slice(0, 8)
    : ALL_MOVIES.slice(0, 6);

  const cityTheatres = getTheatresForCity(currentCity);
  const matchingTheatres: Theatre[] = trimmed
    ? cityTheatres
        .filter((t) => t.name.toLowerCase().includes(trimmed))
        .slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-3 pt-16 sm:p-6 sm:pt-24 backdrop-blur-xl bg-black/70 animate-fade-in">
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-ink-2 shadow-2xl">
        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-6">
          <Search className="h-5 w-5 text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, languages, cast, theatres..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/35 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="ml-2 rounded-lg border border-line px-2 py-1 text-xs text-white/50 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Movies Section */}
          <div>
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-white/40 uppercase tracking-wider">
              <span>{trimmed ? "Matching Movies" : "Popular Movies"}</span>
              <span>{matchingMovies.length} results</span>
            </div>

            {matchingMovies.length === 0 ? (
              <p className="text-xs text-white/40 py-2">No movies match your search.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {matchingMovies.map((movie) => (
                  <Link
                    key={movie.slug}
                    href={`/movie/${movie.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-white/[0.02] p-2.5 transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <Image
                        src={`/posters/${movie.slug}.webp`}
                        alt={movie.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-white group-hover:text-gold transition-colors">
                        {movie.title}
                      </h4>
                      <p className="truncate text-[11px] text-white/50">
                        {movie.lang} · {movie.genres.slice(0, 2).join(", ")}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-0.5 text-gold font-bold">
                          <Star className="h-2.5 w-2.5 fill-gold" />
                          {movie.rating}
                        </span>
                        <span className="text-white/30">|</span>
                        <span className="text-white/50">{movie.runtime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Theatres Section */}
          {matchingTheatres.length > 0 && (
            <div>
              <div className="mb-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                Theatres in {currentCity.name}
              </div>
              <div className="space-y-1.5">
                {matchingTheatres.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-line bg-white/[0.02] px-3.5 py-2.5 text-xs text-white/80"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span className="font-medium text-white">{t.name}</span>
                    </div>
                    <span className="text-[11px] text-white/40">
                      {t.screens} screens · {t.amenities.slice(0, 2).join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

