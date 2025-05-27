"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import "./scrollbar.css"

interface CustomScrollbarProps {
    children: React.ReactNode
    className?: string
}

export default function CustomScrollbar({ children, className = "" }: CustomScrollbarProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollTrackRef = useRef<HTMLDivElement>(null)
    const scrollThumbRef = useRef<HTMLDivElement>(null)
    const observer = useRef<ResizeObserver | null>(null)
    const thumbDragging = useRef(false)
    const initialScrollTop = useRef(0)
    const initialY = useRef(0)

    // Calculate thumb height and position
    const updateThumbPosition = () => {
        if (!scrollContainerRef.current || !scrollTrackRef.current || !scrollThumbRef.current) return

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
        const trackHeight = scrollTrackRef.current.clientHeight
        const thumbHeight = Math.max(
            (clientHeight / scrollHeight) * trackHeight,
            30, // Minimum thumb height
        )
        const thumbTop = (scrollTop / scrollHeight) * trackHeight
        const maxTop = trackHeight - thumbHeight

        scrollThumbRef.current.style.height = `${thumbHeight}px`
        scrollThumbRef.current.style.transform = `translateY(${Math.min(thumbTop, maxTop)}px)`
    }

    // Handle scroll event
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer) return

        const handleScroll = () => {
            updateThumbPosition()
        }

        scrollContainer.addEventListener("scroll", handleScroll)
        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // Handle resize
    useEffect(() => {
        if (!contentRef.current) return

        observer.current = new ResizeObserver(() => {
            updateThumbPosition()
        })

        observer.current.observe(contentRef.current)
        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [])

    // Handle thumb drag
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        const scrollThumb = scrollThumbRef.current
        if (!scrollContainer || !scrollThumb) return

        const handleThumbMousedown = (e: MouseEvent) => {
            e.preventDefault()
            thumbDragging.current = true
            initialY.current = e.clientY
            initialScrollTop.current = scrollContainer.scrollTop
            document.body.style.userSelect = "none"
        }

        const handleDocumentMousemove = (e: MouseEvent) => {
            if (!thumbDragging.current || !scrollContainer || !scrollTrackRef.current) return

            const deltaY = e.clientY - initialY.current
            const trackHeight = scrollTrackRef.current.clientHeight
            const scrollRatio = deltaY / trackHeight
            scrollContainer.scrollTop = initialScrollTop.current + scrollRatio * scrollContainer.scrollHeight
        }

        const handleDocumentMouseup = () => {
            thumbDragging.current = false
            document.body.style.userSelect = ""
        }

        scrollThumb.addEventListener("mousedown", handleThumbMousedown)
        document.addEventListener("mousemove", handleDocumentMousemove)
        document.addEventListener("mouseup", handleDocumentMouseup)

        return () => {
            scrollThumb.removeEventListener("mousedown", handleThumbMousedown)
            document.removeEventListener("mousemove", handleDocumentMousemove)
            document.removeEventListener("mouseup", handleDocumentMouseup)
        }
    }, [])

    return (
        <div className={`custom-scrollbar-container ${className}`}>
            <div ref={scrollContainerRef} className="custom-scrollbar-viewport">
                <div ref={contentRef} className="custom-scrollbar-content">
                    {children}
                </div>
            </div>
            <div ref={scrollTrackRef} className="custom-scrollbar-track">
                <div ref={scrollThumbRef} className="custom-scrollbar-thumb" />
            </div>
        </div>
    )
}
