"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { MOVIES } from "@/data/movies";
import { useUserStore } from "@/store/userStore";

const WIDTHS = [150, 330, 150, 150, 330, 150, 330, 150];
const EXCLUDED_SLUGS = ["goat", "mark-antony", "peddi"];

// Module-level guard so intro doesn't replay on internal client-side navigation
let hasPlayedInSession = false;

function buildPosterWall() {
  const pool = MOVIES.filter((m) => !EXCLUDED_SLUGS.includes(m.slug));
  return Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 16 }, (_, col) => ({
      movie: pool[(11 * row + 7 * col) % pool.length],
      width: WIDTHS[(3 * row + col) % WIDTHS.length],
    }))
  );
}

function CineverseLogo() {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gold text-black shadow-lg">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6V6Z" />
        </svg>
      </span>
      <span className="font-display text-xl tracking-wider text-white">CINEVERSE</span>
    </span>
  );
}

export default function IntroLoader() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [stage, setStage] = useState<"wall" | "logo" | "fly">("wall");
  const [navLogoRect, setNavLogoRect] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    vw: number;
    vh: number;
  } | null>(null);

  const setIntro = useUserStore((s) => s.setIntro);
  const wallData = useMemo(() => buildPosterWall(), []);

  useEffect(() => {
    setIntro(!isDismissed);
  }, [isDismissed, setIntro]);

  useEffect(() => {
    if (hasPlayedInSession) {
      setIsDismissed(true);
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const updateTargetRect = () => {
      const el = document.querySelector("[data-nav-logo]");
      const rect = el?.getBoundingClientRect();
      setNavLogoRect({
        x: rect?.left ?? 32,
        y: rect?.top ?? 28,
        w: rect?.width ?? 170,
        h: rect?.height ?? 32,
        vw: window.innerWidth,
        vh: window.innerHeight,
      });
    };

    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);

    const t1 = setTimeout(() => setStage("logo"), 1100);
    const t2 = setTimeout(() => {
      updateTargetRect();
      setStage("fly");
    }, 1900);
    const t3 = setTimeout(() => {
      hasPlayedInSession = true;
      setIsDismissed(true);
      document.documentElement.style.overflow = "";
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateTargetRect);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleSkip = () => {
    hasPlayedInSession = true;
    setIsDismissed(true);
    document.documentElement.style.overflow = "";
  };

  const deltaX = navLogoRect
    ? navLogoRect.vw / 2 - (navLogoRect.x + navLogoRect.w / 2)
    : 0;
  const deltaY = navLogoRect
    ? navLogoRect.vh / 2 - (navLogoRect.y + navLogoRect.h / 2)
    : 0;
  const scale = navLogoRect
    ? Math.min(5, (0.6 * navLogoRect.vw) / navLogoRect.w)
    : 4;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="cv-intro fixed inset-0 z-[100] overflow-hidden"
        >
          {/* 3D Tilted Movie Poster Wall */}
          <motion.div
            className="absolute inset-0 overflow-hidden bg-black"
            style={{ perspective: 1100 }}
            animate={{ opacity: stage !== "fly" ? 1 : 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute left-1/2 top-1/2 flex flex-col gap-2.5"
              style={{
                transformStyle: "preserve-3d",
                x: "-50%",
                y: "-50%",
              }}
              initial={{
                rotateX: 18,
                rotateY: -22,
                rotateZ: -11,
                scale: 1.25,
                opacity: 0,
              }}
              animate={{
                rotateX: 18,
                rotateY: -22,
                rotateZ: -11,
                scale: stage === "wall" ? 1.05 : 0.95,
                opacity: 1,
              }}
              transition={{
                duration: stage === "wall" ? 1.1 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {wallData.map((row, rowIdx) => (
                <motion.div
                  key={rowIdx}
                  className={`flex gap-2.5 ${rowIdx >= 5 ? "max-md:hidden" : ""}`}
                  initial={{ x: rowIdx % 2 ? -260 : 0 }}
                  animate={{ x: rowIdx % 2 ? 0 : -260 }}
                  transition={{ duration: 2.6, ease: "linear" }}
                >
                  {row.map(({ movie, width }, colIdx) => (
                    <motion.div
                      key={colIdx}
                      className={`relative shrink-0 overflow-hidden rounded-md bg-white/5 shadow-[0_10px_30px_-10px_#000] ${
                        colIdx >= 7 ? "max-md:hidden" : ""
                      }`}
                      style={{ width, height: 210 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.05 + ((5 * rowIdx + 3 * colIdx) % 17) * 0.025,
                        duration: 0.4,
                      }}
                    >
                      <Image
                        src={`/posters/${movie.slug}.webp`}
                        alt={movie.title}
                        fill
                        priority
                        sizes="330px"
                        className="h-full w-full object-cover object-[50%_25%]"
                      />
                      {width > 200 && (
                        <span className="absolute bottom-3 left-4 right-4 truncate font-display text-3xl uppercase leading-none text-white drop-shadow-[0_2px_8px_#000]">
                          {movie.title}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* Radial Vignettes */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_60%_50%,transparent_55%,rgb(0_0_0/0.85)_100%)]" />
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.55),rgb(0_0_0/0.9))]"
              initial={{ opacity: 0 }}
              animate={{ opacity: stage !== "wall" ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-8 left-1/2 h-[2px] w-48 -translate-x-1/2 overflow-hidden rounded-full bg-white/15"
              animate={{ opacity: stage === "wall" ? 1 : 0 }}
            >
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Central Animated Logo flying to Navbar */}
          {navLogoRect && (
            <motion.div
              className="absolute"
              style={{
                left: navLogoRect.x,
                top: navLogoRect.y,
                width: navLogoRect.w,
                height: navLogoRect.h,
              }}
              initial={{
                x: deltaX,
                y: deltaY,
                scale: 0.4 * scale,
                opacity: 0,
                filter: "blur(16px)",
              }}
              animate={
                stage === "wall"
                  ? {
                      x: deltaX,
                      y: deltaY,
                      scale: 0.4 * scale,
                      opacity: 0,
                      filter: "blur(16px)",
                    }
                  : stage === "logo"
                  ? {
                      x: deltaX,
                      y: deltaY,
                      scale: scale,
                      opacity: 1,
                      filter: "blur(0px)",
                    }
                  : {
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px)",
                    }
              }
              transition={
                stage === "fly"
                  ? { duration: 0.65, ease: [0.65, 0, 0.35, 1] }
                  : {
                      type: "spring",
                      stiffness: 140,
                      damping: 14,
                      mass: 0.9,
                      opacity: { duration: 0.3 },
                      filter: { duration: 0.4 },
                    }
              }
            >
              <motion.span
                className="absolute inset-0 -z-10 rounded-full bg-gold blur-2xl"
                animate={{
                  opacity: 0.35 * (stage === "logo" ? 1 : 0),
                  scale: stage === "logo" ? 1.4 : 0.6,
                }}
                transition={{ duration: 0.6 }}
              />
              <CineverseLogo />
            </motion.div>
          )}

          {/* Skip button */}
          <motion.button
            onClick={handleSkip}
            animate={{ opacity: stage !== "fly" ? 1 : 0 }}
            className="absolute right-6 top-6 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur transition hover:text-white"
          >
            Skip &rarr;
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

