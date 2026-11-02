"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { HALL_DIMENSIONS } from "@/data/hall";

export default function TheatreRoom() {
  const { halfWidth, backZ, ceiling } = HALL_DIMENSIONS;

  // Wavy red velvet drapery for front screen sides
  const velvetGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.5, 12, 32, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, 0.12 * Math.sin(7.5 * x) + 0.05 * Math.sin(2.3 * x));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* Stage Floor */}
      <mesh position={[0, -0.05, backZ / 2 - 1]} receiveShadow>
        <boxGeometry args={[halfWidth * 2, 0.1, backZ + 4]} />
        <meshStandardMaterial color="#111116" roughness={0.9} />
      </mesh>

      {/* Main Ceiling */}
      <mesh position={[0, ceiling, backZ / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[halfWidth * 2, backZ + 4]} />
        <meshStandardMaterial color="#07070a" roughness={1.0} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, ceiling / 2, backZ + 0.5]}>
        <planeGeometry args={[halfWidth * 2, ceiling]} />
        <meshStandardMaterial color="#121218" roughness={0.95} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-halfWidth, ceiling / 2, backZ / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[backZ + 4, ceiling]} />
        <meshStandardMaterial color="#151216" roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[halfWidth, ceiling / 2, backZ / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[backZ + 4, ceiling]} />
        <meshStandardMaterial color="#151216" roughness={0.8} />
      </mesh>

      {/* Left Screen Velvet Curtain */}
      <mesh
        geometry={velvetGeometry}
        position={[-halfWidth + 2.5, 6.2, 0.4]}
        rotation={[0, 0.2, 0]}
      >
        <meshStandardMaterial
          color="#8a0f1c"
          roughness={0.9}
        />
      </mesh>

      {/* Right Screen Velvet Curtain */}
      <mesh
        geometry={velvetGeometry}
        position={[halfWidth - 2.5, 6.2, 0.4]}
        rotation={[0, -0.2, 0]}
      >
        <meshStandardMaterial
          color="#8a0f1c"
          roughness={0.9}
        />
      </mesh>

      {/* Balcony Overhang Slab */}
      <mesh position={[0, 8.8, 25.5]}>
        <boxGeometry args={[halfWidth * 2 - 0.2, 0.8, 9]} />
        <meshStandardMaterial color="#181822" roughness={0.7} />
      </mesh>

      {/* Glowing Exit Signs */}
      <group position={[-halfWidth + 0.1, 2.8, 2.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.0, 0.38, 0.08]} />
          <meshBasicMaterial color={new THREE.Color(0.2, 2.2, 0.6)} toneMapped={false} />
        </mesh>
      </group>

      <group position={[halfWidth - 0.1, 2.8, 2.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.0, 0.38, 0.08]} />
          <meshBasicMaterial color={new THREE.Color(0.2, 2.2, 0.6)} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

