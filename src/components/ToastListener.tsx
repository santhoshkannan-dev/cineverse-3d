"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface Toast {
  id: number;
  message: string;
}

export default function ToastListener() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const message = customEvent.detail;
      if (!message) return;

      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };

    window.addEventListener("cv-toast", handleToast);
    return () => window.removeEventListener("cv-toast", handleToast);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-fade-in flex items-center gap-3 rounded-2xl border border-gold/40 bg-ink-2/95 px-4 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur-xl pointer-events-auto transition-all"
        >
          <AlertCircle className="h-5 w-5 text-gold shrink-0" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
