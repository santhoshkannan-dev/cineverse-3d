"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { getHallLayout, HALL_DIMENSIONS } from "@/data/hall";

export default function AisleStepLights() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const lightsPositions = useMemo(() => {
    const { rows, seats } = getHallLayout();
    const positions: { pos: THREE.Vector3; rotY: number }[] = [];

    for (const row of rows) {
      const rowSeats = row.seats;
      for (let i = 1; i < rowSeats.length; i++) {
        const s1 = seats[rowSeats[i - 1]];
        const s2 = seats[rowSeats[i]];
        if (s1.block !== s2.block) {
          const r = row.radius - 0.55 * row.depth;
          const a1 = Math.atan2(s1.x, s1.z - HALL_DIMENSIONS.centerOfCurvatureZ);
          const a2 = Math.atan2(s2.x, s2.z - HALL_DIMENSIONS.centerOfCurvatureZ);
          const midAngle = (a1 + a2) / 2;

          positions.push({
            pos: new THREE.Vector3(
              Math.sin(midAngle) * (r + 0.02),
              row.y - 0.08,
              HALL_DIMENSIONS.centerOfCurvatureZ + Math.cos(midAngle) * (r + 0.02)
            ),
            rotY: midAngle,
          });
        }
      }
    }
    return positions;
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    lightsPositions.forEach((item, idx) => {
      dummy.position.copy(item.pos);
      dummy.rotation.set(0, item.rotY, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [lightsPositions]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, lightsPositions.length]}
    >
      <boxGeometry args={[0.5, 0.05, 0.02]} />
      <meshBasicMaterial color={new THREE.Color(4, 2.4, 0.9)} toneMapped={false} />
    </instancedMesh>
  );
}

