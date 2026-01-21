import { useState, useEffect } from 'react';

export function useScreenSize() {
    const [isXlScreen, setIsXlScreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Tailwind's xl breakpoint is 1280px by default
        const xlMediaQuery = window.matchMedia('(min-width: 1280px)');

        // Mobile breakpoint (typically md is 768px, so < 768px is mobile)
        const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

        // Set initial state
        setIsXlScreen(xlMediaQuery.matches);
        setIsMobile(mobileMediaQuery.matches);

        // Add event listener for changes
        const handleXlChange = (e: MediaQueryListEvent) => {
            setIsXlScreen(e.matches);
        };

        const handleMobileChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        xlMediaQuery.addEventListener('change', handleXlChange);
        mobileMediaQuery.addEventListener('change', handleMobileChange);

        // Cleanup
        return () => {
            xlMediaQuery.removeEventListener('change', handleXlChange);
            mobileMediaQuery.removeEventListener('change', handleMobileChange);
        };
    }, []);

    return { isXlScreen, isMobile };
}