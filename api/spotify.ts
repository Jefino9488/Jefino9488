import type { NextApiRequest, NextApiResponse } from "next";

// Cache token in memory (works for serverless functions)
let accessToken: string | null = null;
let expiry = 0;

export interface SpotifyTrack {
    isPlaying: boolean;
    name: string;
    artist: string;
    albumArt: string;
    url: string;
    timestamp?: number; // Add timestamp for caching
}

async function getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (accessToken && Date.now() < expiry - 60000) { // 1 minute buffer
        return accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Missing Spotify environment variables");
    }

    console.log("Refreshing Spotify token...");

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Token refresh failed:", response.status, errorData);
            throw new Error(`Token refresh failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error("No access token in response");
        }

        accessToken = data.access_token;
        expiry = Date.now() + (data.expires_in * 1000);

        console.log("Token refreshed successfully");
        return accessToken;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

async function getCurrentTrack(token: string): Promise<SpotifyTrack | null> {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            if (data?.item) {
                return {
                    isPlaying: data.is_playing || false,
                    name: data.item.name,
                    artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
                    albumArt: data.item.album.images[0]?.url || "",
                    url: data.item.external_urls?.spotify || "",
                    timestamp: Date.now()
                };
            }
        } else if (response.status === 204) {
            // No content - nothing is currently playing
            return null;
        } else {
            console.log(`Currently playing API returned: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching current track:", error);
    }

    return null;
}

async function getRecentTrack(token: string): Promise<SpotifyTrack | null> {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();
            const track = data.items?.[0]?.track;

            if (track) {
                return {
                    isPlaying: false,
                    name: track.name,
                    artist: track.artists.map((a: { name: string }) => a.name).join(", "),
                    albumArt: track.album.images[0]?.url || "",
                    url: track.external_urls?.spotify || "",
                    timestamp: Date.now()
                };
            }
        }
    } catch (error) {
        console.error("Error fetching recent track:", error);
    }

    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = await getAccessToken();

        // Try to get currently playing track
        let track = await getCurrentTrack(token);

        // If nothing is currently playing, get the most recent track
        if (!track) {
            track = await getRecentTrack(token);
        }

        if (track) {
            return res.status(200).json(track);
        } else {
            // Return a default response if no track data is available
            return res.status(200).json({
                isPlaying: false,
                name: "No track available",
                artist: "Unknown",
                albumArt: "",
                url: "",
                timestamp: Date.now()
            });
        }

    } catch (error: unknown) {
        let message = "Failed to fetch Spotify data";
        if (error instanceof Error) {
            message = error.message;
        }

        console.error("Spotify API error:", error);

        return res.status(200).json({
            isPlaying: false,
            name: "Failed to load track",
            artist: "Error occurred",
            albumArt: "",
            url: "",
            error: message,
            timestamp: Date.now()
        });
    }
}