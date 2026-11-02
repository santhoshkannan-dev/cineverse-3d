"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { SCREEN_DIMENSIONS } from "@/data/hall";
import { Movie } from "@/data/movies";

interface CinemaScreenProps {
  movie: Movie;
  lights: boolean;
}

export default function CinemaScreen({ movie, lights }: CinemaScreenProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Screen corners for visibility calculation
  const halfW = SCREEN_DIMENSIONS.width / 2 - 0.3;
  const halfH = SCREEN_DIMENSIONS.height / 2 - 0.3;
  const corners = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0.2),
      new THREE.Vector3(-halfW, halfH, 0.2),
      new THREE.Vector3(halfW, halfH, 0.2),
      new THREE.Vector3(-halfW, -halfH, 0.2),
      new THREE.Vector3(halfW, -halfH, 0.2),
    ];
  }, [halfW, halfH]);

  const screenWorldPos = useMemo(() => new THREE.Vector3(), []);
  const camToScreenDir = useMemo(() => new THREE.Vector3(), []);
  const isVisibleRef = useRef(true);

  // Screen ambient light pulsation
  useFrame(({ clock, camera }) => {
    const elapsed = clock.elapsedTime;
    if (lightRef.current) {
      const baseIntensity = lights ? 3.0 : 7.0;
      lightRef.current.intensity = baseIntensity + 0.8 * Math.sin(1.7 * elapsed);
    }

    // Check angle from camera to screen
    screenWorldPos.set(0, SCREEN_DIMENSIONS.y, SCREEN_DIMENSIONS.z);
    camToScreenDir.copy(camera.position).sub(screenWorldPos).normalize();

    // If camera is behind the screen (z < 0) or too far off to the side
    const visible = camToScreenDir.z > 0.05;
    if (visible !== isVisibleRef.current) {
      isVisibleRef.current = visible;
      if (containerRef.current) {
        containerRef.current.style.transition = "opacity 0.5s ease";
        containerRef.current.style.opacity = visible ? "1" : "0";
      }
    }
  });

  const trailerUrl = movie.trailerId
    ? `https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&loop=1&playlist=${movie.trailerId}`
    : null;

  return (
    <group position={[0, SCREEN_DIMENSIONS.y, SCREEN_DIMENSIONS.z]}>
      {/* Screen Curved Frame / Border */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[SCREEN_DIMENSIONS.width + 0.6, SCREEN_DIMENSIONS.height + 0.6, 0.2]} />
        <meshStandardMaterial color="#050508" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Screen Canvas Mesh (White reflective canvas) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[SCREEN_DIMENSIONS.width, SCREEN_DIMENSIONS.height]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Screen Ambient Point Light projecting into the hall */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 2.5]}
        color={movie.mood[0] || "#ffffff"}
        distance={35}
        decay={2}
      />

      {/* HTML Video Trailer layer mapped cleanly onto the screen */}
      <Html
        transform
        distanceFactor={6.2}
        position={[0, 0, 0.05]}
        className="pointer-events-none select-none"
      >
        <div
          ref={containerRef}
          style={{
            width: `${1280}px`,
            height: `${Math.round((1280 * SCREEN_DIMENSIONS.height) / SCREEN_DIMENSIONS.width)}px`,
          }}
          className="relative overflow-hidden bg-black"
        >
          {trailerUrl ? (
            <iframe
              ref={iframeRef}
              src={trailerUrl}
              title={`${movie.title} trailer`}
              width={1280}
              height={Math.round((1280 * SCREEN_DIMENSIONS.height) / SCREEN_DIMENSIONS.width)}
              allow="autoplay; encrypted-media"
              className="h-full w-full border-0 object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-4xl text-white/40">
              {movie.title}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

