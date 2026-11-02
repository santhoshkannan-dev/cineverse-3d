"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { getMovieBySlug, Movie } from "@/data/movies";
import { getCityById, getTheatreById, getDateOptions } from "@/data/theatres";
import {
  useBookingStore,
  generateSoldSeats,
  CAMERA_PRESETS,
  CameraPresetKey,
} from "@/data/hall";
import { BookedTicket } from "@/store/userStore";
import SeatPickerStep from "@/components/booking/SeatPickerStep";
import SnacksStep from "@/components/booking/SnacksStep";
import ReviewPayStep from "@/components/booking/ReviewPayStep";
import ConfirmedTicketStep from "@/components/booking/ConfirmedTicketStep";

// Dynamically import Theatre Canvas to ensure SSR: false for WebGL
const TheatreCanvas = dynamic(
  () => import("@/components/theatre/TheatreCanvas"),
  { ssr: false }
);

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default function BookPage({ params }: BookPageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();

  const movie = getMovieBySlug(slug);
  if (!movie) {
    notFound();
  }

  const cityId = searchParams.get("city") || "chennai";
  const theatreId = searchParams.get("theatre") || "";
  const dateIdx = parseInt(searchParams.get("date") || "0", 10);
  const time = searchParams.get("time") || "19:30";
  const format = searchParams.get("format") || "2D";

  const city = getCityById(cityId);
  const theatre = theatreId ? getTheatreById(cityId, theatreId) : undefined;
  const dateOptions = useMemo(() => getDateOptions(7), []);
  const selectedDate = dateOptions[dateIdx] || dateOptions[0];

  // Booking Flow Steps: "seats" -> "snacks" -> "review" -> "confirmed"
  const [step, setStep] = useState<"seats" | "snacks" | "review" | "confirmed">("seats");
  const [confirmedTicket, setConfirmedTicket] = useState<BookedTicket | null>(null);

  // Initialize booking store & generate sold seats for this exact show
  const init = useBookingStore((s) => s.init);
  const preset = useBookingStore((s) => s.preset);
  const goPreset = useBookingStore((s) => s.goPreset);
  const tour = useBookingStore((s) => s.tour);
  const setTour = useBookingStore((s) => s.setTour);
  const lights = useBookingStore((s) => s.lights);
  const setLights = useBookingStore((s) => s.setLights);
  const hd = useBookingStore((s) => s.hd);
  const setHd = useBookingStore((s) => s.setHd);
  const sound = useBookingStore((s) => s.sound);
  const setSound = useBookingStore((s) => s.setSound);

  useEffect(() => {
    const seed = `${slug}|${theatreId}|${dateIdx}|${time}`;
    const soldSet = generateSoldSeats(seed, 0.28);
    init(soldSet);
  }, [slug, theatreId, dateIdx, time, init]);

  const presetKeys: CameraPresetKey[] = ["overview", "stage", "balcony", "top"];

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-ink text-white">
      {/* Top Header Bar */}
      <header className="relative z-30 flex items-center gap-3 sm:gap-4 border-b border-line bg-ink-2/80 px-3 sm:px-6 py-2.5 sm:py-3 backdrop-blur-md">
        <Link
          href={`/movie/${movie.slug}`}
          aria-label="Back to movie details"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg uppercase tracking-wide sm:text-xl text-white">
            {movie.title}
          </h1>
          <p className="truncate text-xs text-white/50">
            {theatre?.name || "Cinema Hall"} · {city.name} · {selectedDate.dow}, {selectedDate.day} {selectedDate.month} · {time} · {format}
          </p>
        </div>

        <span className="hidden rounded-md border border-line px-2 py-1 text-[11px] font-semibold text-white/60 sm:block">
          {movie.cert}
        </span>
      </header>

      {/* Main 3D Theatre & Sidebar Layout */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* 3D Scene Viewport */}
        <section className="relative min-h-[42vh] flex-1 overflow-hidden">
          {/* Top Camera Presets Bar */}
          <div className="absolute left-1/2 top-3 z-20 flex max-w-[calc(100%-24px)] -translate-x-1/2 gap-1 overflow-x-auto whitespace-nowrap rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md [scrollbar-width:none]">
            {presetKeys.map((key) => {
              const active = preset === key && !tour;
              return (
                <button
                  key={key}
                  onClick={() => goPreset(key)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-white text-black font-bold"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {CAMERA_PRESETS[key].label}
                </button>
              );
            })}

            <button
              onClick={() => setTour(!tour)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                tour
                  ? "bg-gold text-black font-bold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>✦ Tour</span>
            </button>
          </div>

          {/* Bottom Right Sound, Lighting & Quality Toggles */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/75 p-1 backdrop-blur-md shadow-lg">
            {/* Screen Playback Sound Toggle */}
            <button
              onClick={() => setSound(!sound)}
              title={sound ? "Mute Screen Sound" : "Turn On Screen Sound"}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                sound
                  ? "bg-mint text-black font-bold shadow-[0_0_12px_rgba(44,245,185,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span>{sound ? "Sound ON" : "Sound OFF"}</span>
            </button>

            <button
              onClick={() => setLights(!lights)}
              title="Toggle House Lights"
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                lights ? "bg-white/20 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {lights ? <Sun className="h-3 w-3 text-gold" /> : <Moon className="h-3 w-3" />}
              <span className="hidden sm:inline">Lights</span>
            </button>

            <button
              onClick={() => setHd(!hd)}
              className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                hd ? "bg-gold text-black" : "text-white/50 hover:text-white"
              }`}
            >
              HD
            </button>
          </div>

          {/* Bottom Left Gesture Hint */}
          <p className="pointer-events-none absolute bottom-4 left-4 z-20 hidden text-[11px] text-white/40 md:block">
            Drag to orbit · Scroll to zoom · Double-click any seat for POV
          </p>

          {/* 3D WebGL Canvas */}
          <TheatreCanvas movie={movie} />
        </section>

        {/* Sidebar / Bottom Sheet */}
        <aside className="relative z-20 flex w-full shrink-0 flex-col rounded-t-3xl border-t border-line bg-ink-2 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] lg:w-[380px] lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none">
          {step === "seats" && (
            <SeatPickerStep onProceed={() => setStep("snacks")} />
          )}

          {step === "snacks" && (
            <SnacksStep
              onBack={() => setStep("seats")}
              onProceed={() => setStep("review")}
            />
          )}

          {step === "review" && (
            <ReviewPayStep
              movie={movie}
              theatre={theatre}
              cityName={city.name}
              cityId={city.id}
              dateStr={`${selectedDate.dow}, ${selectedDate.day} ${selectedDate.month}`}
              dateIdx={dateIdx}
              time={time}
              format={format}
              onBack={() => setStep("snacks")}
              onSuccess={(ticket) => {
                setConfirmedTicket(ticket);
                setStep("confirmed");
              }}
            />
          )}

          {step === "confirmed" && confirmedTicket && (
            <ConfirmedTicketStep ticket={confirmedTicket} />
          )}
        </aside>
      </div>
    </main>
  );
}

