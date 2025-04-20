import { useState, useEffect } from 'react';

export function useScreenSize() {
    const [isXlScreen, setIsXlScreen] = useState(false);

    useEffect(() => {
        // Tailwind's xl breakpoint is 1280px by default
        const mediaQuery = window.matchMedia('(min-width: 1280px)');

        // Set initial state
        setIsXlScreen(mediaQuery.matches);

        // Add event listener for changes
        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsXlScreen(e.matches);
        };

        mediaQuery.addEventListener('change', handleMediaChange);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    return { isXlScreen };
}