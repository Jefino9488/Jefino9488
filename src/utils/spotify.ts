export interface SpotifyTrack {
    isPlaying: boolean;
    name: string;
    artist: string;
    albumArt: string;
    url: string;
}

const SPOTIFY_TOKEN_KEY = 'spotify_access_token';
const SPOTIFY_REFRESH_TOKEN_KEY = 'spotify_refresh_token';
const SPOTIFY_AUTH_PENDING = 'spotify_auth_pending';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173';

export function initiateSpotifyLogin() {
    if (localStorage.getItem(SPOTIFY_AUTH_PENDING)) {
        return;
    }
    localStorage.setItem(SPOTIFY_AUTH_PENDING, 'true');

    const scope = 'user-read-currently-playing user-read-recently-played';
    const state = generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);

    const authUrl = 'https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'token',
            client_id: CLIENT_ID,
            scope,
            redirect_uri: REDIRECT_URI,
            state,
            show_dialog: 'true'
        }).toString();

    window.location.href = authUrl;
}

export function handleCallback() {
    const hash = window.location.hash;
    if (!hash) return false;

    const params = new URLSearchParams(hash.substring(1)); // Remove the # symbol
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_auth_state');

    if (!accessToken || state !== storedState) {
        return false;
    }

    // Clear auth state
    localStorage.removeItem('spotify_auth_state');
    localStorage.removeItem(SPOTIFY_AUTH_PENDING);

    // Store the token
    localStorage.setItem(SPOTIFY_TOKEN_KEY, accessToken);

    // Clean up the URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
}

function generateRandomString(length: number) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function getCurrentlyPlaying(): Promise<SpotifyTrack | null> {
    const token = localStorage.getItem(SPOTIFY_TOKEN_KEY);

    if (!token && !localStorage.getItem(SPOTIFY_AUTH_PENDING)) {
        return null;
    }

    if (!token) return null;

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem(SPOTIFY_TOKEN_KEY);
            return null;
        }

        if (response.status === 204) {
            // No track playing, try getting recently played
            return getRecentlyPlayed();
        }

        if (!response.ok) {
            throw new Error('Failed to fetch currently playing');
        }

        const data = await response.json();
        if (!data.item) return null;

        return {
            isPlaying: data.is_playing,
            name: data.item.name,
            artist: data.item.artists[0].name,
            albumArt: data.item.album.images[0].url,
            url: data.item.external_urls.spotify
        };
    } catch (error) {
        console.error('Error fetching currently playing:', error);
        return null;
    }
}

async function getRecentlyPlayed(): Promise<SpotifyTrack | null> {
    const token = localStorage.getItem(SPOTIFY_TOKEN_KEY);
    if (!token) return null;

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem(SPOTIFY_TOKEN_KEY);
            }
            return null;
        }

        const data = await response.json();
        const track = data.items[0]?.track;
        if (!track) return null;

        return {
            isPlaying: false,
            name: track.name,
            artist: track.artists[0].name,
            albumArt: track.album.images[0].url,
            url: track.external_urls.spotify
        };
    } catch (error) {
        console.error('Error fetching recently played:', error);
        return null;
    }
}
