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

export function useSpotify(updateInterval: number = 30000) {
    const [track, setTrack] = useState<SpotifyTrack | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchSpotifyTrack = useCallback(async () => {
        try {
            setError(null);

            const response = await fetch('/api/spotify', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const trackData = await response.json();
                setTrack(trackData);

                // Log for debugging
                if (process.env.NODE_ENV === 'development') {
                    console.log('Spotify track fetched:', trackData);
                }
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch Spotify track:', response.status, errorText);
                setError(`Failed to fetch track: ${response.status}`);
                setTrack({
                    isPlaying: false,
                    name: "Failed to load track",
                    artist: "Error occurred",
                    albumArt: "",
                    url: "",
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Error fetching Spotify track:', err);
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
        }
    }, []);

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
    }, []);

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

    // Pause polling when tab is not visible to save resources
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                fetchSpotifyTrack();
                startPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchSpotifyTrack, startPolling, stopPolling]);

    return {
        track,
        isLoading,
        error,
        refresh: fetchSpotifyTrack,
    };
}