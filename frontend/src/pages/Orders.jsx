import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const STATUS_DOT = {
  'Order Placed':     'bg-blue-500',
  'Processing':       'bg-yellow-500',
  'Packed':           'bg-orange-400',
  'Shipped':          'bg-purple-500',
  'Out For Delivery': 'bg-indigo-500',
  'Delivered':        'bg-green-500',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/order/userOrders`, {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="pt-16 min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-20">
      <div className="text-2xl mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 text-sm">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate('/collection')}
            className="mt-4 bg-black text-white px-6 py-2 text-sm hover:bg-gray-800"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order.orderId}`)}
              className="border border-gray-200 rounded p-4 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* product thumbnails */}
                <div className="flex gap-2 shrink-0">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image?.[0]}
                      alt={item.name}
                      className="w-14 h-16 object-cover border border-gray-100"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-14 h-16 bg-gray-50 border border-gray-100 flex items-center justify-center text-xs text-gray-400">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                {/* order info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-400">{order.orderId}</p>
                  <p className="text-sm font-medium mt-0.5 truncate text-gray-800">
                    {order.items.map((i) => i.name).join(', ')}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                    <span>{new Date(order.date).toDateString()}</span>
                    <span className="text-gray-300">|</span>
                    <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-semibold text-gray-700">{currency}{order.amount}</span>
                    <span className="text-gray-300">|</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                {/* status + arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[order.status] || 'bg-gray-400'}`} />
                    <span className="text-sm text-gray-700">{order.status}</span>
                  </div>
                  <span className="text-gray-300 text-xl leading-none">›</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
