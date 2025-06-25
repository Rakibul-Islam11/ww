// PurchasePage.jsx
import { useLocation } from 'react-router-dom';

const PurchasePage = () => {
    const { state } = useLocation();
    const product = state?.product;

    if (!product) {
        return <div className="container mx-auto px-4 py-8 text-center">Product not found</div>;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const address = e.target.elements.address.value;
        const payment = e.target.elements.payment.value;

        try {
            // পরিবর্তন করো এটাতে:
            const res = await fetch('https://ww-702kegdjg-rakibs-projects-e68e1ada.vercel.app/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: product.name,
                    deliveryAddress: address,
                    productPrice: product.price,
                }),
            });


            const data = await res.json();

            if (res.ok) {
                alert(`Order Placed! Tracking ID: ${data.tracking_id}`);
            } else {
                alert(`Failed to place order: ${data.message}`);
            }

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };
    const checkTrackingStatus = async (trackingId) => {
        try {
            const res = await fetch('https://ww-702kegdjg-rakibs-projects-e68e1ada.vercel.app/api/track-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tracking_id: trackingId }),
            });


            const data = await res.json();

            if (res.ok) {
                console.log('Tracking status:', data);
                alert(`Order status: ${data.data?.order_status}`);
            } else {
                alert(`Failed to fetch status: ${data.message}`);
            }

        } catch (err) {
            alert(`Error: ${err.message}`);
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
                                name="address"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Payment Method</label>
                            <select
                                name="payment"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Credit Card</option>
                                <option>PayPal</option>
                                <option>Bank Transfer</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md text-lg font-semibold transition-colors duration-300"
                        >
                            Confirm Purchase
                        </button>
                        <button
                            onClick={() => checkTrackingStatus('PA123456789')}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Check Order Status
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default PurchasePage;