"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Ticket, Clock, Play } from "lucide-react";
import { ALL_MOVIES, LANGUAGES, Movie } from "@/data/movies";
import TrailerModal from "@/components/TrailerModal";

export default function NowShowingSection() {
  const [activeTab, setActiveTab] = useState<"now" | "soon">("now");
  const [selectedLang, setSelectedLang] = useState<string>("All");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  const allGenres = Array.from(
    new Set(ALL_MOVIES.flatMap((m) => m.genres))
  ).slice(0, 8);

  const filteredMovies = ALL_MOVIES.filter((m) => {
    if (activeTab === "now" && m.status === "soon") return false;
    if (activeTab === "soon" && m.status !== "soon") return false;
    if (selectedLang !== "All" && !m.langs.includes(selectedLang)) return false;
    if (selectedGenre !== "All" && !m.genres.includes(selectedGenre)) return false;
    return true;
  });

  return (
    <section id="now-showing" className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-line pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Cineverse Experience
          </span>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl uppercase tracking-wider text-white">
            {activeTab === "now" ? "Now Showing in Theatres" : "Coming Soon"}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-2xl border border-line bg-white/5 p-1 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("now")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "now"
                ? "bg-gold text-black shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => setActiveTab("soon")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "soon"
                ? "bg-gold text-black shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 [scrollbar-width:none]">
          <button
            onClick={() => setSelectedLang("All")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              selectedLang === "All"
                ? "border-white bg-white text-black font-bold"
                : "border-line bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            All Languages
          </button>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                selectedLang === lang
                  ? "border-white bg-white text-black font-bold"
                  : "border-line bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Genre Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Genre:</span>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-xl border border-line bg-ink-2 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-gold"
          >
            <option value="All">All Genres</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredMovies.map((movie) => (
          <div
            key={movie.slug}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white/[0.02] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] hover:-translate-y-1"
          >
            {/* Poster & Badges */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/5">
              <Image
                src={`/posters/${movie.slug}.webp`}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Rating badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-lg border border-black/40 bg-black/70 px-2 py-0.5 text-[11px] font-bold text-gold backdrop-blur-md">
                <Star className="h-3 w-3 fill-gold" />
                <span>{movie.rating}</span>
              </div>

              {/* Cert badge */}
              <div className="absolute top-2.5 right-2.5 rounded-md border border-white/20 bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white/80 backdrop-blur-md">
                {movie.cert}
              </div>

              {/* Trailer Quick Button */}
              {movie.trailerId && (
                <button
                  onClick={() => setTrailerMovie(movie)}
                  aria-label={`Watch ${movie.title} trailer`}
                  className="absolute bottom-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-black/75 text-white/80 opacity-0 transition group-hover:opacity-100 hover:bg-gold hover:text-black"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              )}
            </div>

            {/* Movie Info */}
            <div className="flex flex-1 flex-col justify-between p-3.5">
              <div>
                <div className="flex items-center gap-2 text-[10px] text-white/50 mb-1">
                  <span>{movie.lang}</span>
                  <span>•</span>
                  <span>{movie.runtime}</span>
                </div>

                <h3 className="truncate font-display text-lg uppercase tracking-wide text-white group-hover:text-gold transition-colors">
                  {movie.title}
                </h3>

                <p className="truncate text-xs text-white/60 mt-0.5">
                  {movie.genres.join(", ")}
                </p>
              </div>

              {/* Action */}
              <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between">
                <span className="text-[11px] font-medium text-white/40">
                  {movie.release}
                </span>

                <Link
                  href={`/movie/${movie.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gold/90 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-gold hover:scale-105"
                >
                  <Ticket className="h-3 w-3" />
                  <span>Book</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          isOpen={!!trailerMovie}
          onClose={() => setTrailerMovie(null)}
          trailerId={trailerMovie.trailerId}
          movieTitle={trailerMovie.title}
        />
      )}
    </section>
  );
}

