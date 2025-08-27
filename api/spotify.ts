import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            return res.status(500).json({ error: "Missing Spotify environment variables" });
        }

        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

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

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error("Spotify token error:", errorText);
            return res.status(tokenResponse.status).json({ error: "Failed to fetch access token", details: errorText });
        }

        const tokenData = await tokenResponse.json();
        const { access_token } = tokenData;

        if (!access_token) {
            return res.status(500).json({ error: "No access token received" });
        }

        const profileResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!profileResponse.ok) {
            const errorText = await profileResponse.text();
            console.error("Spotify profile error:", errorText);
            return res.status(profileResponse.status).json({ error: "Failed to fetch profile", details: errorText });
        }

        const profileData = await profileResponse.json();
        return res.status(200).json(profileData);

    } catch (error: any) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ error: "Unexpected error", details: error.message });
    }
}
