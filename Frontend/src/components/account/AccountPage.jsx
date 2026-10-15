import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Edit3, 
  Trash2, 
  Plus, 
  Truck, 
  Copy, 
  ShoppingBag, 
  ExternalLink,
  Download,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const AccountPage = () => {
  const {
    user,
    updateUserProfile,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultSavedAddress,
    wishlist,
    toggleWishlist,
    moveWishlistToCart,
    formatPrice,
    navigateTo,
    activeAccountTab,
    setActiveAccountTab,
    showToast,
    isUserLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
  } = useStore();

  const [authView, setAuthView] = useState('signin'); // 'signin' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: 'Residence',
    fullName: user.name,
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: user.phone,
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.zip) {
      showToast('Please fill in street, city, and zip code', 'error');
      return;
    }
    addSavedAddress(addressForm);
    setIsAddingAddress(false);
    setAddressForm({
      title: 'Residence',
      fullName: user.name,
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      phone: user.phone,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied tracking number ${text}`, 'success');
  };

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // If user is not logged in, render the luxury Sign In / Sign Up portal
  if (!isUserLoggedIn) {
    const handleAuthSignIn = async (e) => {
      e.preventDefault();
      setAuthError('');
      if (!authEmail || !authPassword) {
        setAuthError('Please enter both email and password.');
        return;
      }
      setAuthLoading(true);
      const res = await loginUser({ email: authEmail, password: authPassword });
      setAuthLoading(false);
      if (!res.success) {
        setAuthError(res.message || 'Invalid email or password.');
      }
    };

    const handleAuthSignUp = async (e) => {
      e.preventDefault();
      setAuthError('');
      if (!authName || !authEmail || !authPassword) {
        setAuthError('Please fill in name, email, and password.');
        return;
      }
      setAuthLoading(true);
      const res = await registerUser({ name: authName, email: authEmail, password: authPassword, phone: authPhone });
      setAuthLoading(false);
      if (!res.success) {
        setAuthError(res.message || 'Registration failed.');
      }
    };

    const handleQuickDemo = async () => {
      setAuthLoading(true);
      await loginUser({ email: 'adrian.vance@atelier-2l.com', password: 'password123' });
      setAuthLoading(false);
    };

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fadeIn text-left">
        <div className="bg-[#111115] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-amber-400" />
              <span>2L Atelier Member Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {authView === 'signin' ? 'Sign In to Your Account' : 'Create 2L VIP Account'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md mx-auto">
              Access your order history, delivery tracking, saved wishlist, and exclusive Noir VIP drops.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-neutral-900 border border-white/10 rounded-xl p-1 mb-6 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => { setAuthView('signin'); setAuthError(''); }}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                authView === 'signin' ? 'bg-white text-black shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthView('signup'); setAuthError(''); }}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                authView === 'signup' ? 'bg-white text-black shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authView === 'signin' ? (
            <form onSubmit={handleAuthSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. adrian@atelier-2l.com"
                    className="w-full bg-neutral-900 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showAuthPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-neutral-900 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 pl-10 pr-10 focus:outline-none transition-all font-mono"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {authLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={15} />
                    <span>Sign In to 2L</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/15 hover:border-amber-400/40 text-neutral-300 hover:text-amber-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>⚡ 1-Click Demo Login (Adrian Vance)</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuthSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full bg-neutral-900 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. maya@example.com"
                    className="w-full bg-neutral-900 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showAuthPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Choose a secure password"
                    className="w-full bg-neutral-900 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 pl-10 pr-10 focus:outline-none transition-all font-mono"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showAuthPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-neutral-900 border border-white/15 focus:border-white focus:ring-1 focus:ring-white rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 pl-10 focus:outline-none transition-all"
                  />
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300 flex items-center space-x-2">
                <Sparkles size={15} className="shrink-0 text-amber-400" />
                <span>Includes 200 welcome Noir VIP points credited upon account creation!</span>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {authLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>Create Account & Join VIP</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      
      {/* User Header Card */}
      <div className="relative rounded-2xl bg-[#121216] border border-white/[0.08] p-6 sm:p-8 mb-8 overflow-hidden shadow-subtle">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                onError={(e) => { e.currentTarget.src = '/images/hero_streetwear.jpg'; }}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border border-white/20"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121216]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user.name}
                </h1>
                <span className="bg-white/10 text-white text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/10">
                  {user.tier}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 font-normal">{user.email}</p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Member since {user.memberSince}
              </p>
            </div>
          </div>

          {/* Right Header Actions: Points & Logout */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Loyalty Tier Progress */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-3.5 w-full md:w-64 font-medium">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-400">Noir Tier Points</span>
                <span className="text-white font-semibold">{user.points} / {user.nextTierPoints}</span>
              </div>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${(user.points / user.nextTierPoints) * 100}%` }}
                />
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={() => logoutUser()}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-neutral-900 hover:bg-red-500/10 text-neutral-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0"
              title="Log out of your 2L account"
            >
              <LogOut size={15} className="text-red-400" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-white/[0.08] mb-8 overflow-x-auto pb-1 hide-scrollbar font-medium">
        <button
          onClick={() => setActiveAccountTab('profile')}
          className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeAccountTab === 'profile'
              ? 'bg-white text-black font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User size={14} />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveAccountTab('orders')}
          className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeAccountTab === 'orders'
              ? 'bg-white text-black font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Package size={14} />
          <span>My Orders ({user.orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAccountTab('addresses')}
          className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeAccountTab === 'addresses'
              ? 'bg-white text-black font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MapPin size={14} />
          <span>Addresses ({user.savedAddresses.length})</span>
        </button>

        <button
          onClick={() => setActiveAccountTab('wishlist')}
          className={`flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeAccountTab === 'wishlist'
              ? 'bg-white text-black font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Heart size={14} />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: PROFILE */}
      {activeAccountTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl bg-[#121216] border border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-semibold text-white">Identity Credentials</h3>
                <p className="text-xs text-neutral-400 font-normal">Personal contact information</p>
              </div>

              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                      Telephone
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl text-xs uppercase tracking-wider hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="text-[11px] uppercase text-neutral-400 block font-medium">Full Name</span>
                  <p className="text-white font-medium mt-1">{user.name}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-neutral-400 block font-medium">Telephone</span>
                  <p className="text-white font-medium mt-1">{user.phone}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-neutral-400 block font-medium">Email Address</span>
                  <p className="text-white font-medium mt-1">{user.email}</p>
                </div>
                <div>
                  <span className="text-[11px] uppercase text-neutral-400 block font-medium">VIP Tier</span>
                  <p className="text-white font-semibold mt-1">{user.tier}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-[#121216] border border-white/[0.08] space-y-4 font-medium text-xs">
            <h4 className="text-[11px] uppercase tracking-wider text-neutral-400">
              Account Overview
            </h4>
            <div className="divide-y divide-white/[0.06]">
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Total Orders</span>
                <span className="text-white font-semibold">{user.orders.length}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Saved Wishlist</span>
                <span className="text-white font-semibold">{wishlist.length}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Default Currency</span>
                <span className="text-white">INR (₹)</span>
              </div>
            </div>

            {/* Logout from Profile Tab */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => logoutUser()}
                className="w-full py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Log Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: MY ORDERS WITH STEP-BY-STEP PROGRESS */}
      {activeAccountTab === 'orders' && (
        <div className="space-y-6">
          {user.orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-2xl bg-[#121216] border border-white/[0.08] shadow-subtle space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base font-bold text-white">
                      Order #{order.id}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'Delivered'
                          ? 'bg-neutral-800 text-neutral-200 border border-white/10'
                          : 'bg-white/15 text-white border border-white/20'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Placed on {order.date} • Total: <strong className="text-white">{formatPrice(order.total)}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-2 bg-neutral-900 border border-white/10 px-3 py-1 rounded-xl text-xs text-neutral-300">
                    <Truck size={13} className="text-white" />
                    <span>{order.carrier}:</span>
                    <span className="text-white font-medium">{order.trackingNumber}</span>
                    <button
                      onClick={() => copyToClipboard(order.trackingNumber)}
                      className="p-1 text-neutral-400 hover:text-white"
                      title="Copy"
                    >
                      <Copy size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => showToast(`Invoice #${order.id}.pdf downloading`, 'info')}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs transition-colors"
                  >
                    <Download size={12} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="py-2">
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-4 flex items-center justify-between font-medium">
                  <span>Dispatch Timeline</span>
                  <span className="text-white font-semibold">
                    Estimated: {order.estimatedDelivery}
                  </span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {order.steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-start">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            step.completed
                              ? 'bg-white text-black'
                              : step.current
                              ? 'bg-white/20 text-white border border-white'
                              : 'bg-neutral-850 text-neutral-500 border border-neutral-700'
                          }`}
                        >
                          {step.completed ? '✓' : idx + 1}
                        </div>
                        <span className="text-[10px] text-neutral-500 font-medium">{step.date}</span>
                      </div>
                      <span
                        className={`text-xs ${
                          step.completed
                            ? 'text-white font-medium'
                            : step.current
                            ? 'text-white font-semibold'
                            : 'text-neutral-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 p-2.5 rounded-xl bg-neutral-900 border border-white/10"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                        className="w-12 h-14 object-cover rounded-lg bg-neutral-950 border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-white truncate">
                          {item.name}
                        </h5>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Size {item.size} • {item.color} • Qty {item.quantity}
                        </p>
                        <p className="text-xs font-semibold text-white mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: ADDRESSES */}
      {activeAccountTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <h3 className="text-base font-semibold text-white">Delivery Locations</h3>
              <p className="text-xs text-neutral-400 font-normal">Manage saved addresses</p>
            </div>
            
            <button
              onClick={() => setIsAddingAddress(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Address</span>
            </button>
          </div>

          {isAddingAddress && (
            <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-3 animate-fadeIn">
              <h4 className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                Add Location
              </h4>
              <form onSubmit={handleAddAddressSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Label (e.g. Home, Studio)"
                    value={addressForm.title}
                    onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="ZIP"
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex space-x-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black font-semibold rounded-xl text-xs uppercase tracking-wider"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {user.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl bg-[#121216] border transition-all flex flex-col justify-between ${
                  addr.isDefault ? 'border-white/40' : 'border-white/[0.08]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white text-sm">
                      {addr.title}
                    </span>
                    {addr.isDefault ? (
                      <span className="text-[10px] bg-white/15 text-white border border-white/20 px-2 py-0.5 rounded-full font-medium uppercase">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefaultSavedAddress(addr.id)}
                        className="text-[11px] text-neutral-400 hover:text-white underline"
                      >
                        Set default
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 font-medium">{addr.fullName}</p>
                  <p className="text-xs text-neutral-400 mt-1">{addr.street}</p>
                  <p className="text-xs text-neutral-400">
                    {addr.city}, {addr.state} {addr.zip} • {addr.country}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex justify-end">
                  <button
                    onClick={() => deleteSavedAddress(addr.id)}
                    className="text-neutral-500 hover:text-rose-400 text-xs flex items-center space-x-1"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: WISHLIST */}
      {activeAccountTab === 'wishlist' && (
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Wishlist Vault</h3>
              <p className="text-xs text-neutral-400 font-normal">Saved pieces</p>
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              {wishlistedProducts.length} pieces
            </span>
          </div>

          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-[#121216] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-[#0E0E10] rounded-xl overflow-hidden mb-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                      onClick={() => navigateTo('pdp', prod)}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:text-neutral-300"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      {prod.category}
                    </span>
                    <h4
                      onClick={() => navigateTo('pdp', prod)}
                      className="text-sm font-medium text-white hover:text-neutral-300 cursor-pointer truncate mt-0.5"
                    >
                      {prod.name}
                    </h4>
                    <p className="text-xs font-semibold text-white mt-1">
                      {formatPrice(prod.price)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex space-x-2">
                    <button
                      onClick={() => moveWishlistToCart(prod.id)}
                      className="flex-1 py-2 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag size={13} />
                      <span>Move To Bag</span>
                    </button>
                    <button
                      onClick={() => navigateTo('pdp', prod)}
                      className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs"
                      title="View"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl bg-[#121216] border border-white/[0.08] p-8 space-y-4">
              <Heart size={32} className="text-neutral-600 mx-auto" />
              <h4 className="text-sm font-semibold text-white">Your wishlist is empty.</h4>
              <button
                onClick={() => navigateTo('catalog')}
                className="px-5 py-2.5 bg-white text-black font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
              >
                Browse Collection
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
