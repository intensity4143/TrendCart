import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { generateInvoice } from '../utils/generateInvoice';
import axios from 'axios';

// ── constants ─────────────────────────────────────────────
const TIMELINE_STEPS = [
  'Order Placed',
  'Processing',
  'Packed',
  'Shipped',
  'Out For Delivery',
  'Delivered',
];

const fmt = (n) => Number(n || 0).toFixed(2);

// ── reusable sub-components ───────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-0 py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-500 sm:w-40 shrink-0">{label}</span>
    <span className="text-sm text-gray-900">{value || '—'}</span>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="border border-gray-200 rounded p-5">
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{title}</h2>
    {children}
  </div>
);

// ── Status Timeline ───────────────────────────────────────
const StatusTimeline = ({ currentStatus }) => {
  const currentIdx = TIMELINE_STEPS.indexOf(currentStatus);
  return (
    <div className="relative">
      {/* vertical connector line */}
      <div className="absolute left-3 top-3 bottom-3 w-px bg-gray-200" />
      <div className="flex flex-col gap-4">
        {TIMELINE_STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const future = idx > currentIdx;
          return (
            <div key={step} className="flex items-center gap-4 relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 text-xs font-bold
                ${active ? 'bg-black text-white ring-2 ring-black ring-offset-2'
                  : done ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-300'}`}>
                {done ? '✓' : idx + 1}
              </div>
              <span className={`text-sm ${active ? 'font-semibold text-black' : done ? 'text-gray-600' : 'text-gray-300'}`}>
                {step}
              </span>
              {active && (
                <span className="ml-auto text-[10px] bg-black text-white px-2 py-0.5 rounded-full">Current</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────
const OrderDetail = () => {
  const { orderId } = useParams();
  const { backendUrl, token, currency, navigate, userProfile } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/order/detail/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) setOrder(data.order);
      else if (!isRefresh) setNotFound(true);
    } catch {
      if (!isRefresh) setNotFound(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchOrder();
  }, [token, orderId]);

  if (loading) {
    return (
      <div className="pt-16 min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading order details...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="pt-16 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">Order not found or you don't have access to this order.</p>
        <button onClick={() => navigate('/orders')} className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-800">
          Back to Orders
        </button>
      </div>
    );
  }

  const addr = order.address || {};
  const sub = order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = order.shippingCharge ?? 10;
  const discount = order.discount || 0;
  const tax = order.tax || 0;

  return (
    <div className="pt-14 pb-20">
      {/* page header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/orders')}
          className="text-sm text-gray-400 hover:text-black transition-colors"
        >
          ← My Orders
        </button>
        <div className="text-2xl">
          <Title text1="ORDER" text2="DETAILS" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column ─────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Order Information */}
          <SectionCard title="Order Information">
            <InfoRow label="Order ID" value={<span className="font-mono text-xs">{order.orderId}</span>} />
            <InfoRow label="Order Date" value={new Date(order.date).toDateString()} />
            <InfoRow label="Order Status" value={
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full inline-block ${
                  order.status === 'Delivered' ? 'bg-green-500' :
                  order.status === 'Shipped' || order.status === 'Out For Delivery' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`} />
                {order.status}
              </span>
            } />
            <InfoRow label="Payment Status" value={
              <span className={order.payment ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                {order.payment ? '✓ Paid' : 'Pending'}
              </span>
            } />
            <InfoRow label="Payment Method" value={order.paymentMethod} />
            {order.paymentOrderId && (
              <InfoRow label="Transaction ID" value={<span className="font-mono text-xs break-all">{order.paymentOrderId}</span>} />
            )}
          </SectionCard>

          {/* Order Timeline */}
          <div className="border border-gray-200 rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Order Timeline</h2>
              <button
                onClick={() => fetchOrder(true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-black border border-gray-200 hover:border-black px-2.5 py-1 rounded transition-colors disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <StatusTimeline currentStatus={order.status} />
          </div>

          {/* Ordered Products */}
          <SectionCard title={`Ordered Products (${order.items.length})`}>
            <div className="flex flex-col divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  onClick={() => item._id && navigate(`/product/${item._id}`)}
                >
                  <img
                    src={item.image?.[0]}
                    alt={item.name}
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                    {item.brand && <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {item.size && (
                        <span className="text-xs text-gray-500">
                          Size: <span className="text-gray-700 font-medium">{item.size}</span>
                        </span>
                      )}
                      {item.color && (
                        <span className="text-xs text-gray-500">
                          Color: <span className="text-gray-700 font-medium">{item.color}</span>
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Qty: <span className="text-gray-700 font-medium">{item.quantity}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">{currency}{fmt(item.price)} × {item.quantity}</span>
                      <span className="text-sm font-semibold text-gray-800">{currency}{fmt(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>

        {/* ── Right column ────────────────────────────── */}
        <div className="lg:w-72 xl:w-80 flex flex-col gap-6 shrink-0">

          {/* Shipping Address */}
          <SectionCard title="Shipping Address">
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-gray-800">{addr.fullName}</p>
              <p className="text-gray-500 text-xs mt-0.5">{addr.phone}</p>
              <p className="mt-2 text-gray-600">{addr.houseNo}, {addr.street}</p>
              {addr.landmark && <p className="text-gray-600">{addr.landmark}</p>}
              <p className="text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
              <p className="text-gray-600">{addr.country}</p>
            </div>
          </SectionCard>

          {/* Price Summary */}
          <SectionCard title="Price Summary">
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{currency}{fmt(sub)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Charges</span>
                <span>{currency}{fmt(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>{discount > 0 ? `-${currency}${fmt(discount)}` : '—'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{tax > 0 ? `${currency}${fmt(tax)}` : '—'}</span>
              </div>
              <hr className="border-gray-100 my-1" />
              <div className="flex justify-between font-semibold text-base text-gray-900">
                <span>Grand Total</span>
                <span>{currency}{fmt(order.amount)}</span>
              </div>
            </div>
          </SectionCard>

          {/* Download Invoice */}
          <button
            onClick={() => generateInvoice(order, currency, userProfile)}
            className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 active:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>↓</span>
            <span>Download Invoice</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
