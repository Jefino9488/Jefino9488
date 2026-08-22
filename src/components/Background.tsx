"use client";

import type React from "react";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScreenSize } from "@/hooks/useScreenSize";

// -----------------------------------------------------------------------------
// Component: StarField (Subtle, fine particles)
// -----------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StarField = ({ count = 1200, ...props }: any) => {
  const ref = useRef<THREE.Points>(null!);

  const sphere = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.6 * Math.cbrt(Math.random());

      data[i] = r * Math.sin(phi) * Math.cos(theta);
      data[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      data[i + 2] = r * Math.cos(phi);
    }
    return data;
  }, [count]);

  const colors = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const shade = 0.6 + Math.random() * 0.4;
      // Green-tinted starlight matching the #0c1310 field
      data[i] = shade * 0.82;
      data[i + 1] = shade * 0.98;
      data[i + 2] = shade * 0.88;
    }
    return data;
  }, [count]);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 60;
      ref.current.rotation.y -= delta / 80;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere as Float32Array}
        colors={colors}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          vertexColors
          size={0.0014}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// -----------------------------------------------------------------------------
// Component: CameraRig
// -----------------------------------------------------------------------------
const CameraRig = () => {
  const { camera } = useThree();
  const scrollYRef = useRef(0);

  useEffect(() => {
    scrollYRef.current = typeof window !== "undefined" ? window.scrollY : 0;
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state, delta) => {
    const targetZ = 1 - scrollYRef.current * 0.0003;
    const damp = 1 - Math.exp(-4 * delta);

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, damp);

    const mouseX = state.pointer.x * 0.04;
    const mouseY = state.pointer.y * 0.04;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX, damp);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY, damp);
  });

  return null;
};

// -----------------------------------------------------------------------------
// Component: Background Main
// -----------------------------------------------------------------------------
const Background: React.FC = () => {
  const { isMobile } = useScreenSize();
  const starCount = isMobile ? 600 : 1400;

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0c1310] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dpr={(isMobile ? [1, 1.5] : [1, 2]) as any}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <StarField key={starCount} count={starCount} />
        <CameraRig />
      </Canvas>
      {/* Subtle vignette/depth overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0c1310]/50 to-[#0c1310] pointer-events-none opacity-80" />
    </div>
  );
};

export default Background;
