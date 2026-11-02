"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, Html } from "@react-three/drei";
import {
  getHallLayout,
  useBookingStore,
  CATEGORIES_MAP,
  Seat,
} from "@/data/hall";

const MODEL_PATH = "/models/seat.glb";
const SOLD_COLOR = new THREE.Color("#383d50");

// Reusable Three.js math scratch objects to prevent GC thrashing
const _matrix = new THREE.Matrix4();
const _position = new THREE.Vector3();
const _rotation = new THREE.Euler();
const _scale = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
const _color = new THREE.Color();
const _white = new THREE.Color("#ffffff");

function computeSeatMatrix(seat: Seat, scaleMultiplier = 1): THREE.Matrix4 {
  _position.set(seat.x, seat.y, seat.z);
  _rotation.set(0, seat.rotY + Math.PI, 0);

  if (seat.wide) {
    _scale.set(1.5 * 0.6, 0.63, 0.78);
  } else {
    _scale.setScalar(0.6);
  }
  _scale.multiplyScalar(scaleMultiplier);

  _quaternion.setFromEuler(_rotation);
  _matrix.compose(_position, _quaternion, _scale);
  return _matrix;
}

export default function CinemaSeats() {
  const gltf = useGLTF(MODEL_PATH);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const { seats } = useMemo(() => getHallLayout(), []);

  const sold = useBookingStore((s) => s.sold);
  const selected = useBookingStore((s) => s.selected);
  const hover = useBookingStore((s) => s.hover);
  const focusCat = useBookingStore((s) => s.focusCat);
  const setHover = useBookingStore((s) => s.setHover);
  const toggle = useBookingStore((s) => s.toggle);
  const viewSeat = useBookingStore((s) => s.viewSeat);

  // Extract base geometry and material from GLB
  const { geometry, material, glowMaterial } = useMemo(() => {
    let mesh: THREE.Mesh | null = null;
    gltf.scene.traverse((child) => {
      if (!mesh && (child as THREE.Mesh).isMesh) {
        mesh = child as THREE.Mesh;
      }
    });

    if (!mesh) {
      // Fallback simple chair geometry if mesh missing
      const fallbackGeo = new THREE.BoxGeometry(0.6, 0.75, 0.6);
      fallbackGeo.translate(0, 0.375, 0);
      const fallbackMat = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.5,
      });
      const fallbackGlow = new THREE.MeshStandardMaterial({
        color: "#0b3d32",
        emissive: new THREE.Color("#2cf5b9"),
        emissiveIntensity: 1.5,
        roughness: 0.3,
      });
      return { geometry: fallbackGeo, material: fallbackMat, glowMaterial: fallbackGlow };
    }

    const geo = (mesh as THREE.Mesh).geometry.clone();
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    geo.translate(
      -(box.min.x + box.max.x) / 2,
      -box.min.y,
      -(box.min.z + box.max.z) / 2
    );
    const scale = 1 / (box.max.x - box.min.x);
    geo.scale(scale, scale, scale);
    geo.computeVertexNormals();

    const origMat = (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;

    // Use pure white base so instance colors (Gold, Violet, Mint, Sky Blue) render vibrant and authentic
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ffffff"),
      roughness: 0.38,
      metalness: 0.12,
      normalMap: origMat?.normalMap || null,
      normalScale: new THREE.Vector2(0.85, 0.85),
    });

    const glow = new THREE.MeshStandardMaterial({
      color: "#052e25",
      emissive: new THREE.Color("#2cf5b9"),
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });

    return { geometry: geo, material: mat, glowMaterial: glow };
  }, [gltf]);

  // Set instance matrices once
  useEffect(() => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    seats.forEach((seat, idx) => {
      mesh.setMatrixAt(idx, computeSeatMatrix(seat));
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [seats]);

  // Update instance colors whenever selection, sold, hover, or focusCat changes
  useEffect(() => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    const selectedSet = new Set(selected);

    seats.forEach((seat, idx) => {
      const isSold = sold.has(idx);
      const isSelected = selectedSet.has(idx);
      const isHovered = idx === hover;

      if (isSold) {
        _color.copy(SOLD_COLOR);
      } else {
        const catColor = CATEGORIES_MAP[seat.cat]?.color || "#ffffff";
        _color.set(catColor);

        // Dim if focused on a different category
        if (focusCat && seat.cat !== focusCat) {
          _color.multiplyScalar(0.28);
        }

        // Highlight hover
        if (isHovered && !isSold) {
          _color.lerp(_white, 0.65);
        }

        // Selected seats are rendered separately with glow
        if (isSelected) {
          _color.setScalar(0.08);
        }
      }

      mesh.setColorAt(idx, _color);
    });

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [seats, sold, selected, hover, focusCat]);

  const hoveredSeat = hover !== null ? seats[hover] : null;

  return (
    <group>
      {/* Main Instanced Mesh for all standard/sold/unselected seats */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[geometry, material, seats.length]}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined && e.instanceId !== hover) {
            setHover(e.instanceId);
            document.body.style.cursor = sold.has(e.instanceId)
              ? "not-allowed"
              : "pointer";
          }
        }}
        onPointerOut={() => {
          setHover(null);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 6 || e.instanceId === undefined) return;
          const res = toggle(e.instanceId);
          if (!res.ok && res.reason) {
            window.dispatchEvent(
              new CustomEvent("cv-toast", { detail: res.reason })
            );
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) {
            viewSeat(e.instanceId);
          }
        }}
      />

      {/* Selected Seats rendered with glowing green material & floating badge */}
      {selected.map((seatIdx) => {
        const seat = seats[seatIdx];
        if (!seat) return null;
        const mat = computeSeatMatrix(seat, 1.03).clone();

        return (
          <group key={seatIdx}>
            <mesh
              geometry={geometry}
              material={glowMaterial}
              matrix={mat}
              matrixAutoUpdate={false}
            />

            {/* Floating Seat ID Tag above headrest */}
            <group
              position={[seat.x, seat.y, seat.z]}
              rotation={[0, seat.rotY, 0]}
            >
              <mesh position={[0, 1.32, 0.42]}>
                <planeGeometry args={[0.5, 0.26]} />
                <meshBasicMaterial color="#04140f" transparent opacity={0.85} />
              </mesh>
              <Html
                position={[0, 1.32, 0.43]}
                center
                distanceFactor={7}
                className="pointer-events-none select-none text-[12px] font-bold text-mint tracking-wider"
              >
                {seat.id}
              </Html>
            </group>
          </group>
        );
      })}

      {/* Hover Tooltip rendered in 3D */}
      {hoveredSeat && (
        <Html
          position={[hoveredSeat.x, hoveredSeat.y + 1.6, hoveredSeat.z]}
          center
          distanceFactor={9}
          className="pointer-events-none select-none z-30"
        >
          <div className="whitespace-nowrap rounded-xl border border-white/20 bg-ink-2/95 px-3 py-2 text-white shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: sold.has(hoveredSeat.idx)
                    ? "#555"
                    : CATEGORIES_MAP[hoveredSeat.cat]?.color,
                }}
              />
              <span>
                Row {hoveredSeat.row} · Seat {hoveredSeat.num}
              </span>
            </div>
            <div className="mt-0.5 text-[10px] text-white/60">
              {sold.has(hoveredSeat.idx)
                ? "Already booked"
                : `${CATEGORIES_MAP[hoveredSeat.cat]?.name} · ₹${CATEGORIES_MAP[hoveredSeat.cat]?.price}`}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

