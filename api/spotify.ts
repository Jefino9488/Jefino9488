// api/spotify.ts (or .js if you don’t want TypeScript)
export default async function handler(req, res) {
    try {
        const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
        const client_id = process.env.SPOTIFY_CLIENT_ID;
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

        const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token,
            }),
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}
