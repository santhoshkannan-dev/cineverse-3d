"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MOVIES, Movie } from "@/data/movies";
import TrailerModal from "@/components/TrailerModal";

// Lehmer (Park-Miller) LCG pseudo-random generator
function lehmer(seed: number) {
  return () => ((seed = (16807 * seed) % 0x7fffffff) - 1) / 0x7ffffffe;
}

const starsRnd = lehmer(7);
const STARS = Array.from({ length: 140 }, () => ({
  x: 100 * starsRnd(),
  y: 58 * starsRnd(),
  s: 1.6 * starsRnd() + 0.4,
  o: 0.6 * starsRnd() + 0.2,
  d: 4 * starsRnd(),
}));

const SHOOTING_STARS = [
  { x: 18, y: 8, d: 2, len: 140 },
  { x: 72, y: 4, d: 9, len: 180 },
  { x: 46, y: 14, d: 15, len: 120 },
];

// Pre-computed silhouette grass blades along the horizon
const GRASS_PATH = (() => {
  const rnd = lehmer(42);
  let d = "M0 200 ";
  for (let a = 0; a <= 1000; a += 4 + 5 * rnd()) {
    const s = 1 - Math.abs(a - 500) / 500;
    const r = 30 + 70 * rnd() + s * s * 90;
    const n = (rnd() - 0.5) * 26;
    d += `L${a.toFixed(1)} 200 Q${(a + 0.4 * n).toFixed(1)} ${(200 - 0.5 * r).toFixed(1)} ${(a + n).toFixed(1)} ${(200 - r).toFixed(1)} Q${(a + 2 + 0.4 * n).toFixed(1)} ${(200 - 0.5 * r).toFixed(1)} ${(a + 3).toFixed(1)} 200 `;
  }
  return d + "L1000 200 Z";
})();

const snapTo = (val: number, step: number) => Math.round(val / step) * step;
const normalizeAngle = (angle: number) => ((angle % 360) + 540) % 360 - 180;

