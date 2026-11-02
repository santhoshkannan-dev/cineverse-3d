"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerId?: string;
  movieTitle: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  trailerId,
  movieTitle,
}: TrailerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_20px_70px_rgba(0,0,0,0.8)] z-10 transition-transform duration-300">
        {/* Top header bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-ink-2/80">
          <h3 className="font-display tracking-wider text-base sm:text-lg text-white truncate pr-4">
            {movieTitle} — Official Trailer
          </h3>
          <button
            onClick={onClose}
            aria-label="Close trailer"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video container */}
        <div className="relative aspect-video w-full bg-black">
          {trailerId ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movieTitle} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
              Trailer not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
