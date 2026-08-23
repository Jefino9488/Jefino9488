/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return res.status(200).json({
        isPlaying: false,
        name: "Spotify not configured",
        artist: "Set Vercel Environment Variables",
      });
    }

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

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(200).json({
        isPlaying: false,
        name: "Spotify auth error",
        artist: "Check refresh token",
      });
    }

    // Cache on Vercel edge for 15s to respect Spotify rate limits
    res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=30");

    // 2. Check currently playing
    const nowPlayingRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    // If no content or not playing -> Fallback to recently played
    if (nowPlayingRes.status === 204 || nowPlayingRes.status > 400) {
      const recentRes = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (recentRes.ok) {
        const recentData = await recentRes.json();
        const track = recentData.items?.[0]?.track;
        return res.status(200).json({
          isPlaying: false,
          name: track?.name ?? "No recent track",
          artist: track?.artists?.map((a: any) => a.name).join(", "),
          albumArt: track?.album?.images?.[0]?.url,
          url: track?.external_urls?.spotify,
          timestamp: Date.now(),
        });
      }

      return res.status(200).json({
        isPlaying: false,
        name: "Offline",
        artist: "Spotify",
      });
    }

    const nowPlayingData = await nowPlayingRes.json();
    const track = nowPlayingData.item;

    if (!track) {
      return res.status(200).json({
        isPlaying: false,
        name: "No track available",
        artist: "Spotify",
      });
    }

    // Return active track
    return res.status(200).json({
      isPlaying: Boolean(nowPlayingData.is_playing),
      name: track.name,
      artist: track.artists?.map((a: any) => a.name).join(", "),
      albumArt: track.album?.images?.[0]?.url,
      url: track.external_urls?.spotify,
      timestamp: nowPlayingData.timestamp,
    });
  } catch (error: any) {
    console.error("Spotify API error:", error);
    return res.status(200).json({
      isPlaying: false,
      name: "Offline",
      artist: "Spotify",
      error: error.message,
    });
  }
}
