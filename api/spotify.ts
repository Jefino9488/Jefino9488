import type { NextApiRequest, NextApiResponse } from "next";

let accessToken: string | null = null;
let expiry = 0;

async function getAccessToken() {
    if (accessToken && Date.now() < expiry) {
        return accessToken;
    }

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization:
                "Basic " +
                Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
                ).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
        }),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(JSON.stringify(data));
    }

    accessToken = data.access_token;
    expiry = Date.now() + data.expires_in * 1000;
    return accessToken;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = await getAccessToken();

        // Try currently playing
        let r = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (r.status === 200) {
            const data = await r.json();
            if (data?.item) {
                type Artist = { name: string };
                return res.status(200).json({
                    isPlaying: data.is_playing,
                    name: data.item.name,
                    artist: data.item.artists.map((a: Artist) => a.name).join(", "),
                    albumArt: data.item.album.images[0].url,
                    url: data.item.external_urls.spotify,
                });
            }
        }

        // Fallback recently played
        r = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const recent = await r.json();
        const track = recent.items[0].track;
        type Artist = { name: string };
        return res.status(200).json({
            isPlaying: false,
            name: track.name,
            artist: track.artists.map((a: Artist) => a.name).join(", "),
            albumArt: track.album.images[0].url,
            url: track.external_urls.spotify,
        });
    } catch (err: unknown) {
        let message = "Unknown error";
        if (err instanceof Error) message = err.message;
        console.error("Spotify API error:", err);
        return res.status(500).json({ error: "Spotify fetch failed", details: message });
    }
}