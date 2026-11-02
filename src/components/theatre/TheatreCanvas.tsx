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
          <ambientLight intensity={lights ? 1.6 : 0.95} color={lights ? "#fff8f0" : "#dbeafe"} />

          {/* Overhead directional key light */}
          <directionalLight
            position={[0, 20, 6]}
            intensity={lights ? 2.4 : 1.3}
            color="#ffffff"
          />

          {/* Rear fill light for depth & seat silhouettes */}
          <directionalLight
            position={[0, 16, 32]}
            intensity={lights ? 1.5 : 0.8}
            color="#e2e8f0"
          />

          {/* Side cross lights for armrests and cushion contours */}
          <directionalLight
            position={[-16, 12, 16]}
            intensity={lights ? 1.2 : 0.6}
            color="#ffe8cc"
          />
          <directionalLight
            position={[16, 12, 16]}
            intensity={lights ? 1.2 : 0.6}
            color="#ffe8cc"
          />

          {/* Ceiling warm downlights */}
          <pointLight
            position={[0, 14, 8]}
            intensity={lights ? 40 : 12}
            distance={35}
            decay={1.5}
            color="#fff1dc"
          />
          <pointLight
            position={[0, 14, 18]}
            intensity={lights ? 40 : 12}
            distance={35}
            decay={1.5}
            color="#fff1dc"
          />
          <pointLight
            position={[0, 14, 27]}
            intensity={lights ? 35 : 10}
            distance={32}
            decay={1.5}
            color="#fff1dc"
          />

          {/* Screen projector ambient beam */}
          <spotLight
            position={[0, 10, 0]}
            intensity={lights ? 10 : 16}
            angle={0.85}
            penumbra={0.7}
            distance={50}
            decay={1.2}
            color={movie.mood[0] || "#93c5fd"}
          />

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

