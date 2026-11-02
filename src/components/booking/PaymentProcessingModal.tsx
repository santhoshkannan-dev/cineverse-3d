"use client";

import { useEffect, useState, useRef } from "react";
import {
  ShieldCheck,
  CreditCard,
  Ticket,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  amount: number;
  movieTitle: string;
  seats: string[];
  payMethod: "upi" | "card" | "netbanking";
  onComplete: () => void;
}

const STAGES = [
  {
    key: "encrypt",
    title: "Securing 256-Bit Channel",
    subtitle: "Establishing cryptographic handshake with banking gateway...",
    stepNumber: 1,
  },
  {
    key: "authorize",
    title: "Authorizing Payment",
    subtitle: "Verifying credentials & processing instant settlement...",
    stepNumber: 2,
  },
  {
    key: "minting",
    title: "Minting Digital E-Ticket",
    subtitle: "Locking reserved seats & generating secure hologram QR...",
    stepNumber: 3,
  },
  {
    key: "success",
    title: "Payment Approved!",
    subtitle: "Transaction verified · Your tickets are ready",
    stepNumber: 4,
  },
];

export default function PaymentProcessingModal({
  isOpen,
  amount,
  movieTitle,
  seats,
  payMethod,
  onComplete,
}: PaymentProcessingModalProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any pending timers on unmount/re-trigger
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!isOpen) {
      setIsVisible(false);
      setIsClosing(false);
      setCurrentStageIndex(0);
      setProgress(15);
      return;
    }

    // Smooth mount frame
    setIsClosing(false);
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
      setProgress(25);
    }, 20);
    timersRef.current.push(enterTimer);

    // Stage 1 -> 2: Authorize (900ms)
    const t1 = setTimeout(() => {
      setCurrentStageIndex(1);
      setProgress(60);
    }, 900);
    timersRef.current.push(t1);

    // Stage 2 -> 3: Minting (1800ms)
    const t2 = setTimeout(() => {
      setCurrentStageIndex(2);
      setProgress(88);
    }, 1800);
    timersRef.current.push(t2);

    // Stage 3 -> 4: Success & Confetti (2600ms)
    const t3 = setTimeout(() => {
      setCurrentStageIndex(3);
      setProgress(100);

      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { x: 0.25, y: 0.6 },
          colors: ["#f5b942", "#2cf5b9", "#ffffff", "#a78bfa"],
        });
        setTimeout(() => {
          confetti({
            particleCount: 65,
            spread: 60,
            origin: { x: 0.75, y: 0.6 },
            colors: ["#f5b942", "#2cf5b9", "#ffffff", "#38bdf8"],
          });
        }, 150);
      } catch {}
    }, 2600);
    timersRef.current.push(t3);

    // Smooth exit transition before calling onComplete (3400ms)
    const t4 = setTimeout(() => {
      setIsClosing(true);
    }, 3350);
    timersRef.current.push(t4);

    const t5 = setTimeout(() => {
      onComplete();
    }, 3650);
    timersRef.current.push(t5);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const currentStage = STAGES[currentStageIndex];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/85 transition-opacity duration-300 ease-out ${
        isVisible && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background ambient lighting pulses */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gold/15 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-mint/15 blur-3xl animate-pulse delay-700" />
      </div>

      {/* Central Futuristic Glassmorphic Vault Card */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#14141e]/95 via-[#0e0e16]/95 to-[#08080d]/98 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 ease-out transform ${
          isVisible && !isClosing
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-3 opacity-0"
        }`}
      >
        {/* Subtle Cyber Grid scanline */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Security & Total Pill */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Lock className="h-3 w-3" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              256-Bit SSL Secure Gateway
            </span>
          </div>
          <div className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold text-gold shadow-sm">
            ₹{amount}
          </div>
        </div>

        {/* Central Interactive Animation Stage */}
        <div className="relative z-10 my-7 flex flex-col items-center justify-center">
          {/* Multi-layered Rotating Rings */}
          <div className="relative flex h-36 w-36 items-center justify-center">
            {/* Outer Counter-Clockwise Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/35 animate-spin-counter" />

            {/* Middle Clockwise Gradient Ring */}
            <div className="absolute inset-2 rounded-full border border-mint/45 shadow-[0_0_20px_rgba(44,245,185,0.2)] animate-spin-clockwise" />

            {/* Pulsing Sonar Wave Rings */}
            <div className="absolute inset-4 rounded-full border border-gold/30 animate-radar" />

            {/* Center Morphing Icon Avatar (Stacked Cross-Fade to eliminate popping/glitches) */}
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-2xl backdrop-blur-md overflow-hidden">
              {/* Stage 1: Shield */}
              <ShieldCheck
                className={`absolute h-10 w-10 text-emerald-400 drop-shadow-[0_0_14px_rgba(52,211,153,0.7)] transition-all duration-500 ease-out ${
                  currentStageIndex === 0
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-75 rotate-12 pointer-events-none"
                }`}
              />

              {/* Stage 2: Card */}
              <CreditCard
                className={`absolute h-10 w-10 text-gold drop-shadow-[0_0_14px_rgba(245,185,66,0.7)] transition-all duration-500 ease-out ${
                  currentStageIndex === 1
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-75 -rotate-12 pointer-events-none"
                }`}
              />

              {/* Stage 3: Ticket */}
              <Ticket
                className={`absolute h-10 w-10 text-cyan-400 drop-shadow-[0_0_14px_rgba(56,189,248,0.7)] transition-all duration-500 ease-out ${
                  currentStageIndex === 2
                    ? "opacity-100 scale-100 rotate-0"
                    : "opacity-0 scale-75 rotate-12 pointer-events-none"
                }`}
              />

              {/* Stage 4: Success */}
              <CheckCircle2
                className={`absolute h-11 w-11 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.9)] transition-all duration-500 ease-out ${
                  currentStageIndex === 3
                    ? "opacity-100 scale-110 rotate-0"
                    : "opacity-0 scale-75 -rotate-12 pointer-events-none"
                }`}
              />

              {/* Smooth GPU Laser Scanline */}
              <div className="pointer-events-none absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-85 shadow-[0_0_8px_#38bdf8] animate-laser" />
            </div>
          </div>

          {/* Fixed-Height Stage Text Container (Completely eliminates layout shifts) */}
          <div className="mt-5 text-center min-h-[64px] flex flex-col justify-center px-2">
            <h3 className="font-display text-xl uppercase tracking-wider text-white transition-opacity duration-300">
              {currentStage.title}
            </h3>
            <p className="mt-1 text-xs text-white/50 leading-relaxed transition-opacity duration-300">
              {currentStage.subtitle}
            </p>
          </div>

          {/* Context Chips (Movie Title, Seats, Payment Method) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
              {movieTitle}
            </span>
            <span className="rounded-lg border border-mint/30 bg-mint/10 px-2.5 py-1 text-[11px] font-bold text-mint">
              Seats: {seats.join(", ")}
            </span>
            <span className="rounded-lg border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
              {payMethod.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stepper Dots & Glowing Progress Track */}
        <div className="relative z-10 space-y-2 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-gold animate-pulse" />
              Step {currentStage.stepNumber} of 4
            </span>
            <span className="font-mono font-bold text-gold">{progress}%</span>
          </div>

          {/* Smooth glowing progress track with ease-out transition */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold via-mint to-emerald-400 shadow-[0_0_12px_rgba(245,185,66,0.6)] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Security Assurance */}
        <div className="relative z-10 mt-4 flex items-center justify-center gap-1.5 text-[10px] text-white/30">
          <Sparkles className="h-3 w-3 text-gold/60" />
          <span>Encrypted PCI-DSS Level 1 Compliant Transaction</span>
        </div>
      </div>
    </div>
  );
}
