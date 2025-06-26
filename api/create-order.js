// api/create-order.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // First get the access token from Pathao
        const authResponse = await axios.post('https://hermes-api.p-stageenv.xyz/aladdin/api/v1/issue-token', {
            client_id: process.env.PATHAO_CLIENT_ID,
            client_secret: process.env.PATHAO_CLIENT_SECRET,
            username: process.env.PATHAO_USERNAME,
            password: process.env.PATHAO_PASSWORD,
            grant_type: 'password'
        });

        const accessToken = authResponse.data.access_token;

        // Now create the order with Pathao
        const orderData = req.body; // This comes from your frontend
        const orderResponse = await axios.post('https://hermes-api.p-stageenv.xyz/aladdin/api/v1/orders', orderData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        return res.status(200).json(orderResponse.data);
    } catch (error) {
        console.error('Pathao API error:', error.response?.data || error.message);
        return res.status(500).json({
            message: 'Failed to create order',
            error: error.response?.data || error.message
        });
    }
}