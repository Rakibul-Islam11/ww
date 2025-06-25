/* global process */

export default async function handler(req, res) {
    const clientId = process.env.PATHAO_CLIENT_ID;
    const clientSecret = process.env.PATHAO_CLIENT_SECRET;
    const username = process.env.PATHAO_USERNAME;
    const password = process.env.PATHAO_PASSWORD;

    try {
        const tokenResponse = await fetch("https://api.pathao.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                username,
                password,
                grant_type: "password",
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            return res.status(tokenResponse.status).json({ error: tokenData });
        }

        res.status(200).json({ access_token: tokenData.access_token });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
