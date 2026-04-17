"use client"

import type React from "react"
import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as random from "maath/random/dist/maath-random.esm"
import * as THREE from "three"

import { useScreenSize } from "@/hooks/useScreenSize"

// -----------------------------------------------------------------------------
// Component: StarField
// -----------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StarField = ({ count = 6000, ...props }: any) => {
    const ref = useRef<THREE.Points>(null!)

    // Generate positions and colors based on count
    // using useMemo so it regenerates if count changes (e.g. resize across breakpoint)
    const sphere = useMemo(() => random.inSphere(new Float32Array(count), { radius: 1.5 }), [count])

    // Natural star colors (slight blue/yellow tints + white)
    const colors = useMemo(() => {
        const data = new Float32Array(count * 3) // count stars * 3 components (r,g,b)
        for (let i = 0; i < count * 3; i += 3) {
            const colorType = Math.random()
            let r = 1, g = 1, b = 1

            if (colorType > 0.9) { // Blue Violet
                r = 0.4; g = 0.43; b = 0.73
            } else if (colorType > 0.75) { // Half Baked
                r = 0.54; g = 0.72; b = 0.81
            } else if (colorType > 0.6) { // Pigeon Post
                r = 0.7; g = 0.73; b = 0.85
            } else if (colorType > 0.5) { // White-ish Blue
                r = 0.9; g = 0.9; b = 0.95
            }

            data[i] = r
            data[i + 1] = g
            data[i + 2] = b
        }
        return data
    }, [count])

    useFrame((_state, delta) => {
        // Very slow, natural rotation
        ref.current.rotation.x -= delta / 30
        ref.current.rotation.y -= delta / 40
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere as Float32Array} colors={colors} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    )
}

// -----------------------------------------------------------------------------
// Component: CameraRig
// -----------------------------------------------------------------------------
const CameraRig = () => {
    const { camera } = useThree()
    // Store scroll position in a ref — updated by a passive scroll listener
    // This avoids window.scrollY reads inside useFrame which force layout recalc
    const scrollYRef = useRef(0)

    useEffect(() => {
        scrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0
        const handleScroll = () => {
            scrollYRef.current = window.scrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useFrame((state, delta) => {
        const targetZ = 1 - (scrollYRef.current * 0.0005)
        const damp = 1 - Math.exp(-5 * delta)

        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, damp)

        const mouseX = (state.pointer.x * 0.1)
        const mouseY = (state.pointer.y * 0.1)
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX, damp)
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY, damp)
    })

    return null
}

// -----------------------------------------------------------------------------
// Component: Shooting Star (Visual Trail)
// -----------------------------------------------------------------------------
const ShootingStar = () => {
    const ref = useRef<THREE.Group>(null!)
    // Use a ref instead of useState to avoid React reconciler overhead inside rAF
    const activeRef = useRef(false)

    useFrame((_state, delta) => {
        if (!activeRef.current) {
            if (Math.random() < 0.003) {
                activeRef.current = true
                ref.current.visible = true
                ref.current.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    -1 + Math.random() * 2
                )
                ref.current.rotation.z = Math.random() * Math.PI
            }
        } else {
            ref.current.translateX(delta * 4)

            if (Math.abs(ref.current.position.x) > 3 || Math.abs(ref.current.position.y) > 3) {
                activeRef.current = false
                ref.current.visible = false
            }
        }
    })

    return (
        <group ref={ref} visible={false}>
            {/* The Head */}
            <mesh>
                <sphereGeometry args={[0.005, 8, 8]} />
                <meshBasicMaterial color="white" toneMapped={false} />
            </mesh>
            {/* The Tail (scaled sphere) */}
            <mesh position={[-0.2, 0, 0]} scale={[10, 0.8, 0.8]}>
                <sphereGeometry args={[0.005, 8, 8]} />
                <meshBasicMaterial color="white" transparent opacity={0.3} toneMapped={false} />
            </mesh>
        </group>
    )
}

// -----------------------------------------------------------------------------
// Component: Background Main
// -----------------------------------------------------------------------------
const Background: React.FC = () => {
    const { isMobile } = useScreenSize() // Use global screen size hook
    const starCount = isMobile ? 3000 : 6000 // Reduce stars by 50% on mobile
    const dpr = isMobile ? [1, 1.5] : [1, 2] // Cap DPR at 1.5 on mobile for performance

    return (
        <div className="fixed inset-0 z-[-1] bg-[#000000]">
            <Canvas
                camera={{ position: [0, 0, 1], fov: 45 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dpr={dpr as any} // Optimization: Limit pixel ratio
                gl={{ antialias: false, powerPreference: "high-performance" }} // Optimization flags
            >
                <StarField count={starCount} />
                <ShootingStar />
                <ShootingStar />
                <CameraRig />
            </Canvas>

            {/* Cinematic Overlay - adds depth without webgl cost */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none mix-blend-screen" />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" /> {/* Vignette feel via CSS if needed, or just darken */}
        </div>
    )
}

export default Background
