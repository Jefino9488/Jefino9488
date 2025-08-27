import { useState, useEffect, useCallback, useRef } from 'react';

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
        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
            if (!isRetry) {
                setError(null);
            }

            const response = await fetch('/api/spotify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: abortControllerRef.current.signal,
            });

            if (response.ok) {
                const trackData = await response.json();
                setTrack(trackData);
                setRetryCount(0); // Reset retry count on success

                // Log for debugging in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('Spotify track fetched:', trackData);
                }
            } else {
                const errorText = await response.text();
                const errorMessage = `API returned ${response.status}: ${response.statusText}`;
                console.error('Failed to fetch Spotify track:', response.status, errorText);

                // Handle different error types
                if (response.status >= 500) {
                    // Server errors - retry
                    throw new Error(errorMessage);
                } else if (response.status === 401) {
                    // Auth errors - don't retry immediately
                    setError('Authentication error - please check configuration');
                    setTrack({
                        isPlaying: false,
                        name: "Authentication failed",
                        artist: "Check configuration",
                        albumArt: "",
                        url: "",
                    });
                    setRetryCount(maxRetries); // Prevent immediate retries
                } else {
                    // Client errors - don't retry
                    setError(errorMessage);
                    setTrack({
                        isPlaying: false,
                        name: "Failed to load track",
                        artist: "Service error",
                        albumArt: "",
                        url: "",
                    });
                }
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Request was cancelled, don't update state
                return;
            }

            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Error fetching Spotify track:', err);

            // Determine if we should retry
            const shouldRetry = retryCount < maxRetries && !isRetry;

            if (shouldRetry) {
                setRetryCount(prev => prev + 1);
                console.log(`Retrying Spotify fetch (${retryCount + 1}/${maxRetries}) in ${retryDelay}ms`);

                retryTimeoutRef.current = setTimeout(() => {
                    fetchSpotifyTrack(true);
                }, retryDelay);

                return;
            }

            // Max retries reached or not retrying
            setError(errorMessage);
            setTrack({
                isPlaying: false,
                name: "Network error",
                artist: "Check connection",
                albumArt: "",
                url: "",
                error: errorMessage,
            });
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [retryCount, maxRetries, retryDelay]);

    const startPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            fetchSpotifyTrack();
        }, updateInterval);
    }, [fetchSpotifyTrack, updateInterval]);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setRetryCount(0);
        fetchSpotifyTrack();
    }, [fetchSpotifyTrack]);

    useEffect(() => {
        // Initial fetch
        fetchSpotifyTrack();

        // Start polling
        startPolling();

        // Cleanup on unmount
        return () => {
            stopPolling();
        };
    }, [fetchSpotifyTrack, startPolling, stopPolling]);

    // Handle visibility change - pause polling when tab is not visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                // Reset retry count when tab becomes visible again
                setRetryCount(0);
                fetchSpotifyTrack();
                startPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchSpotifyTrack, startPolling, stopPolling]);

    // Handle online/offline status
    useEffect(() => {
        const handleOnline = () => {
            console.log('Network back online, refreshing Spotify data');
            refresh();
        };

        const handleOffline = () => {
            console.log('Network offline, stopping Spotify polling');
            stopPolling();
            setError('Network offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [refresh, stopPolling]);

    return {
        track,
        isLoading,
        error,
        refresh,
        retryCount,
        maxRetries,
    };
}