import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import AddressFormModal from '../components/AddressFormModal';
import axios from 'axios';
import { toast } from 'react-toastify';

// ── helpers ──────────────────────────────────────────────
const inputCls = 'border border-gray-300 rounded py-1.5 px-3.5 w-full text-base focus:outline-none focus:border-gray-600 disabled:bg-gray-50 disabled:text-gray-500';
const sectionCls = 'border border-gray-200 rounded p-6 mb-6';

// ── Personal Info ─────────────────────────────────────────
const PersonalInfo = ({ profile, token, backendUrl, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (profile) setForm({ name: profile.name || '', phone: profile.phone || '' });
  }, [profile]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (form.phone && !/^[0-9]{7,15}$/.test(form.phone.replace(/[\s\-\+\(\)]/g, ''))) {
      toast.error('Invalid phone number'); return;
    }
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) { onUpdate(data.user); setEditing(false); toast.success('Profile updated'); }
      else toast.error(data.message);
    } catch { toast.error('Failed to update profile'); }
  };

  return (
    <div className={sectionCls}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-lg">Personal Information</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm border border-gray-300 px-4 py-1.5 hover:border-black transition-colors">
            Edit Profile
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
          <input className={inputCls} value={form.name} disabled={!editing}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Email</label>
          <input className={inputCls} value={profile?.email || ''} disabled />
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
          <input className={inputCls} value={form.phone} disabled={!editing} placeholder="Not set"
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
        </div>
        {editing && (
          <div className="flex gap-3 mt-1">
            <button onClick={() => { setEditing(false); setForm({ name: profile.name, phone: profile.phone || '' }); }}
              className="flex-1 border border-gray-300 py-2 text-sm hover:border-gray-600">Cancel</button>
            <button onClick={handleSave} className="flex-1 bg-black text-white py-2 text-sm active:bg-gray-700">Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Address Card ──────────────────────────────────────────
const AddressCard = ({ addr, onEdit, onDelete, onSetDefault }) => (
  <div className={`border rounded p-4 relative ${addr.isDefault ? 'border-black' : 'border-gray-200'}`}>
    {addr.isDefault && (
      <span className="absolute top-3 right-3 text-[10px] bg-black text-white px-2 py-0.5 rounded-full">Default</span>
    )}
    <p className="font-medium text-base">{addr.fullName}</p>
    <p className="text-sm text-gray-500 mt-0.5">{addr.phone}</p>
    <p className="text-sm text-gray-600 mt-1">
      {addr.houseNo}, {addr.street}{addr.landmark ? `, ${addr.landmark}` : ''}
    </p>
    <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
    <p className="text-sm text-gray-600">{addr.country}</p>
    <span className="inline-block mt-2 text-xs border border-gray-300 px-2 py-0.5 text-gray-500">{addr.addressType}</span>
    <div className="flex gap-3 mt-3">
      <button onClick={() => onEdit(addr)} className="text-sm text-gray-600 hover:text-black underline underline-offset-2">Edit</button>
      <button onClick={() => onDelete(addr._id)} className="text-sm text-red-500 hover:text-red-700 underline underline-offset-2">Delete</button>
      {!addr.isDefault && (
        <button onClick={() => onSetDefault(addr._id)} className="text-sm text-gray-600 hover:text-black underline underline-offset-2">Set Default</button>
      )}
    </div>
  </div>
);

// ── Saved Addresses ───────────────────────────────────────
const SavedAddresses = ({ addresses, setAddresses, token, backendUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const [editAddr, setEditAddr] = useState(null);
  const atMax = addresses.length >= 5;

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const handleSave = async (form) => {
    try {
      if (editAddr) {
        const { data } = await axios.put(`${backendUrl}/api/user/address/update`,
          { addressId: editAddr._id, ...form }, authHeaders);
        if (data.success) { setAddresses(data.addresses); toast.success('Address updated'); }
        else toast.error(data.message);
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/address/add`, form, authHeaders);
        if (data.success) { setAddresses(data.addresses); toast.success('Address added'); }
        else toast.error(data.message);
      }
    } catch { toast.error('Failed to save address'); }
    setShowModal(false);
    setEditAddr(null);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/user/address/delete`,
        { ...authHeaders, data: { addressId } });
      if (data.success) { setAddresses(data.addresses); toast.success('Address deleted'); }
      else toast.error(data.message);
    } catch { toast.error('Failed to delete address'); }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/address/set-default`,
        { addressId }, authHeaders);
      if (data.success) setAddresses(data.addresses);
      else toast.error(data.message);
    } catch { toast.error('Failed to set default'); }
  };

  return (
    <div className={sectionCls}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-lg">Saved Addresses</h2>
        {!atMax ? (
          <button onClick={() => { setEditAddr(null); setShowModal(true); }}
            className="text-sm border border-gray-300 px-4 py-1.5 hover:border-black transition-colors">
            + Add Address
          </button>
        ) : (
          <span className="text-sm text-gray-500">Max 5 addresses reached</span>
        )}
      </div>

      {atMax && (
        <p className="text-xs text-gray-500 mb-3 bg-gray-50 border border-gray-200 rounded px-3 py-2">
          Maximum 5 addresses allowed. Delete an existing address before adding another.
        </p>
      )}

      {addresses.length === 0 ? (
        <p className="text-base text-gray-400">No saved addresses. Add one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <AddressCard key={addr._id} addr={addr}
              onEdit={(a) => { setEditAddr(a); setShowModal(true); }}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddressFormModal
          initial={editAddr}
          isFirst={addresses.length === 0}
          onClose={() => { setShowModal(false); setEditAddr(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// ── Security ──────────────────────────────────────────────
const Security = ({ token, backendUrl, onLogout }) => {
  const [showPwd, setShowPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/change-password`,
        { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setShowPwd(false);
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else toast.error(data.message);
    } catch { toast.error('Failed to change password'); }
  };

  return (
    <div className={sectionCls}>
      <h2 className="font-medium text-lg mb-4">Security</h2>
      <div className="flex flex-col gap-3">
        <button onClick={() => setShowPwd(p => !p)}
          className="w-full sm:w-auto border border-gray-300 px-4 py-2 text-sm text-left hover:border-black transition-colors">
          Change Password
        </button>

        {showPwd && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-3 mt-1 max-w-sm">
            <input type="password" placeholder="Current Password" className={inputCls}
              value={pwdForm.currentPassword} onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))} required />
            <input type="password" placeholder="New Password (min 8 chars)" className={inputCls}
              value={pwdForm.newPassword} onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} required />
            <input type="password" placeholder="Confirm New Password" className={inputCls}
              value={pwdForm.confirmPassword} onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowPwd(false)}
                className="flex-1 border border-gray-300 py-2 text-sm hover:border-gray-600">Cancel</button>
              <button type="submit" className="flex-1 bg-black text-white py-2 text-sm active:bg-gray-700">Update</button>
            </div>
          </form>
        )}

        <button onClick={onLogout}
          className="w-full sm:w-auto border border-gray-300 px-4 py-2 text-sm text-left text-red-500 hover:border-red-400 transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
};

