"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { HALL_DIMENSIONS } from "@/data/hall";

export default function StarryCeiling() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const starCount = 420;

  const stars = useMemo(() => {
    // Deterministic random pseudo-generator
    let seed = 12345;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    return Array.from({ length: starCount }, () => {
      return {
        pos: new THREE.Vector3(
          (rng() - 0.5) * 28,
          HALL_DIMENSIONS.ceiling - 0.05,
          29 * rng()
        ),
        scale: 0.5 + 1.2 * rng(),
      };
    });
  }, [starCount]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    stars.forEach((star, idx) => {
      dummy.position.copy(star.pos);
      dummy.scale.setScalar(star.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [stars]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, starCount]}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshBasicMaterial color={new THREE.Color(2.6, 2.4, 2.1)} toneMapped={false} />
    </instancedMesh>
  );
}

