"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CinemaScreen from "./CinemaScreen";
import CinemaSeats from "./CinemaSeats";
import AisleStepLights from "./AisleStepLights";
import StarryCeiling from "./StarryCeiling";
import TheatreRoom from "./TheatreRoom";
import TheatreControls from "./TheatreControls";
import { useBookingStore } from "@/data/hall";
import { Movie } from "@/data/movies";

interface TheatreCanvasProps {
  movie: Movie;
}

export default function TheatreCanvas({ movie }: TheatreCanvasProps) {
  const lights = useBookingStore((s) => s.lights);
  const hd = useBookingStore((s) => s.hd);

  return (
    <div className="relative h-full w-full bg-[#050508]">
      <Canvas
        camera={{
          fov: 52,
          near: 0.1,
          far: 120,
          position: [7, 14.6, 19.6],
        }}
        dpr={hd ? [1, 2] : 1}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="h-full w-full"
      >
        <Suspense fallback={null}>
          {/* Base ambient lighting */}
          <ambientLight intensity={lights ? 0.9 : 0.25} />

          {/* House ceiling downlights */}
          {lights && (
            <>
              <pointLight position={[0, 14, 10]} intensity={12} distance={30} decay={2} color="#fff1e0" />
              <pointLight position={[0, 14, 22]} intensity={12} distance={30} decay={2} color="#fff1e0" />
            </>
          )}

          {/* 3D Scene Components */}
          <TheatreRoom />
          <StarryCeiling />
          <CinemaScreen movie={movie} lights={lights} />
          <CinemaSeats />
          <AisleStepLights />

          {/* Camera and presets controller */}
          <TheatreControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

