import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PurchasePage = () => {
    const { state } = useLocation();
    const product = state?.product;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        shippingAddress: '',
        paymentMethod: 'Credit Card'
    });

    if (!product) {
        return <div className="container mx-auto px-4 py-8 text-center">Product not found</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderData = {
                // আপনার অর্ডার ডাটা
            };

            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            // প্রথমে রেসপন্স টেক্সট হিসেবে পড়ুন
            const responseText = await response.text();

            // তারপর JSON এ কনভার্ট করার চেষ্টা করুন
            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Invalid server response');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }

            // সাকসেস হলে নেভিগেট করুন
            navigate('/track-order', {
                state: {
                    trackingId: data.tracking_id,
                    orderDetails: {
                        product,
                        shippingAddress: formData.shippingAddress,
                        paymentMethod: formData.paymentMethod
                    }
                }
            });
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
            console.error('Order submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Complete Your Purchase</h1>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                />
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 mb-2">Shipping Address</label>
                            <textarea
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Credit Card">Credit Card</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>

                        {error && (
                            <div className="text-red-500 text-center">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md text-lg font-semibold transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Confirm Purchase'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PurchasePage;