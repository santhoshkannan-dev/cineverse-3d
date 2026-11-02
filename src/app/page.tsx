import PanoramaHero from "@/components/PanoramaHero";
import IntroLoader from "@/components/IntroLoader";
import NowShowingSection from "@/components/NowShowingSection";
import Footer from "@/components/Footer";
import { Box, Eye, Map, Zap } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Box,
      title: "3D Seat Selection",
      desc: "Pick seats inside a real-time 3D theatre with physics & presets.",
    },
    {
      icon: Eye,
      title: "View From Your Seat",
      desc: "Preview the exact cinema screen view from any seat before booking.",
    },
    {
      icon: Map,
      title: "Live City Showtimes",
      desc: "Instant seeded showtimes across 5 major cities with distance sorting.",
    },
    {
      icon: Zap,
      title: "Instant E-Tickets",
      desc: "QR code tickets generated on payment & preserved in My Tickets.",
    },
  ];

  return (
    <main className="relative min-h-screen bg-ink">
      {/* Intro Movie Wall & Flying Logo Loader */}
      <IntroLoader />

      {/* 3D Cylindrical Hero Panorama */}
      <PanoramaHero />

      {/* Feature Highlights Strip */}
      <section className="relative z-20 border-y border-line bg-white/[0.015] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white/5 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                    <p className="mt-0.5 text-xs text-white/50">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Movie Catalog */}
      <NowShowingSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

