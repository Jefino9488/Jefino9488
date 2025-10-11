import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  ripple?: boolean;
  hapticFeedback?: boolean;
  onTap?: () => void;
  onLongPress?: () => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right', distance: number) => void;
  tapDelay?: number;
  longPressDelay?: number;
  swipeThreshold?: number;
}

export default function TouchFeedback({
  children,
  className = '',
  disabled = false,
  ripple = true,
  hapticFeedback = true,
  onTap,
  onLongPress,
  onSwipe,
  tapDelay = 0,
  longPressDelay = 500,
  swipeThreshold = 50,
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const generateRipple = (x: number, y: number) => {
    if (!ripple || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;

    const newRipple = {
      id: Date.now().toString(),
      x: relativeX,
      y: relativeY,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const triggerHapticFeedback = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;

    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });

    setIsPressed(true);
    triggerHapticFeedback();

    // Set up long press timer
    longPressTimer.current = setTimeout(() => {
      if (onLongPress) {
        triggerHapticFeedback();
        onLongPress();
      }
    }, longPressDelay);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !touchStart) return;

    // Clear long press timer if user moves too much
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled) return;

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - touchStart.time;

    setIsPressed(false);
    setTouchStart(null);

    // Determine if it's a swipe
    if (distance > swipeThreshold && duration < 300) {
      let direction: 'up' | 'down' | 'left' | 'right';
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (onSwipe) {
        triggerHapticFeedback();
        onSwipe(direction, distance);
      }
    } else if (duration < 300 && distance < 50) {
      // It's a tap
      if (onTap) {
        generateRipple(touch.clientX, touch.clientY);
        setTimeout(() => {
          onTap();
        }, tapDelay);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    
    setIsPressed(true);
    generateRipple(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    
    setIsPressed(false);
    if (onTap) {
      setTimeout(() => {
        onTap();
      }, tapDelay);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
      
      {/* Press feedback */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-white/10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
