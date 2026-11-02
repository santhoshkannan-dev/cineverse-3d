"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Heart,
  Play,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getMovieBySlug, Movie } from "@/data/movies";
import {
  useCurrentCity,
  useUserStore,
} from "@/store/userStore";
import {
  getDateOptions,
  getShowsForMovie,
  FORMATS,
  AreaShows,
  Theatre,
  Show,
  getSeatAvailability,
} from "@/data/theatres";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function MoviePage({ params }: PageProps) {
  const { slug } = use(params);
  const movie = getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const currentCity = useCurrentCity();
  const dateOptions = useMemo(() => getDateOptions(7), []);

  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<string>("All");
  const [after9PM, setAfter9PM] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trailerMuted, setTrailerMuted] = useState(true);

  const toggleFavorite = (theatreId: string) => {
    setFavorites((prev) =>
      prev.includes(theatreId)
        ? prev.filter((id) => id !== theatreId)
        : [...prev, theatreId]
    );
  };

  const areaShows: AreaShows[] = useMemo(() => {
    return getShowsForMovie(movie.slug, currentCity, selectedDateIdx);
  }, [movie.slug, currentCity, selectedDateIdx]);

  // Flattened and filtered list of theatres
  const filteredTheatres = useMemo(() => {
    const list: {
      theatre: Theatre;
      areaName: string;
      km: number;
      shows: Show[];
    }[] = [];

    areaShows.forEach((areaShow) => {
      areaShow.theatres.forEach((ts) => {
        const filteredShows = ts.shows.filter((s) => {
          if (selectedFormat !== "All" && s.format !== selectedFormat) return false;
          if (after9PM && s.time < "21:00") return false;
          return true;
        });

        if (filteredShows.length > 0) {
          const dist = 1.6 * Math.hypot(ts.theatre.x, ts.theatre.z) + 0.8;
          list.push({
            theatre: ts.theatre,
            areaName: areaShow.area.name,
            km: Math.round(dist * 10) / 10,
            shows: filteredShows,
          });
        }
      });
    });

    // Sort by favorites first, then distance
    return list.sort((a, b) => {
      const aFav = favorites.includes(a.theatre.id) ? 1 : 0;
      const bFav = favorites.includes(b.theatre.id) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;
      return a.km - b.km;
    });
  }, [areaShows, selectedFormat, after9PM, favorites]);

  // Unique formats available in this movie's shows
  const availableFormats = ["All", ...Array.from(new Set(FORMATS))];

  return (
    <main className="relative min-h-screen bg-ink pt-20">
      {/* Hero Trailer / Backdrop Section */}
      <section className="relative h-[60vh] sm:h-[72vh] w-full overflow-hidden bg-black">
        {movie.trailerId ? (
          <div className="absolute inset-0 pointer-events-none">
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&mute=${
                trailerMuted ? 1 : 0
              }&controls=0&loop=1&playlist=${movie.trailerId}&playsinline=1&rel=0`}
              title={`${movie.title} Background Trailer`}
              allow="autoplay; encrypted-media"
              className="h-[125%] w-[125%] -translate-x-[12.5%] -translate-y-[12.5%] border-0 opacity-40 brightness-90"
            />
          </div>
        ) : (
          <Image
            src={`/posters/${movie.slug}.webp`}
            alt={movie.title}
            fill
            className="object-cover opacity-25 blur-sm"
          />
        )}

        {/* Backdrop gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent" />

        {/* Sound toggle button */}
        {movie.trailerId && (
          <button
            onClick={() => setTrailerMuted(!trailerMuted)}
            aria-label={trailerMuted ? "Unmute trailer" : "Mute trailer"}
            className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/90"
          >
            {trailerMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-gold" />}
          </button>
        )}

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-20 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            {/* Small poster thumbnail */}
            <div className="relative hidden h-56 w-36 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-2xl md:block">
              <Image
                src={`/posters/${movie.slug}.webp`}
                alt={movie.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                <span className="rounded-md border border-line bg-black/60 px-2 py-0.5 font-bold text-gold">
                  {movie.lang}
                </span>
                <span className="rounded-md border border-line bg-black/60 px-2 py-0.5 font-semibold text-white/80">
                  {movie.cert}
                </span>
                <span className="flex items-center gap-1 rounded-md border border-line bg-black/60 px-2 py-0.5 font-bold text-gold">
                  <Star className="h-3.5 w-3.5 fill-gold" />
                  {movie.rating}
                </span>
                <span className="text-white/60">·</span>
                <span className="text-white/70">{movie.runtime}</span>
                <span className="text-white/60">·</span>
                <span className="text-white/70">{movie.release}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white">
                {movie.title}
              </h1>

              <p className="mt-1 text-sm sm:text-base font-medium text-gold/90">
                {movie.tagline}
              </p>

              <p className="mt-2 text-xs sm:text-sm text-white/70 max-w-3xl line-clamp-2 sm:line-clamp-3">
                {movie.synopsis}
              </p>

              {/* Cast & Director */}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/50">
                <div>
                  <span className="text-white/30">Director: </span>
                  <span className="text-white/80 font-medium">{movie.director}</span>
                </div>
                <div>
                  <span className="text-white/30">Cast: </span>
                  <span className="text-white/80 font-medium">
                    {movie.cast.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showtimes & Booking Section */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Date Selector Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 [scrollbar-width:none]">
          {dateOptions.map((opt) => (
            <button
              key={opt.idx}
              onClick={() => setSelectedDateIdx(opt.idx)}
              className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition ${
                opt.idx === selectedDateIdx
                  ? "border-gold bg-gold text-black font-bold shadow-lg shadow-gold/20"
                  : "border-line bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              <span className="text-[11px] uppercase tracking-wider opacity-80">
                {opt.dow}
              </span>
              <span className="text-lg font-display tracking-tight">{opt.day}</span>
              <span className="text-[10px] opacity-70">{opt.month}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          {/* Formats */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {availableFormats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  selectedFormat === fmt
                    ? "border-white bg-white text-black"
                    : "border-line bg-white/[0.02] text-white/60 hover:text-white"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* After 9 PM Toggle */}
            <button
              onClick={() => setAfter9PM(!after9PM)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                after9PM
                  ? "border-white bg-white text-black"
                  : "border-line bg-white/[0.02] text-white/60 hover:text-white"
              }`}
            >
              After 9 PM
            </button>

            {/* View Mode */}
            <div className="hidden sm:flex items-center rounded-xl border border-line bg-white/[0.03] p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                  viewMode === "cards" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                  viewMode === "timeline" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Theatres List */}
        <div className="mt-8 space-y-4">
          {filteredTheatres.length === 0 ? (
            <div className="rounded-3xl border border-line bg-white/[0.02] p-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-white/30" />
              <h3 className="mt-3 text-base font-bold text-white">No shows matching filters</h3>
              <p className="mt-1 text-xs text-white/50">
                Try switching date, removing &apos;After 9 PM&apos;, or choosing &apos;All&apos; formats.
              </p>
            </div>
          ) : (
            filteredTheatres.map(({ theatre, areaName, km, shows }) => {
              const isFav = favorites.includes(theatre.id);

              return (
                <div
                  key={theatre.id}
                  className="rounded-3xl border border-line bg-white/[0.02] p-5 sm:p-6 transition hover:border-white/20 hover:bg-white/[0.03]"
                >
                  {/* Theatre header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {theatre.name}
                        </h3>
                        <button
                          onClick={() => toggleFavorite(theatre.id)}
                          aria-label={isFav ? "Remove favourite" : "Add to favourites"}
                          className="text-white/40 hover:text-rose-400 transition"
                        >
                          <Heart
                            className={`h-4 w-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`}
                          />
                        </button>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                        <span className="flex items-center gap-1 text-gold">
                          <MapPin className="h-3 w-3" />
                          {areaName} · {km} km away
                        </span>
                        <span>•</span>
                        <span>{theatre.screens} screens</span>
                        <span>•</span>
                        <div className="flex flex-wrap gap-1">
                          {theatre.amenities.map((a) => (
                            <span
                              key={a}
                              className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/60"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Showtime Pills */}
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {shows.map((show) => {
                      const avail = getSeatAvailability(show.fill);
                      const bookingUrl = `/book/${movie.slug}?city=${currentCity.id}&theatre=${theatre.id}&date=${selectedDateIdx}&time=${show.time}&format=${encodeURIComponent(
                        show.format
                      )}&lang=${encodeURIComponent(movie.lang)}`;

                      return (
                        <Link
                          key={show.time}
                          href={bookingUrl}
                          className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
                        >
                          <span className="text-sm font-bold text-white group-hover:text-gold transition-colors">
                            {show.label}
                          </span>
                          <span className="text-[10px] font-semibold text-white/60 mt-0.5">
                            {show.format}
                          </span>

                          {/* Live fill indicator badge */}
                          <span
                            className={`mt-1 text-[9px] font-bold uppercase tracking-wider ${
                              avail === "almost-full"
                                ? "text-rose-400"
                                : avail === "filling"
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {avail === "almost-full"
                              ? "Almost full"
                              : avail === "filling"
                              ? "Filling fast"
                              : "Available"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

