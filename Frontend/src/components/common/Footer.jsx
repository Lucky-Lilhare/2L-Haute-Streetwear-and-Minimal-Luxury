import React, { useState } from 'react';
import { 
  Mail, 
  Send,
  Lock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
);

const YoutubeIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

export const Footer = () => {
  const { 
    navigateTo, 
    navigateToSection, 
    setActivePolicyModal, 
    showToast
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed! Use code 2LFIRST for 10% off your initial order.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#08080A] border-t border-white/[0.08] text-neutral-400 font-sans mt-20">
      {/* Newsletter */}
      <div className="border-b border-white/[0.06] py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0F0F12] to-[#08080A]">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
            Join The Archive
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Receive private allocations for upcoming drops and an instant 10% privilege voucher for your first order.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email address..."
                className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <span>Subscribe</span>
              <Send size={12} />
            </button>
          </form>

          {isSubscribed && (
            <p className="text-xs text-emerald-400 pt-1 font-medium animate-fadeIn">
              ✓ Privilege active. Code: <strong className="text-white">2LFIRST</strong>
            </p>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Blurb Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">2L</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-normal">
              2L is an architectural streetwear atelier rooted in India. Guided by structural purism, raw heavyweight textiles, and progressive silhouettes designed for the contemporary street.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <a href="#instagram" onClick={(e) => { e.preventDefault(); showToast('Redirecting to @2l_studios', 'info'); }} className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white" aria-label="Instagram">
                <InstagramIcon size={16} />
              </a>
              <a href="#twitter" onClick={(e) => { e.preventDefault(); showToast('Redirecting to 2L on X', 'info'); }} className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white" aria-label="Twitter">
                <TwitterIcon size={16} />
              </a>
              <a href="#youtube" onClick={(e) => { e.preventDefault(); showToast('Redirecting to 2L on YouTube', 'info'); }} className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white" aria-label="YouTube">
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-200 mb-3 font-semibold">
              Collection
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateToSection({ category: 'all', gender: 'men' })} className="hover:text-white transition-colors">
                  Men's Atelier
                </button>
              </li>
              <li>
                <button onClick={() => navigateToSection({ category: 'all', gender: 'women' })} className="hover:text-white transition-colors">
                  Women's Collection
                </button>
              </li>
              <li>
                <button onClick={() => navigateToSection({ category: 'jeans' })} className="hover:text-white transition-colors">
                  Denim Edit (14.5oz)
                </button>
              </li>
              <li>
                <button onClick={() => navigateToSection({ category: 't-shirts' })} className="hover:text-white transition-colors">
                  Heavyweight Tees (450 GSM)
                </button>
              </li>
              <li>
                <button onClick={() => navigateToSection({ category: 'sneakers' })} className="hover:text-white transition-colors">
                  Sneakers & Runners
                </button>
              </li>
              <li>
                <button onClick={() => navigateToSection({ category: 'all', plusSizeOnly: true })} className="text-neutral-200 hover:text-white font-medium">
                  Plus Sizing (2XL – 3XL)
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge Column */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-200 mb-3 font-semibold">
              Concierge
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePolicyModal('contact')} className="hover:text-white transition-colors">
                  Contact Concierge
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('shipping')} className="hover:text-white transition-colors">
                  Shipping & Duties (DDP)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('returns')} className="hover:text-white transition-colors">
                  30-Day Returns Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('faqs')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-white transition-colors">
                  Order Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Sartorial Ethos */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-200 mb-3 font-semibold">
              Sartorial Ethos
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              Okayama shuttle looms, organic combed Egyptian cottons, and Italian calfskin tanning partners.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500 font-medium">
          <div className="flex flex-wrap items-center gap-3">
            <span>© 2026 2L ATELIER INC. ALL RIGHTS RESERVED. INDIA.</span>
            <button
              onClick={() => navigateTo('admin')}
              className="text-[11px] text-neutral-600 hover:text-amber-400 transition-colors flex items-center space-x-1 cursor-pointer"
              title="Restricted Atelier Host Control"
            >
              <Lock size={10} />
              <span>Host Atelier</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-[10px] text-neutral-400">
            <Lock size={11} className="text-emerald-400" />
            <span>256-BIT SSL ENCRYPTED CHECKOUT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
