// File: /api/track-order.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { tracking_id } = req.body;

        if (!tracking_id) {
            return res.status(400).json({ message: 'Tracking ID is required' });
        }

        const PATHAO_CLIENT_ID = process.env.PATHAO_CLIENT_ID;
        const PATHAO_CLIENT_SECRET = process.env.PATHAO_CLIENT_SECRET;
        const PATHAO_USERNAME = process.env.PATHAO_USERNAME;
        const PATHAO_PASSWORD = process.env.PATHAO_PASSWORD;

        // Step 1: Get Auth Token
        const authRes = await fetch('https://api-hermes.pathao.com/aladdin/api/v1/issue-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: PATHAO_CLIENT_ID,
                client_secret: PATHAO_CLIENT_SECRET,
                username: PATHAO_USERNAME,
                password: PATHAO_PASSWORD,
                grant_type: 'password'
            }),
        });

        const authData = await authRes.json();
        const token = authData.access_token;

        if (!token) return res.status(401).json({ message: 'Authentication failed' });

        // Step 2: Track Order
        const trackRes = await fetch(`https://api-hermes.pathao.com/aladdin/api/v1/merchant/track-order/${tracking_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        const trackingData = await trackRes.json();

        return res.status(200).json(trackingData);

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}
