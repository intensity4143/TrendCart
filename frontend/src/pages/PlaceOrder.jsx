import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import AddressFormModal from '../components/AddressFormModal';
import { assets } from '../assets/frontend_assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const inputCls = 'border border-gray-300 rounded py-1.5 px-3.5 w-full text-sm focus:outline-none focus:border-gray-600';

const EMPTY_FORM = {
  fullName: '', phone: '', houseNo: '', street: '',
  landmark: '', city: '', state: '', pincode: '', country: '',
};

const addrToForm = (addr) => ({
  fullName: addr.fullName || '',
  phone: addr.phone || '',
  houseNo: addr.houseNo || '',
  street: addr.street || '',
  landmark: addr.landmark || '',
  city: addr.city || '',
  state: addr.state || '',
  pincode: addr.pincode || '',
  country: addr.country || '',
});

// ── Address Picker Modal ──────────────────────────────────
const AddressPickerModal = ({ addresses, selected, onSelect, onClose, onAddNew, atMax }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-lg rounded max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="font-medium text-lg">Select Address</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-black text-xl leading-none">&times;</button>
      </div>
      <div className="px-6 py-4 flex flex-col gap-3">
        {addresses.map(addr => (
          <div
            key={addr._id}
            onClick={() => { onSelect(addr); onClose(); }}
            className={`border rounded p-4 cursor-pointer transition-colors ${selected?._id === addr._id ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{addr.fullName}</p>
                <p className="text-xs text-gray-500">{addr.phone}</p>
                <p className="text-xs text-gray-600 mt-1">{addr.houseNo}, {addr.street}{addr.landmark ? `, ${addr.landmark}` : ''}</p>
                <p className="text-xs text-gray-600">{addr.city}, {addr.state} - {addr.pincode}, {addr.country}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                <span className="text-[10px] border border-gray-300 px-2 py-0.5 text-gray-500">{addr.addressType}</span>
                {addr.isDefault && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full">Default</span>}
              </div>
            </div>
          </div>
        ))}
        {!atMax && (
          <button onClick={onAddNew}
            className="border border-dashed border-gray-300 rounded p-4 text-sm text-gray-500 hover:border-black hover:text-black transition-colors text-center">
            + Add New Address
          </button>
        )}
        {atMax && addresses.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No saved addresses.</p>
        )}
      </div>
    </div>
  </div>
);

// ── Main PlaceOrder ───────────────────────────────────────
const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPicker, setShowPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const {
    navigate, backendUrl, token,
    products, cartItems, setCartItems,
    getCartAmount, delivery_fee,
    buyNowItem, setBuyNowItem,
    addresses, setAddresses,
  } = useContext(ShopContext);

  // auto-select default address on mount
  useEffect(() => {
    if (addresses.length > 0) {
      const def = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddr(def);
      setFormData(addrToForm(def));
    }
  }, [addresses]);

  useEffect(() => { return () => setBuyNowItem(null); }, []);

  const onChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSelectAddr = (addr) => {
    setSelectedAddr(addr);
    setFormData(addrToForm(addr));
  };

  const handleAddNewAddress = async (form) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/address/add`, form,
        { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setAddresses(data.addresses);
        const newAddr = data.addresses[data.addresses.length - 1];
        handleSelectAddr(newAddr);
        toast.success('Address added');
      } else toast.error(data.message);
    } catch { toast.error('Failed to add address'); }
    setShowAddForm(false);
  };

  const getOrderItems = () => {
    if (buyNowItem) {
      const p = structuredClone(products.find(p => p._id === buyNowItem.itemId));
      if (p) { p.size = buyNowItem.size; p.quantity = 1; return [p]; }
      return [];
    }
    const items = [];
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        const p = structuredClone(products.find(p => p._id === item));
        if (p) { p.size = size; p.quantity = cartItems[item][size]; items.push(p); }
      }
    }
    return items;
  };

  const getOrderAmount = () => {
    if (buyNowItem) {
      const p = products.find(p => p._id === buyNowItem.itemId);
      return p ? p.price + delivery_fee : delivery_fee;
    }
    return getCartAmount() + delivery_fee;
  };

  const clearOrder = () => {
    if (buyNowItem) setBuyNowItem(null);
    else setCartItems({});
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/order/verifyRazorpay`, response,
            { headers: { Authorization: `Bearer ${token}` } });
          if (data.success) { clearOrder(); navigate(`/order-success/${data.orderId}`); }
          else toast.error(data.message);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Payment verification failed');
        }
      },
      theme: { color: '#000000' },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => toast.error('Payment Failed'));
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const required = ['fullName', 'phone', 'houseNo', 'street', 'city', 'state', 'pincode', 'country'];
    for (const f of required) {
      if (!formData[f]?.trim()) { toast.error(`${f} is required`); return; }
    }
    try {
      const orderData = { address: formData, items: getOrderItems(), amount: getOrderAmount() };
      switch (paymentMethod) {
        case 'cod': {
          const { data } = await axios.post(`${backendUrl}/api/order/place`, orderData,
            { headers: { Authorization: `Bearer ${token}` } });
          if (data.success) { clearOrder(); navigate(`/order-success/${data.orderId}`); }
          else toast.error(data.message);
          break;
        }
        case 'stripe': {
          const { data } = await axios.post(`${backendUrl}/api/order/stripe`, orderData,
            { headers: { Authorization: `Bearer ${token}` } });
          if (data.success) window.location.replace(data.session_url);
          else toast.error(data.message);
          break;
        }
        case 'razorpay': {
          const { data } = await axios.post(`${backendUrl}/api/order/razorpay`, orderData,
            { headers: { Authorization: `Bearer ${token}` } });
          if (data.success) initPay(data.order);
          else toast.error(data.message);
          break;
        }
        default: break;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const atMax = addresses.length >= 5;

  return (
    <form onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]">

      {/* ── Left: Delivery Info ── */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVER" text2="INFORMATION" />
        </div>

        {/* Selected address banner */}
        {addresses.length > 0 && (
          <div className="border border-gray-200 rounded p-3 flex items-start justify-between gap-3">
            <div className="text-xs text-gray-600 leading-relaxed">
              {selectedAddr ? (
                <>
                  <p className="font-medium text-gray-800">{selectedAddr.fullName} · {selectedAddr.phone}</p>
                  <p>{selectedAddr.houseNo}, {selectedAddr.street}{selectedAddr.landmark ? `, ${selectedAddr.landmark}` : ''}</p>
                  <p>{selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}, {selectedAddr.country}</p>
                </>
              ) : <p>No address selected</p>}
            </div>
            <button type="button" onClick={() => setShowPicker(true)}
              className="shrink-0 text-xs border border-gray-300 px-3 py-1.5 hover:border-black transition-colors whitespace-nowrap">
              Change Address
            </button>
          </div>
        )}

        {addresses.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">No saved addresses</p>
            <button type="button" onClick={() => setShowAddForm(true)}
              className="text-sm border border-gray-300 px-4 py-1.5 hover:border-black transition-colors">
              + Add Address
            </button>
          </div>
        )}

        {/* Editable form — snapshot for this order only */}
        <input name="fullName" value={formData.fullName} onChange={onChange} placeholder="Full Name *" className={inputCls} />
        <input name="phone" value={formData.phone} onChange={onChange} placeholder="Phone Number *" className={inputCls} />
        <input name="houseNo" value={formData.houseNo} onChange={onChange} placeholder="House No. / Flat No. *" className={inputCls} />
        <input name="street" value={formData.street} onChange={onChange} placeholder="Street / Area / Locality *" className={inputCls} />
        <input name="landmark" value={formData.landmark} onChange={onChange} placeholder="Landmark (Optional)" className={inputCls} />
        <div className="flex gap-3">
          <input name="city" value={formData.city} onChange={onChange} placeholder="City *" className={inputCls} />
          <input name="state" value={formData.state} onChange={onChange} placeholder="State *" className={inputCls} />
        </div>
        <div className="flex gap-3">
          <input name="pincode" value={formData.pincode} onChange={onChange} placeholder="PIN Code *" className={inputCls} />
          <input name="country" value={formData.country} onChange={onChange} placeholder="Country *" className={inputCls} />
        </div>
        <p className="text-xs text-gray-400">Editing here only affects this order. To save changes permanently, update from My Profile.</p>
      </div>

      {/* ── Right: Summary + Payment ── */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHODS" />
          <div className="flex gap-3 flex-col lg:flex-row">
            {[
              { id: 'stripe', logo: assets.stripe_logo },
              { id: 'razorpay', logo: assets.razorpay_logo },
            ].map(({ id, logo }) => (
              <div key={id} onClick={() => setPaymentMethod(id)}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-400">
                <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === id ? 'bg-green-400' : ''}`}></p>
                <img className="h-5 mx-4" src={logo} alt={id} />
              </div>
            ))}
            <div onClick={() => setPaymentMethod('cod')}
              className="flex items-center gap-3 border border-gray-400 p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showPicker && (
        <AddressPickerModal
          addresses={addresses}
          selected={selectedAddr}
          onSelect={handleSelectAddr}
          onClose={() => setShowPicker(false)}
          onAddNew={() => { setShowPicker(false); setShowAddForm(true); }}
          atMax={atMax}
        />
      )}
      {showAddForm && (
        <AddressFormModal
          isFirst={addresses.length === 0}
          onClose={() => setShowAddForm(false)}
          onSave={handleAddNewAddress}
        />
      )}
    </form>
  );
};

export default PlaceOrder;
