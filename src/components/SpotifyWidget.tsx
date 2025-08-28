import { useState, useEffect, useCallback, useRef } from 'react';
import { Music2, ExternalLink, Headphones, Play, Pause, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Advanced useSpotify Hook ---

export interface SpotifyTrack {
    isPlaying: boolean;
    name: string;
    artist: string;
    albumArt: string;
    url: string;
    timestamp?: number;
    error?: string;
}

interface UseSpotifyOptions {
    updateInterval?: number;
    maxRetries?: number;
    retryDelay?: number;
}

/**
 * A robust custom hook to fetch Spotify track data with retries,
 * visibility handling, and online/offline detection.
 * @param {UseSpotifyOptions | number} options - Configuration for the hook.
 * @returns {object} The current state and control functions.
 */
export function useSpotify(options: UseSpotifyOptions | number = {}) {
    // Handle backward compatibility with number parameter
    const config: UseSpotifyOptions = typeof options === 'number'
        ? { updateInterval: options }
        : options;

    const {
        updateInterval = 30000,
        maxRetries = 3,
        retryDelay = 5000
    } = config;

    const [track, setTrack] = useState<SpotifyTrack | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchSpotifyTrack = useCallback(async (isRetry = false) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            if (!isRetry) setError(null);

            const response = await fetch('/api/spotify', {
                signal: abortControllerRef.current.signal,
            });

            if (response.ok) {
                const trackData = await response.json();
                setTrack(trackData);
                setRetryCount(0);
            } else {
                const errorMessage = `API Error: ${response.status}`;
                if (response.status >= 500) throw new Error(errorMessage);

                setError(errorMessage);
                setTrack({
                    isPlaying: false,
                    name: "Failed to load track",
                    artist: "Service error",
                    albumArt: "",
                    url: "",
                });
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;

            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            if (retryCount < maxRetries) {
                setRetryCount(prev => prev + 1);
                retryTimeoutRef.current = setTimeout(() => fetchSpotifyTrack(true), retryDelay);
            } else {
                setError(errorMessage);
                setTrack({
                    isPlaying: false,
                    name: "Network error",
                    artist: "Check connection",
                    albumArt: "",
                    url: "",
                    error: errorMessage,
                });
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [retryCount, maxRetries, retryDelay]);

    const startPolling = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchSpotifyTrack, updateInterval);
    }, [fetchSpotifyTrack, updateInterval]);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();
    }, []);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setRetryCount(0);
        fetchSpotifyTrack();
    }, [fetchSpotifyTrack]);

    useEffect(() => {
        fetchSpotifyTrack();
        startPolling();
        return stopPolling;
    }, [fetchSpotifyTrack, startPolling, stopPolling]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                refresh();
                startPolling();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [refresh, startPolling, stopPolling]);

    return { track, isLoading, error, refresh };
}


// --- Spotify Widget Component ---

interface SpotifyWidgetProps {
    className?: string;
    showDetails?: boolean;
}

export default function SpotifyWidget({ className = '', showDetails = true }: SpotifyWidgetProps) {
    const { track, isLoading, error } = useSpotify({ updateInterval: 30000 });
    const [showTooltip, setShowTooltip] = useState(false);

    // Loading state
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`group relative bg-gradient-to-r from-[#313244] to-[#45475a] rounded-full shadow-md border border-[#45475a] transition-all ${className}`}
            >
                <div className="flex items-center gap-2 px-3 py-1.5">
                    <Music2 className="w-4 h-4 text-[#a6adc8]" />
                    <span className="text-[#a6adc8] text-xs font-medium">Loading...</span>
                </div>
            </motion.div>
        );
    }

    // Error or No Music state
    if (error || !track || track.error || track.name === "No track available" || track.name === "Failed to load track" || track.name === "Network error") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`group relative bg-gradient-to-r from-[#313244] to-[#45475a] rounded-full shadow-md border border-[#45475a] transition-all ${className}`}
            >
                <div className="flex items-center gap-2 px-3 py-1.5">
                    <Headphones className="w-4 h-4 text-[#a6adc8]" />
                    <span className="text-[#a6adc8] text-xs font-medium">
                        {error ? 'Connection Error' : 'Offline'}
                    </span>
                </div>
            </motion.div>
        );
    }

    const handleClick = () => {
        if (track.url) {
            window.open(track.url, '_blank', 'noopener,noreferrer');
        }
    };

    const isValidTrack = track.name !== "No track available" && track.name !== "Failed to load track";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative ${isValidTrack ? 'cursor-pointer' : 'cursor-default'} ${className}`}
            onClick={isValidTrack ? handleClick : undefined}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Main widget */}
            <div className="relative bg-gradient-to-r from-[#313244] to-[#45475a] rounded-full shadow-md border border-[#45475a] transition-all group-hover:border-[#a6adc8]/50">
                <div className="flex items-center gap-2 pl-2.5 pr-3 py-1.5">
                    <div className="relative">
                        {track.isPlaying ? (
                            <Play className="w-4 h-4 text-[#a6adc8] fill-[#a6adc8]" />
                        ) : (
                            <Pause className="w-4 h-4 text-[#a6adc8]" />
                        )}
                    </div>
                    <div className="text-[#a6adc8] text-xs font-medium max-w-[120px] truncate">
                        {track.name}
                    </div>
                    {isValidTrack && track.url && (
                        <ExternalLink className="w-3 h-3 text-[#a6adc8] opacity-70 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && showDetails && isValidTrack && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[#181818]/80 backdrop-blur-md rounded-lg shadow-2xl border border-[#313244] w-72 p-4 z-50"
                    >
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#313244]" />
                        <div className="flex items-start gap-4">
                            {track.albumArt && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative flex-shrink-0"
                                >
                                    <img
                                        src={track.albumArt}
                                        alt={`${track.name} album art`}
                                        className="w-16 h-16 rounded-md object-cover shadow-lg border border-[#45475a]"
                                        onError={(e) => {
                                            const target = e.target;
                                            if (target instanceof HTMLImageElement) {
                                                target.style.display = 'none';
                                            }
                                        }}
                                    />
                                </motion.div>
                            )}
                            <div className="flex-grow min-w-0">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 text-[#b4befe] text-xs font-medium mb-2"
                                >
                                    <Music className="w-3 h-3" />
                                    {track.isPlaying ? "Now Playing" : "Recently Played"}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-white text-sm font-semibold mb-1.5 line-clamp-2"
                                    title={track.name}
                                >
                                    {track.name}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-[#a6adc8] text-xs mb-3 line-clamp-1"
                                    title={track.artist}
                                >
                                    {track.artist}
                                </motion.div>
                                {track.url && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center gap-2 text-[#89b4fa] text-xs group/cta hover:text-[#b4befe] transition-colors cursor-pointer"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        <span className="font-medium">Open in Spotify</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
