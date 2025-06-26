// src/TrackOrder.jsx
import { useLocation } from 'react-router-dom';

const TrackOrder = () => {
    const { state } = useLocation();
    const trackingId = state?.trackingId;
    const orderDetails = state?.orderDetails;

    if (!trackingId || !orderDetails) {
        return <div className="container mx-auto px-4 py-8 text-center">Order information not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Order Confirmed</h1>
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
                <div className="text-center mb-6">
                    <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <h2 className="text-xl font-bold mt-4">Thank you for your order!</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-800">Tracking ID:</h3>
                        <p className="text-blue-600 font-mono">{trackingId}</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800">Product:</h3>
                        <p>{orderDetails.product.name}</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800">Shipping to:</h3>
                        <p>{orderDetails.shippingAddress}</p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800">Payment Method:</h3>
                        <p>{orderDetails.paymentMethod}</p>
                    </div>

                    <div className="pt-4">
                        <a
                            href={`https://pathao.com/track/${trackingId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
                        >
                            Track Your Order
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;