import { useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { navigate } = useContext(ShopContext);
  const timerRef = useRef(null);

  const goToOrder = () => {
    clearTimeout(timerRef.current);
    navigate(`/orders/${orderId}`);
  };

  const continueShopping = () => {
    clearTimeout(timerRef.current);
    navigate('/collection');
  };

  useEffect(() => {
    timerRef.current = setTimeout(goToOrder, 3000);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center text-center max-w-md w-full animate-fade-in"
        style={{ animation: 'fadeScaleIn 0.4s ease both' }}
      >
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full border-2 border-green-500 flex items-center justify-center mb-6"
          style={{ animation: 'scaleIn 0.35s ease 0.1s both' }}
        >
          <svg className="w-9 h-9 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Placed Successfully</h1>

        {/* Message */}
        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          Thank you for shopping with TrendCart. Your order has been placed successfully.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 rounded px-5 py-3 mb-6 w-full">
            <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
            <p className="font-mono text-sm text-gray-800 font-medium">{orderId}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={goToOrder}
            className="flex-1 bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            View Order
          </button>
          <button
            onClick={continueShopping}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 text-sm hover:border-black hover:text-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Redirect hint */}
        <p className="text-xs text-gray-400 mt-5">Redirecting to your order details...</p>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
