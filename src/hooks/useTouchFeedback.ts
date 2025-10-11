import { useState, useRef, useCallback } from 'react';

interface TouchFeedbackOptions {
  onTouchStart?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  hapticFeedback?: boolean;
  preventDefault?: boolean;
}

export function useTouchFeedback(options: TouchFeedbackOptions = {}) {
  const [isTouching, setIsTouching] = useState(false);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef<number>(0);
  const touchStartPosition = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (options.preventDefault) {
      event.preventDefault();
    }

    setIsTouching(true);
    touchStartTime.current = Date.now();
    
    const touch = event.touches[0];
    const position = { x: touch.clientX, y: touch.clientY };
    setTouchPosition(position);
    touchStartPosition.current = position;

    // Haptic feedback for supported devices
    if (options.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }

    options.onTouchStart?.(event);
  }, [options]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (options.preventDefault) {
      event.preventDefault();
    }

    const touch = event.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });

    options.onTouchMove?.(event);
  }, [options]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (options.preventDefault) {
      event.preventDefault();
    }

    setIsTouching(false);
    setTouchPosition(null);
    
    const touchDuration = Date.now() - touchStartTime.current;
    const startPos = touchStartPosition.current;
    const endPos = touchPosition;
    
    // Calculate swipe distance and direction
    let swipeDirection: string | null = null;
    let swipeDistance = 0;
    
    if (startPos && endPos) {
      const deltaX = endPos.x - startPos.x;
      const deltaY = endPos.y - startPos.y;
      swipeDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (swipeDistance > 50) { // Minimum swipe distance
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          swipeDirection = deltaX > 0 ? 'right' : 'left';
        } else {
          swipeDirection = deltaY > 0 ? 'down' : 'up';
        }
      }
    }

    options.onTouchEnd?.(event);

    // Return touch analysis
    return {
      duration: touchDuration,
      swipeDirection,
      swipeDistance,
      isLongPress: touchDuration > 500,
      isSwipe: swipeDistance > 50,
    };
  }, [options, touchPosition]);

  return {
    isTouching,
    touchPosition,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
