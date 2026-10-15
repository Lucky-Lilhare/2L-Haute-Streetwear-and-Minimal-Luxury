import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartItemsCount,
    cartSubtotal,
    cartGrandTotal,
    discountAmount,
    standardShippingCost,
    estimatedTax,
    freeShippingThreshold,
    isEligibleFreeShipping,
    updateCartQuantity,
    removeFromCart,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    formatPrice,
    setIsCheckoutOpen,
    navigateTo,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101013] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between animate-slideInRight">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#131317]">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag size={18} className="text-white" />
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                Archive Bag ({cartItemsCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Tier Progress Bar */}
          <div className="px-6 py-3.5 bg-[#15151A] border-b border-white/[0.06]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-neutral-300">
                {isEligibleFreeShipping
                  ? 'Complimentary Express Delivery Unlocked'
                  : `Add ${formatPrice(remainingForFreeShip)} for Free Express Delivery`}
              </span>
              <span className="text-white font-semibold">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/[0.06]">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="py-4 flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                    className="w-18 h-22 object-cover rounded-xl bg-neutral-950 border border-white/10 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-neutral-500 hover:text-white p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-neutral-400 mt-1 font-medium">
                        <span className="bg-neutral-800/80 px-2 py-0.5 rounded text-neutral-300">
                          {item.size}
                        </span>
                        <span>•</span>
                        <span>{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-neutral-900 border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag size={38} className="text-neutral-600 mx-auto" />
                <h4 className="text-base font-semibold text-white">Your bag is empty.</h4>
                <p className="text-xs text-neutral-400">
                  Explore raw denim, heavyweight tees, and footwear to build your wardrobe.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('catalog');
                  }}
                  className="px-6 py-2.5 bg-white text-black font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  Explore Drops
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#131317] border-t border-white/[0.08] space-y-4">
              
              {/* Promo Code Input */}
              {appliedPromo.code ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs font-medium">
                  <div className="flex items-center space-x-2 text-white">
                    <Tag size={13} />
                    <span>CODE: <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercent}% OFF)</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-neutral-400 hover:text-white p-1"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Archive Code: Try '2LFIRST'"
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Cost Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 font-medium">
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
                  <span>Express Dispatch</span>
                  <span className={isEligibleFreeShipping ? 'text-emerald-400' : 'text-white'}>
                    {isEligibleFreeShipping ? 'Free' : formatPrice(standardShippingCost)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated GST (12%)</span>
                  <span className="text-white">{formatPrice(estimatedTax)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.08]">
                  <span>Total</span>
                  <span>{formatPrice(cartGrandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-neutral-400 text-center">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Encrypted Atelier Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
