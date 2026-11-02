"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import {
  useBookingStore,
  CAMERA_PRESETS,
  CATEGORY_CAMERA_VIEWS,
  CameraPresetKey,
  CategoryKey,
  HALL_DIMENSIONS,
  SCREEN_DIMENSIONS,
  getHallLayout,
} from "@/data/hall";

const PRESET_KEYS: CameraPresetKey[] = ["overview", "stage", "top", "balcony"];

export default function TheatreControls() {
  const { camera } = useThree();

  const preset = useBookingStore((s) => s.preset);
  const seatView = useBookingStore((s) => s.seatView);
  const focusCat = useBookingStore((s) => s.focusCat);
  const camTick = useBookingStore((s) => s.camTick);
  const tour = useBookingStore((s) => s.tour);
  const setTour = useBookingStore((s) => s.setTour);

  const targetCamPos = useRef(new THREE.Vector3(...CAMERA_PRESETS.overview.shot.slice(0, 3)));
  const targetLookAt = useRef(new THREE.Vector3(...CAMERA_PRESETS.overview.shot.slice(3, 6)));
  const currentLookAt = useRef(new THREE.Vector3(...CAMERA_PRESETS.overview.shot.slice(3, 6)));

  const isUserInteracting = useRef(false);
  const pointerDown = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const spherical = useRef(new THREE.Spherical());

  // Handle Preset, SeatView, or Category Row navigation changes
  useEffect(() => {
    if (seatView !== null) {
      const { seats } = getHallLayout();
      const seat = seats[seatView];
      if (seat) {
        // Seat POV eye height + slight forward offset
        targetCamPos.current.set(seat.x, seat.y + 1.12, seat.z + 0.1);
        targetLookAt.current.set(0, SCREEN_DIMENSIONS.y - 0.2, SCREEN_DIMENSIONS.z);
      }
    } else if (focusCat && focusCat in CATEGORY_CAMERA_VIEWS) {
      // Smoothly navigate camera to frame the selected seat class rows
      const catShot = CATEGORY_CAMERA_VIEWS[focusCat as CategoryKey].shot;
      targetCamPos.current.set(catShot[0], catShot[1], catShot[2]);
      targetLookAt.current.set(catShot[3], catShot[4], catShot[5]);
    } else {
      const shot = CAMERA_PRESETS[preset]?.shot || CAMERA_PRESETS.overview.shot;
      targetCamPos.current.set(shot[0], shot[1], shot[2]);
      targetLookAt.current.set(shot[3], shot[4], shot[5]);
    }
  }, [preset, seatView, focusCat, camTick]);

  // Handle Tour auto-advancing
  useEffect(() => {
    if (!tour) return;
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % PRESET_KEYS.length;
      const key = PRESET_KEYS[step];
      const shot = CAMERA_PRESETS[key].shot;
      targetCamPos.current.set(shot[0], shot[1], shot[2]);
      targetLookAt.current.set(shot[3], shot[4], shot[5]);
    }, 3800);

    return () => clearInterval(interval);
  }, [tour]);

  // Pointer drag controls (orbit around lookAt target)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName !== "CANVAS") return;
      pointerDown.current = true;
      pointerStart.current = { x: e.clientX, y: e.clientY };
      setTour(false);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!pointerDown.current) return;
      const dx = (e.clientX - pointerStart.current.x) * 0.005;
      const dy = (e.clientY - pointerStart.current.y) * 0.005;
      pointerStart.current = { x: e.clientX, y: e.clientY };

      // Orbit camera around currentLookAt
      const offset = camera.position.clone().sub(currentLookAt.current);
      spherical.current.setFromVector3(offset);
      spherical.current.theta -= dx;
      spherical.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.current.phi + dy));

      offset.setFromSpherical(spherical.current);
      targetCamPos.current.copy(currentLookAt.current).add(offset);
    };

    const handlePointerUp = () => {
      pointerDown.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).tagName !== "CANVAS") return;
      e.preventDefault();
      const offset = camera.position.clone().sub(currentLookAt.current);
      const dist = offset.length();
      const nextDist = Math.max(3, Math.min(32, dist + e.deltaY * 0.015));
      offset.setLength(nextDist);
      targetCamPos.current.copy(currentLookAt.current).add(offset);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [camera, setTour]);

  // Smooth lerp frame loop & boundary collision clamp
  useFrame(() => {
    // Wall and ceiling clamp
    const hw = HALL_DIMENSIONS.halfWidth - 1.2;
    const ceil = HALL_DIMENSIONS.ceiling - 1.0;
    targetCamPos.current.x = THREE.MathUtils.clamp(targetCamPos.current.x, -hw, hw);
    targetCamPos.current.y = THREE.MathUtils.clamp(targetCamPos.current.y, 1.2, ceil);
    targetCamPos.current.z = THREE.MathUtils.clamp(targetCamPos.current.z, 2.0, HALL_DIMENSIONS.backZ - 0.5);

    // Collision avoidance for balcony overhang slab (z: 20.6 to 30.0, y: 7.8 to 9.3)
    // When transitioning into under-balcony space (e.g. Royal Recliners), descend in open hall before moving back
    if (targetCamPos.current.y < 7.6 && targetCamPos.current.z > 20.5) {
      if (camera.position.y > 7.6) {
        camera.position.z = Math.min(camera.position.z, 20.2);
      }
    }
    // When transitioning out from under-balcony space to an upper preset, stay below until clear of the overhang
    if (targetCamPos.current.y > 8.5 && camera.position.y < 8.0) {
      if (camera.position.z > 20.5) {
        camera.position.y = Math.min(camera.position.y, 7.2);
      }
    }

    // Lerp camera position
    camera.position.lerp(targetCamPos.current, 0.08);

    // Lerp lookAt target
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

