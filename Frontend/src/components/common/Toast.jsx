import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Toast = () => {
  const { toasts, removeToast } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />;
        let borderClass = 'border-emerald-500/30';
        
        if (toast.type === 'error') {
          icon = <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />;
          borderClass = 'border-rose-500/40';
        } else if (toast.type === 'info') {
          icon = <Info size={18} className="text-brand-accent shrink-0 mt-0.5" />;
          borderClass = 'border-brand-accent/40';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-xl bg-[#141418] border ${borderClass} shadow-2xl backdrop-blur-md animate-fadeIn transition-all`}
          >
            <div className="flex items-start space-x-3">
              {icon}
              <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-500 hover:text-neutral-300 ml-2 p-1"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
