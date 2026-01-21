"use client"

import type React from "react"
import { useState, useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as random from "maath/random/dist/maath-random.esm"
import * as THREE from "three"

// -----------------------------------------------------------------------------
// Component: StarField
// -----------------------------------------------------------------------------
const StarField = (props: any) => {
    const ref = useRef<THREE.Points>(null!)

    // Generate positions and colors once
    const [sphere] = useState(() => random.inSphere(new Float32Array(6000), { radius: 1.5 }))

    // Natural star colors (slight blue/yellow tints + white)
    const colors = useMemo(() => {
        const data = new Float32Array(6000 * 3) // 6000 stars * 3 components (r,g,b)
        for (let i = 0; i < 6000 * 3; i += 3) {
            const colorType = Math.random()
            let r = 1, g = 1, b = 1

            if (colorType > 0.9) { // Blue giants (Cool Blue)
                r = 0.5; g = 0.7; b = 1
            } else if (colorType > 0.75) { // Yellow/Orange dwarfs (Warm Yellow)
                r = 1; g = 0.9; b = 0.4
            } else if (colorType > 0.6) { // Tinted (Cyan/Aquamarine)
                r = 0.6; g = 1; b = 0.9
            } else if (colorType > 0.5) { // Tinted (Rose/Purple)
                r = 1; g = 0.6; b = 0.8
            }

            data[i] = r
            data[i + 1] = g
            data[i + 2] = b
        }
        return data
    }, [])

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

    useFrame((state, delta) => {
        const scrollY = window.scrollY
        // Smoothly interpolate scroll influence
        // Mapping: 0px -> Z=1, 5000px -> Z=0 or deeper
        // We act like we are traveling 'into' the screen
        const targetZ = 1 - (scrollY * 0.0005)

        // Use Frame-independent damping
        // step = 1 - exp(-lambda * dt)
        const damp = 1 - Math.exp(-5 * delta)

        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, damp)

        // Subtle mouse parallax (Exploring feel)
        const mouseX = (state.pointer.x * 0.1)
        const mouseY = (state.pointer.y * 0.1)
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX, damp)
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY, damp)

        // setLastScrollY(scrollY) - Removed unread state update
    })

    return null
}

// -----------------------------------------------------------------------------
// Component: Shooting Star (Visual Trail)
// -----------------------------------------------------------------------------
const ShootingStar = () => {
    const ref = useRef<THREE.Group>(null!)
    const [active, setActive] = useState(false)

    // Reusing geometry/material is better done at parent, but React handles automatic instancing for primitives often enough.
    // For a single trail, we can use a simple Mesh with a gradient texture or just scaling.

    useFrame((_state, delta) => {
        if (!active) {
            if (Math.random() < 0.003) {
                setActive(true)
                ref.current.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    -1 + Math.random() * 2
                )
                // Randomize trajectory
                ref.current.rotation.z = Math.random() * Math.PI
            }
        } else {
            // Move fast along local X
            ref.current.translateX(delta * 4)

            // Kill if too far
            if (Math.abs(ref.current.position.x) > 3 || Math.abs(ref.current.position.y) > 3) {
                setActive(false)
            }
        }
    })

    return (
        <group ref={ref} visible={active}>
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
    return (
        <div className="fixed inset-0 z-[-1] bg-[#000000]">
            <Canvas
                camera={{ position: [0, 0, 1], fov: 45 }}
                dpr={[1, 2]} // Optimization: Limit pixel ratio
                gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }} // Optimization flags
            >
                <StarField />
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
