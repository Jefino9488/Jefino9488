import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
        const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        // 1. Refresh token → access token
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${authHeader}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        });

        const { access_token } = await tokenResponse.json();

        if (!access_token) {
            return res.status(500).json({ error: "No access token" });
        }

        // 2. Check currently playing
        const nowPlayingRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (nowPlayingRes.status === 204 || nowPlayingRes.status === 200 && !(await nowPlayingRes.clone().json()).item) {
            // Nothing is playing → fallback to recently played
            const recentRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            const recentData = await recentRes.json();
            const track = recentData.items?.[0]?.track;

            return res.status(200).json({
                isPlaying: false,
                name: track?.name ?? "No track available",
                artist: track?.artists?.map((a: any) => a.name).join(", "),
                albumArt: track?.album?.images?.[0]?.url,
                url: track?.external_urls?.spotify,
                timestamp: Date.now(),
            });
        }

        // 3. Return currently playing
        const nowPlayingData = await nowPlayingRes.json();
        const track = nowPlayingData.item;

        return res.status(200).json({
            isPlaying: nowPlayingData.is_playing,
            name: track?.name ?? "No track available",
            artist: track?.artists?.map((a: any) => a.name).join(", "),
            albumArt: track?.album?.images?.[0]?.url,
            url: track?.external_urls?.spotify,
            timestamp: nowPlayingData.timestamp,
        });

    } catch (error: any) {
        console.error("Spotify API error:", error);
        return res.status(500).json({ error: error.message });
    }
}