// ── Main Profile Page ─────────────────────────────────────
const Profile = () => {
  const { token, setToken, setCartItems, navigate, backendUrl, userProfile, setUserProfile, addresses, setAddresses } = useContext(ShopContext);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    navigate('/login');
  };

  if (!userProfile) return <div className="pt-16 min-h-[60vh] flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="pt-14 pb-20">
      <div className="text-2xl mb-8">
        <Title text1="MY" text2="PROFILE" />
      </div>

      <div className="max-w-3xl">
        <PersonalInfo profile={userProfile} token={token} backendUrl={backendUrl} onUpdate={setUserProfile} />
        <SavedAddresses addresses={addresses} setAddresses={setAddresses} token={token} backendUrl={backendUrl} />

        {/* My Orders card */}
        <div className={sectionCls}>
          <h2 className="font-medium text-lg mb-4">My Orders</h2>
          <button onClick={() => navigate('/orders')}
            className="flex items-center gap-3 border border-gray-200 rounded p-4 w-full sm:w-auto hover:border-black transition-colors text-left">
            <div>
              <p className="text-base font-medium">View My Orders</p>
              <p className="text-sm text-gray-500 mt-0.5">Track and manage your orders</p>
            </div>
            <span className="ml-auto text-gray-400">›</span>
          </button>
        </div>

        <Security token={token} backendUrl={backendUrl} onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Profile;
