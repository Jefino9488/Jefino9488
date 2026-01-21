"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const Background: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        const connectionDistance = 150
        const mouseDistance = 200

        // Set canvas size
        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        // Mouse position
        const mouse = {
            x: -1000, // Start off-screen
            y: -1000,
        }

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX
            mouse.y = event.clientY
        }

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number
            color: string

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.vx = (Math.random() - 0.5) * 1 // Increased speed
                this.vy = (Math.random() - 0.5) * 1
                this.size = Math.random() * 2.5 + 1.5 // Bigger particles
                // Brighter particles
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                // Bounce off edges
                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1

                // Mouse interaction
                const dx = mouse.x - this.x
                const dy = mouse.y - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance
                    const forceDirectionY = dy / distance
                    const force = (mouseDistance - distance) / mouseDistance
                    const directionX = forceDirectionX * force * 0.6
                    const directionY = forceDirectionY * force * 0.6

                    this.vx -= directionX * 0.05
                    this.vy -= directionY * 0.05
                }
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.fill()
            }
        }

        const initParticles = () => {
            particles = []
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000) // More particles
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle())
            }
        }

        const animate = () => {
            if (!ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw Deep Dark Background
            // We can do this in CSS, but doing it here ensures the clearing matches
            // ctx.fillStyle = "#05050A" // Very dark blue/black
            // ctx.fillRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle) => {
                particle.update()
                particle.draw()
            })

            // Draw connections
            particles.forEach((a, index) => {
                // Optimized: only check particles after current index to avoid double checking pairs
                for (let i = index + 1; i < particles.length; i++) {
                    const b = particles[i]
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})` // More visible lines
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)

        // Initial setup
        handleResize()
        animate()

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] w-full h-full pointer-events-none"
            style={{
                background: "radial-gradient(circle at 50% 50%, #0a0a15 0%, #000000 100%)", // Deep Nebula Gradient
            }}
        />
    )
}

export default Background
