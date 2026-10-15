import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  Lock, 
  MapPin, 
  QrCode, 
  Banknote, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartGrandTotal,
    cartSubtotal,
    discountAmount,
    appliedPromo,
    formatPrice,
    user,
    placeOrder,
    showToast,
  } = useStore();

  const [currentStep, setCurrentStep] = useState(1);
  
  const defaultAddr = user.savedAddresses.find((a) => a.isDefault) || user.savedAddresses[0] || {
    fullName: user.name,
    street: '482 Broome Street, Apt 5B',
    city: 'New York',
    state: 'NY',
    zip: '10013',
    country: 'United States',
    phone: user.phone,
  };

  const [shippingForm, setShippingForm] = useState({
    fullName: defaultAddr.fullName,
    street: defaultAddr.street,
    city: defaultAddr.city,
    state: defaultAddr.state,
    zip: defaultAddr.zip,
    country: defaultAddr.country,
    phone: defaultAddr.phone,
  });

  const [shippingMethod, setShippingMethod] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [cardForm, setCardForm] = useState({
    number: '•••• •••• •••• 8842',
    name: user.name,
    expiry: '10/29',
    cvv: '891',
  });

  const [upiId, setUpiId] = useState('adrian.vance@okhdfcbank');

  if (!isCheckoutOpen) return null;

  const handleSelectSavedAddress = (addr) => {
    setShippingForm({
      fullName: addr.fullName,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      phone: addr.phone,
    });
    showToast(`Selected saved address: ${addr.title}`, 'info');
  };

  const handleCompleteOrder = () => {
    placeOrder({
      address: shippingForm,
      shippingMethod,
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#111115] border border-white/10 rounded-2xl shadow-dark-xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Checkout Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#141418] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-xl text-white tracking-tight">2L</span>
            <span className="text-neutral-500">|</span>
            <span className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              Encrypted Checkout
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium">
              <span className={`px-2 py-0.5 rounded-full ${currentStep >= 1 ? 'bg-white text-black font-semibold' : 'bg-neutral-800 text-neutral-400'}`}>1. Shipping</span>
              <span className="text-neutral-600">→</span>
              <span className={`px-2 py-0.5 rounded-full ${currentStep >= 2 ? 'bg-white text-black font-semibold' : 'bg-neutral-800 text-neutral-400'}`}>2. Delivery</span>
              <span className="text-neutral-600">→</span>
              <span className={`px-2 py-0.5 rounded-full ${currentStep >= 3 ? 'bg-white text-black font-semibold' : 'bg-neutral-800 text-neutral-400'}`}>3. Payment</span>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
          
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            
            {/* STEP 1: SHIPPING ADDRESS */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                    <MapPin size={17} className="text-white" />
                    <span>Shipping Destination</span>
                  </h3>
                  <span className="text-xs text-neutral-400 font-medium">Step 1 of 3</span>
                </div>

                {user.savedAddresses.length > 0 && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                      Saved Residences:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {user.savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSavedAddress(addr)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            shippingForm.street === addr.street
                              ? 'border-white bg-white/10 text-white font-medium'
                              : 'border-white/10 bg-neutral-900 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <p className="text-xs font-semibold text-white truncate">{addr.title}</p>
                          <p className="text-[11px] text-neutral-400 truncate">{addr.street}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                      Street Address & Apt / Unit
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.street}
                      onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingForm.zip}
                        onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>Delivery Speed</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING SPEED */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                    <Truck size={17} className="text-white" />
                    <span>Select Dispatch Speed</span>
                  </h3>
                  <span className="text-xs text-neutral-400 font-medium">Step 2 of 3</span>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      shippingMethod === 'standard'
                        ? 'border-white bg-white/10 text-white font-medium'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-white">Standard Courier</p>
                      <p className="text-xs text-neutral-400 mt-0.5 font-normal">Estimated 4-6 business days</p>
                    </div>
                    <span className="text-sm font-semibold text-white">Free</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      shippingMethod === 'express'
                        ? 'border-white bg-white/10 text-white font-medium'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-sm text-white">Bluedart Priority Air (Express)</p>
                        <span className="text-[10px] bg-white/15 text-white px-2 py-0.2 rounded-full uppercase font-medium">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 font-normal">Estimated 1-2 business days with SMS live tracking</p>
                    </div>
                    <span className="text-sm font-semibold text-white">Free Over ₹999</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('overnight')}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      shippingMethod === 'overnight'
                        ? 'border-white bg-white/10 text-white font-medium'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-white">VIP Priority Same-Day Dispatch</p>
                      <p className="text-xs text-neutral-400 mt-0.5 font-normal">Next business flight morning dispatch</p>
                    </div>
                    <span className="text-sm font-semibold text-white">{formatPrice(99)}</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white font-medium"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>Payment Method</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                    <Lock size={17} className="text-white" />
                    <span>Payment Method</span>
                  </h3>
                  <span className="text-xs text-neutral-400 font-medium">Step 3 of 3</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <CreditCard size={16} className="mx-auto mb-1 text-white" />
                    <span className="text-xs font-medium">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <QrCode size={16} className="mx-auto mb-1 text-white" />
                    <span className="text-xs font-medium">UPI / Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <Banknote size={16} className="mx-auto mb-1 text-white" />
                    <span className="text-xs font-medium">COD</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A1A20] to-[#101014] border border-white/15 text-neutral-100 space-y-3 font-medium">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400 uppercase tracking-wider">2L Obsidian</span>
                        <span className="font-semibold text-white">VISA</span>
                      </div>
                      <div className="text-base tracking-wider py-1 font-semibold">
                        {cardForm.number}
                      </div>
                      <div className="flex justify-between text-xs text-neutral-400">
                        <span>{cardForm.name}</span>
                        <span>{cardForm.expiry}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardForm.number}
                          onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                            MM / YY
                          </label>
                          <input
                            type="text"
                            value={cardForm.expiry}
                            onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1 font-medium">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardForm.cvv}
                            onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-3 p-4 rounded-xl bg-neutral-900 border border-white/10">
                    <p className="text-xs text-neutral-300">
                      Scan QR with payment app or enter your UPI ID:
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                        <QrCode size={56} className="text-black" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-neutral-800 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-1">
                    <p className="text-xs font-semibold text-white">Cash on Delivery</p>
                    <p className="text-xs text-neutral-400">
                      Pay cash to the courier representative upon delivery. Exact amount: {formatPrice(cartGrandTotal)}.
                    </p>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white font-medium"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleCompleteOrder}
                    className="px-7 py-3 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    Place Order ({formatPrice(cartGrandTotal)})
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#131317] flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-4">
                Order Summary ({cart.length})
              </h4>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                      className="w-12 h-14 object-cover rounded-lg bg-neutral-950 border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-neutral-400 font-medium">
                        {item.size} • {item.color} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-white font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-2 text-xs text-neutral-400 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(cartSubtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/[0.08]">
                  <span>Total</span>
                  <span>{formatPrice(cartGrandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
