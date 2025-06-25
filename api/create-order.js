// File: /api/create-order.js

export default async function handler(req, res) {
    // ✅ Step 0: CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Step 1: Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).send('OK'); // send something, not just end()
        return;
    }

    // ✅ Step 2: Allow only POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const {
            productName,
            deliveryAddress,
            productPrice,
        } = req.body;

        const PATHAO_CLIENT_ID = process.env.PATHAO_CLIENT_ID;
        const PATHAO_CLIENT_SECRET = process.env.PATHAO_CLIENT_SECRET;
        const PATHAO_USERNAME = process.env.PATHAO_USERNAME;
        const PATHAO_PASSWORD = process.env.PATHAO_PASSWORD;

        // Step 3: Get Auth Token
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

        // Step 4: Create Order
        const orderRes = await fetch('https://api-hermes.pathao.com/aladdin/api/v1/merchant/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                store_id: 1,
                merchant_order_id: Math.random().toString(36).substr(2, 9),
                item_type: 'parcel',
                item_description: productName,
                recipient_name: 'Customer Name',
                recipient_phone: '018XXXXXXXX',
                delivery_address: deliveryAddress,
                cash_collection_amount: productPrice,
                parcel_weight: 1,
                item_quantity: 1,
                delivery_type: 'regular',
                recipient_city: 2,
                recipient_zone: 15,
            }),
        });

        const orderData = await orderRes.json();
        return res.status(200).json(orderData);

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}
