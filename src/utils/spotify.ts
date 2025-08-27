export interface SpotifyTrack {
    isPlaying: boolean;
    name: string;
    artist: string;
    albumArt: string;
    url: string;
}

const SPOTIFY_TOKEN_KEY = "spotify_access_token";
const SPOTIFY_REFRESH_TOKEN_KEY = "spotify_refresh_token";
const SPOTIFY_EXPIRY_KEY = "spotify_expiry";
const SPOTIFY_CODE_VERIFIER = "spotify_code_verifier";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://localhost:5173";
const SCOPES = "user-read-currently-playing user-read-recently-played";

// ----------------------
// PKCE helpers
// ----------------------
function generateRandomString(length: number) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible.charAt(x % possible.length))
        .join("");
}

async function sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

// ----------------------
// Auth Flow
// ----------------------
export async function initiateSpotifyLogin() {
    const verifier = generateRandomString(128);
    localStorage.setItem(SPOTIFY_CODE_VERIFIER, verifier);
    const challenge = await sha256(verifier);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", CLIENT_ID);
    authUrl.searchParams.set("scope", SCOPES);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("code_challenge_method", "S256");
    authUrl.searchParams.set("code_challenge", challenge);

    window.location.href = authUrl.toString();
}

export async function handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return false;

    const verifier = localStorage.getItem(SPOTIFY_CODE_VERIFIER)!;

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: verifier,
        }),
    });

    const data = await res.json();
    if (data.access_token) {
        localStorage.setItem(SPOTIFY_TOKEN_KEY, data.access_token);
        localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, data.refresh_token);
        localStorage.setItem(SPOTIFY_EXPIRY_KEY, String(Date.now() + data.expires_in * 1000));
    }

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
}

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    const data = await res.json();
    if (data.access_token) {
        localStorage.setItem(SPOTIFY_TOKEN_KEY, data.access_token);
        localStorage.setItem(SPOTIFY_EXPIRY_KEY, String(Date.now() + data.expires_in * 1000));
        return data.access_token;
    }
    return null;
}

async function getAccessToken(): Promise<string | null> {
    const token = localStorage.getItem(SPOTIFY_TOKEN_KEY);
    const expiry = Number(localStorage.getItem(SPOTIFY_EXPIRY_KEY) || "0");

    if (token && Date.now() < expiry) {
        return token;
    }
    return await refreshAccessToken();
}

// ----------------------
// Track Fetching
// ----------------------
export async function getCurrentlyPlaying(): Promise<SpotifyTrack | null> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 204) {
            return getRecentlyPlayed();
        }
        if (!response.ok) return null;

        const data = await response.json();
        if (!data.item) return null;

        return {
            isPlaying: data.is_playing,
            name: data.item.name,
            artist: data.item.artists.map((a: any) => a.name).join(", "),
            albumArt: data.item.album.images[0].url,
            url: data.item.external_urls.spotify,
        };
    } catch (e) {
        console.error("Error fetching currently playing:", e);
        return null;
    }
}

async function getRecentlyPlayed(): Promise<SpotifyTrack | null> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return null;

        const data = await response.json();
        const track = data.items[0]?.track;
        if (!track) return null;

        return {
            isPlaying: false,
            name: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
            albumArt: track.album.images[0].url,
            url: track.external_urls.spotify,
        };
    } catch (e) {
        console.error("Error fetching recently played:", e);
        return null;
    }
}