export default function PanoramaHero() {
  const router = useRouter();
  const movies = useMemo(() => MOVIES.slice(0, 24), []);
  const count = movies.length;
  const angleStep = 360 / count;

  const [windowWidth, setWindowWidth] = useState(1440);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const shadesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);

  // Physics & Inertia references
  const currentAngle = useRef(-(2 * angleStep));
  const angularVelocity = useRef(0);
  const targetAngle = useRef<number | null>(null);
  const lastAdvanceTime = useRef(0);
  const pointerDrag = useRef<{ x: number; rot: number; moved: boolean; t: number } | null>(null);
  const isHovered = useRef(false);
  const isModalOpen = useRef(false);
  const mouseCoords = useRef({ x: 0, y: 0, sx: 0, sy: 0 });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Geometry calculations
  const baseSize = windowWidth < 768 ? 3.2 * windowWidth : Math.max(windowWidth, 900);
  const radius = 0.6 * baseSize;
  const depth = 0.42 * baseSize;
  const posterWidth = 2 * radius * Math.tan(((angleStep / 2) * Math.PI) / 180) * 0.9;
  const posterHeight = 1.5 * posterWidth;
  const titleSpace = 0.15 * posterHeight;

  const handleStep = (direction: number) => {
    targetAngle.current = snapTo(targetAngle.current ?? currentAngle.current, angleStep) - direction * angleStep;
    angularVelocity.current = 0;
  };

  // Main 60fps physics & 3D render loop
  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animId = 0;
    let lastTime = performance.now();
    let prevActive = -1;
    lastAdvanceTime.current = lastTime;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const isPaused = isHovered.current || isModalOpen.current || reducedMotion;

      if (pointerDrag.current) {
        lastAdvanceTime.current = now;
      } else if (Math.abs(angularVelocity.current) > 25) {
        currentAngle.current += angularVelocity.current * dt;
        angularVelocity.current *= Math.pow(0.03, dt);
        if (Math.abs(angularVelocity.current) <= 25) {
          targetAngle.current = snapTo(currentAngle.current, angleStep);
        }
      } else if (targetAngle.current !== null) {
        currentAngle.current += (targetAngle.current - currentAngle.current) * (1 - Math.exp(-5.5 * dt));
        if (Math.abs(targetAngle.current - currentAngle.current) < 0.02) {
          currentAngle.current = targetAngle.current;
          targetAngle.current = null;
          lastAdvanceTime.current = now;
        }
      } else if (isPaused) {
        lastAdvanceTime.current = now - Math.min(now - lastAdvanceTime.current, 5096);
      } else if (now - lastAdvanceTime.current > 5200) {
        targetAngle.current = snapTo(currentAngle.current, angleStep) - angleStep;
      }

      // Progress bar fill
      const progress = targetAngle.current !== null || pointerDrag.current ? 0 : Math.min((now - lastAdvanceTime.current) / 5200, 1);
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // Smooth mouse parallax
      const m = mouseCoords.current;
      m.sx += (m.x - m.sx) * (1 - Math.exp(-3 * dt));
      m.sy += (m.y - m.sy) * (1 - Math.exp(-3 * dt));

      if (stageRef.current) {
        stageRef.current.style.perspectiveOrigin = `${50 - 7 * m.sx}% ${48 - 5 * m.sy}%`;
      }
      if (starsRef.current) {
        starsRef.current.style.transform = `translate3d(${-18 * m.sx}px, ${-10 * m.sy}px, 0)`;
      }

      // Position each poster card around the cylinder
      let activeIndex = 0;
      let minAngle = 999;

      cardsRef.current.forEach((el, idx) => {
        if (!el) return;
        const angle = normalizeAngle(idx * angleStep + currentAngle.current);
        const absAngle = Math.abs(angle);

        if (absAngle < minAngle) {
          activeIndex = idx;
          minAngle = absAngle;
        }

        const popForward = Math.max(0, 1 - absAngle / angleStep) * radius * 0.07;
        el.style.transform = `translateZ(${depth}px) rotateY(${angle}deg) translateZ(${-radius + popForward}px)`;

        const isVisible = absAngle < 66;
        el.style.opacity = isVisible ? "1" : "0";
        el.style.pointerEvents = isVisible ? "" : "none";

        const shade = shadesRef.current[idx];
        if (shade) {
          shade.style.opacity = String(Math.min(0.72, Math.pow(absAngle / 66, 1.3) * 0.9));
        }
      });

      if (activeIndex !== prevActive) {
        setCurrentIndex((prevActive = activeIndex));
      }

      animId = requestAnimationFrame(tick);
    };

    let isIntersecting = true;
    const startLoop = () => {
      cancelAnimationFrame(animId);
      animId = 0;
      if (isIntersecting && !document.hidden) {
        lastTime = performance.now();
        animId = requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      startLoop();
    });

    if (stageRef.current) observer.observe(stageRef.current);
    document.addEventListener("visibilitychange", startLoop);
    startLoop();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", startLoop);
    };
  }, [depth, radius, angleStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.scrollY > 0.6 * window.innerHeight || (e.target as HTMLElement)?.closest("input,textarea,select")) {
        return;
      }
      if (e.key === "ArrowRight") {
        handleStep(1);
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        handleStep(-1);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [angleStep]);

  useEffect(() => {
    isModalOpen.current = trailerOpen;
  }, [trailerOpen]);

  const activeMovie = movies[currentIndex] || movies[0];
  const [moodPrimary, moodSecondary] = activeMovie.mood;

  const handlePointerEnd = () => {
    if (pointerDrag.current) {
      if (Math.abs(angularVelocity.current) <= 25) {
        targetAngle.current = snapTo(currentAngle.current, angleStep);
      }
      setTimeout(() => {
        pointerDrag.current = null;
      });
    }
  };

  const handlePosterClick = (movie: Movie, idx: number) => {
    if (pointerDrag.current?.moved) return;

    if (idx !== currentIndex) {
      const stepAngle = normalizeAngle(idx * angleStep + currentAngle.current);
      targetAngle.current = snapTo(currentAngle.current - stepAngle, angleStep);
      angularVelocity.current = 0;
      return;
    }

    router.push(`/movie/${movie.slug}`);
  };

  return (
    <section
      ref={containerRef}
      className="relative isolate h-[100dvh] min-h-[640px] cursor-grab select-none overflow-hidden bg-[#02030a] active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("[data-hud]")) return;
        pointerDrag.current = {
          x: e.clientX,
          rot: currentAngle.current,
          moved: false,
          t: performance.now(),
        };
        angularVelocity.current = 0;
        targetAngle.current = null;
      }}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          mouseCoords.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouseCoords.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        }

        const drag = pointerDrag.current;
        if (!drag) return;

        const dx = e.clientX - drag.x;
        if (Math.abs(dx) > 6) drag.moved = true;

        const newRot = drag.rot + (90 / baseSize) * dx;
        const now = performance.now();
        angularVelocity.current = ((newRot - currentAngle.current) / Math.max(now - drag.t, 1)) * 1000;
        drag.t = now;
        currentAngle.current = newRot;
      }}
      onPointerUp={handlePointerEnd}
      onPointerLeave={() => {
        handlePointerEnd();
        mouseCoords.current.x = 0;
        mouseCoords.current.y = 0;
      }}
      onPointerCancel={handlePointerEnd}
      aria-roledescription="carousel"
      aria-label="Now showing movies"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(120%_70%_at_50%_0%,#0b1430_0%,#050816_45%,#02030a_75%)]" />

      {/* Mood color ambient backdrop */}
      <AnimatePresence>
        <motion.div
          key={activeMovie.slug}
          aria-hidden="true"
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <div
            className="absolute -inset-[10%] hidden scale-110 bg-cover bg-center opacity-[0.17] blur-[80px] saturate-150 md:block"
            style={{
              backgroundImage: `url(/posters/${activeMovie.slug}.webp), radial-gradient(${moodPrimary}, ${moodSecondary})`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(70% 55% at 50% 60%, ${moodPrimary}22, transparent 70%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(130%_90%_at_50%_45%,transparent_40%,#02030a_95%)]" />

      {/* Stars layer with parallax */}
      <div ref={starsRef} className="absolute -inset-6 -z-10 will-change-transform pointer-events-none">
        {STARS.map((star, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              opacity: star.o,
              animation: `pano-twinkle 4s ${star.d}s ease-in-out infinite`,
            }}
          />
        ))}
        {SHOOTING_STARS.map((sStar, idx) => (
          <span
            key={idx}
            aria-hidden="true"
            className="absolute h-px rounded-full bg-gradient-to-l from-white to-transparent opacity-0"
            style={{
              left: `${sStar.x}%`,
              top: `${sStar.y}%`,
              width: sStar.len,
              animation: `pano-shoot 18s ${sStar.d}s ease-out infinite`,
            }}
          />
        ))}

        {/* Top glowing blue sphere / moon */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 0.36 * baseSize,
            height: 0.36 * baseSize,
            top: -(0.24 * baseSize) + 24,
            background:
              "radial-gradient(circle at 50% 92%, #9fd4ff 0%, #3b86e8 10%, #1a4fa8 24%, #0c2a63 42%, #06142f 62%, #030a18 80%)",
            boxShadow:
              "0 0 140px 30px rgb(56 132 255 / 0.28), inset 0 -18px 50px rgb(160 210 255 / 0.55)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-40 mix-blend-screen"
            style={{
              background:
                "radial-gradient(60% 18% at 38% 84%, #cfe8ff55, transparent), radial-gradient(40% 12% at 66% 90%, #cfe8ff44, transparent)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full opacity-50 mix-blend-screen transition-colors duration-[1400ms]"
            style={{
              backgroundColor: moodPrimary,
              maskImage: "radial-gradient(circle at 50% 100%, #000 0%, transparent 38%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 100%, #000 0%, transparent 38%)",
            }}
          />
        </div>
      </div>

      {/* Spotlight cone beam shining down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 opacity-50 mix-blend-screen md:blur-[18px] transition-[background] duration-1000"
        style={{
          top: 0.1 * baseSize,
          width: 2.6 * posterWidth,
          height: `calc(56% - ${0.1 * baseSize}px)`,
          clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)",
          background: `linear-gradient(to bottom, ${moodPrimary}55, ${moodPrimary}18 60%, transparent)`,
          animation: "pano-flicker 6s steps(1) infinite",
        }}
      />

      {/* Center Top Brand & Drag Instruction Header */}
      <div className="pointer-events-none absolute inset-x-0 top-[13%] z-10 flex flex-col items-center text-center">
        <p className="font-display text-[clamp(30px,3.4vw,54px)] uppercase leading-none tracking-[0.06em] text-white drop-shadow-[0_0_30px_rgb(120_170_255/0.6)]">
          Cine<span className="text-gold">verse</span>
        </p>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/50 md:text-[11px]">
          Drag to explore &middot; Tap a screen to book
        </p>
      </div>

      {/* 3D Cylinder Carousel Stage */}
      <div
        ref={stageRef}
        className="absolute inset-0"
        style={{ perspective: depth, perspectiveOrigin: "50% 48%" }}
      >
        <div className="absolute left-1/2 top-[56%]" style={{ transformStyle: "preserve-3d" }}>
          {movies.map((movie, idx) => {
            const isHighlighted = currentIndex === idx || hoveredIndex === idx;
            const isActive = currentIndex === idx;

            return (
              <div
                key={movie.slug}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="group absolute"
                style={{
                  width: posterWidth,
                  height: posterHeight + titleSpace,
                  left: -posterWidth / 2,
                  top: -posterHeight / 2 - titleSpace,
                  opacity: 0,
                }}
                onPointerEnter={() => {
                  isHovered.current = true;
                  setHoveredIndex(idx);
                }}
                onPointerLeave={() => {
                  isHovered.current = false;
                  setHoveredIndex(null);
                }}
              >
                {/* Floating Movie Title above poster in 3D */}
                <p
                  className="absolute inset-x-0 top-0 flex items-end justify-center whitespace-nowrap text-center font-light uppercase leading-none text-white/70 transition-colors duration-500"
                  style={{
                    height: titleSpace,
                    paddingBottom: 0.045 * posterHeight,
                    fontSize: Math.min(
                      0.085 * posterWidth,
                      (1.6 * posterWidth) / Math.max(movie.title.length, 1)
                    ),
                    letterSpacing: "0.06em",
                    color: isHighlighted ? "#fff" : undefined,
                    textShadow: isHighlighted ? `0 0 ${0.1 * posterWidth}px ${movie.mood[0]}` : undefined,
                  }}
                >
                  {movie.title}
                </p>

                {/* Poster Card Button */}
                <button
                  ref={(el) => {
                    buttonsRef.current[idx] = el;
                  }}
                  onClick={() => handlePosterClick(movie, idx)}
                  aria-label={isActive ? `Open ${movie.title}` : `Bring ${movie.title} to the front`}
                  style={{
                    height: posterHeight,
                    boxShadow: isHighlighted
                      ? `0 0 ${0.3 * posterWidth}px ${movie.mood[0]}99, 0 0 ${0.06 * posterWidth}px ${movie.mood[0]}`
                      : "0 0 30px rgb(0 0 0 / 0.6)",
                  }}
                  className="absolute inset-x-0 bottom-0 block w-full overflow-hidden bg-black outline-none ring-1 ring-white/10 transition-[box-shadow,transform] duration-500 group-hover:-translate-y-[3%] focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Image
                    src={`/posters/${movie.slug}.webp`}
                    alt={movie.title}
                    fill
                    priority={idx < 4}
                    sizes="340px"
                    className="h-full w-full object-cover"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-white/[0.14]" />
                  {isActive && (
                    <span
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      style={{ animation: "pano-sheen 3.2s 0.4s ease-in-out infinite" }}
                    />
                  )}
                  <span
                    ref={(el) => {
                      shadesRef.current[idx] = el;
                    }}
                    className="pointer-events-none absolute inset-0 bg-[#02030a]"
                  />
                </button>

                {/* Inverted Floor Reflection */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 overflow-hidden"
                  style={{
                    top: titleSpace + 1.02 * posterHeight,
                    height: 0.9 * posterHeight,
                    transform: "scaleY(-1)",
                    opacity: isActive ? 0.55 : 0.32,
                    maskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
                    WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
                  }}
                >
                  <Image
                    src={`/posters/${movie.slug}.webp`}
                    alt=""
                    fill
                    sizes="340px"
                    className="h-[111%] w-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floor Overlays */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent via-[#02030a]/50 to-[#02030a]" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] opacity-60 mix-blend-screen"
        style={{
          background: "radial-gradient(30% 45% at 50% 30%, rgb(70 150 255 / 0.35), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] mix-blend-screen transition-[background] duration-1000"
        style={{
          background: `radial-gradient(18% 30% at 50% 22%, ${moodPrimary}40, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%] opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgb(255 255 255 / 0.5) 0 1px, transparent 1px 9px)",
          maskImage: "linear-gradient(to bottom, transparent, #000 40%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, transparent)",
        }}
      />

      {/* Silhouette Grass Along the Bottom Edge */}
      <svg
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] w-full"
        aria-hidden="true"
      >
        <path d={GRASS_PATH} fill="#010205" />
      </svg>

      {/* Floating Bottom HUD Card */}
      <div
        data-hud="true"
        className="absolute inset-x-0 bottom-[4%] z-20 flex cursor-default justify-center px-4 md:bottom-[5%]"
      >
        <div className="relative flex w-full max-w-[720px] items-center gap-3 md:gap-5">
          {/* Previous Button */}
          <button
            onClick={() => handleStep(-1)}
            aria-label="Previous movie"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-black/60 text-white/80 transition hover:border-white/40 hover:text-white md:h-12 md:w-12 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.2]" />
          </button>

          {/* Central Movie Card */}
          <div
            className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/70 px-4 py-3 md:bg-black/45 md:backdrop-blur-xl md:px-6 md:py-4 shadow-2xl"
            style={{
              boxShadow: `0 20px 60px -20px ${moodPrimary}66, inset 0 1px 0 rgb(255 255 255 / 0.06)`,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeMovie.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: moodPrimary,
                        boxShadow: `0 0 10px ${moodPrimary}`,
                      }}
                    />
                    {activeMovie.status === "now"
                      ? "Now showing"
                      : activeMovie.status === "prebook"
                      ? "Pre-booking open"
                      : `Releasing ${activeMovie.release}`}
                  </div>
                  <p className="mt-1 truncate font-display text-[clamp(24px,2.6vw,36px)] uppercase leading-none tracking-wide text-white">
                    {activeMovie.title}
                  </p>
                  <p className="mt-1.5 truncate text-xs text-white/60">
                    <span className="mr-2 rounded border border-white/20 px-1 py-px text-[10px] text-white/70">
                      {activeMovie.cert}
                    </span>
                    {activeMovie.lang} &middot; {activeMovie.genres.slice(0, 2).join(", ")} &middot;{" "}
                    {activeMovie.runtime} &middot;{" "}
                    <span className="text-gold">&#9733; {activeMovie.rating}</span>
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  {activeMovie.trailerId && (
                    <button
                      onClick={() => setTrailerOpen(true)}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/85 sm:px-4 transition hover:border-white/40 hover:text-white"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Trailer
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/book/${activeMovie.slug}`)}
                    className="flex-1 whitespace-nowrap rounded-full bg-gold px-4 py-2 text-xs font-bold text-black sm:px-5 transition hover:brightness-110 md:flex-none shadow-[0_0_24px_rgb(245_185_66/0.35)]"
                  >
                    {activeMovie.status === "now" ? "Book tickets" : "Pre-book"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Progress Bar */}
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
              <span
                ref={progressBarRef}
                className="block h-full origin-left"
                style={{
                  background: `linear-gradient(90deg, ${moodPrimary}, ${moodSecondary})`,
                  transform: "scaleX(0)",
                }}
              />
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => handleStep(1)}
            aria-label="Next movie"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-black/60 text-white/80 transition hover:border-white/40 hover:text-white md:h-12 md:w-12 shadow-lg"
          >
            <ChevronRight className="h-4 w-4 stroke-[2.2]" />
          </button>

          {/* Slide Counter */}
          <p className="absolute -top-6 right-14 font-mono text-[11px] tracking-widest text-white/40 md:right-[68px]">
            <span className="text-white/80">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {movies.length}
          </p>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerId={activeMovie.trailerId}
        movieTitle={activeMovie.title}
      />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pano-twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        @keyframes pano-shoot {
          0% { opacity: 0; transform: translate(0, 0) rotate(-24deg); }
          1% { opacity: 1; }
          5% { opacity: 0; transform: translate(-340px, 150px) rotate(-24deg); }
          100% { opacity: 0; }
        }
        @keyframes pano-sheen {
          0% { transform: translateX(0) skewX(-12deg); }
          60%, 100% { transform: translateX(400%) skewX(-12deg); }
        }
        @keyframes pano-flicker {
          0%, 100% { opacity: 0.6; }
          47% { opacity: 0.5; }
          48% { opacity: 0.68; }
          83% { opacity: 0.55; }
        }
      `}</style>
    </section>
  );
}
