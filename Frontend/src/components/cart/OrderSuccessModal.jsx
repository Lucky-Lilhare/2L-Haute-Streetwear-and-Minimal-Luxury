import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Truck, 
  Download, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';

export const OrderSuccessModal = () => {
  const {
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    lastPlacedOrder,
    formatPrice,
    navigateTo,
    setActiveAccountTab,
    showToast,
  } = useStore();

  useEffect(() => {
    if (isOrderSuccessOpen) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#C0C0C0', '#404040'],
      });
    }
  }, [isOrderSuccessOpen]);

  if (!isOrderSuccessOpen || !lastPlacedOrder) return null;

  const handleTrackInProfile = () => {
    setIsOrderSuccessOpen(false);
    setActiveAccountTab('orders');
    navigateTo('account');
  };

  const handleContinueShopping = () => {
    setIsOrderSuccessOpen(false);
    navigateTo('catalog');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-xl bg-[#111115] border border-white/10 rounded-2xl shadow-dark-xl overflow-hidden my-auto text-center p-8 space-y-6">
        
        {/* Animated Checkmark Badge */}
        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white shadow-sm animate-fadeIn">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase">
            Order Confirmed
          </h2>
          <p className="text-xs text-neutral-400 font-medium">
            Order Reference: <strong className="text-white">#{lastPlacedOrder.id}</strong>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-xl bg-[#15151A] border border-white/[0.08] text-left space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.06] gap-2 text-xs font-medium">
            <div>
              <span className="text-neutral-500 block">Estimated Delivery:</span>
              <span className="text-white">{lastPlacedOrder.estimatedDelivery}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Courier:</span>
              <span className="text-white">{lastPlacedOrder.carrier}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Tracking:</span>
              <span className="text-white">{lastPlacedOrder.trackingNumber}</span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {lastPlacedOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-xs">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                  className="w-10 h-12 object-cover rounded-lg bg-neutral-950 border border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{item.name}</p>
                  <p className="text-neutral-400 text-[11px]">
                    {item.size} • {item.color} • Qty {item.quantity}
                  </p>
                </div>
                <span className="text-white font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold">
            <span className="text-neutral-400">Total:</span>
            <span className="text-white text-sm">
              {formatPrice(lastPlacedOrder.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleTrackInProfile}
            className="py-3 px-4 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Truck size={14} />
            <span>Track Order</span>
          </button>

          <button
            onClick={handleContinueShopping}
            className="py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/10 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer font-medium"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <button
          onClick={() => showToast(`Invoice #${lastPlacedOrder.id}.pdf generated.`, 'success')}
          className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors underline pt-1 font-medium"
        >
          <Download size={13} />
          <span>Download Invoice (PDF)</span>
        </button>

      </div>
    </div>
  );
};
