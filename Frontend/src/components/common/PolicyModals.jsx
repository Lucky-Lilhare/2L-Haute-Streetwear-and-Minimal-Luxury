import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, HelpCircle, Truck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PolicyModals = () => {
  const { activePolicyModal, setActivePolicyModal, showToast } = useStore();
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'Order Inquiry', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!activePolicyModal) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('Your message has been transmitted to the 2L Client Concierge.', 'success');
    setTimeout(() => {
      setIsSubmitted(false);
      setActivePolicyModal(null);
      setContactForm({ name: '', email: '', subject: 'Order Inquiry', message: '' });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#121217] border border-brand-border rounded-2xl shadow-dark-xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/70 bg-[#17171E]">
          <div className="flex items-center space-x-2.5">
            {activePolicyModal === 'contact' && <Mail size={18} className="text-brand-accent" />}
            {activePolicyModal === 'shipping' && <Truck size={18} className="text-brand-accent" />}
            {activePolicyModal === 'returns' && <RefreshCw size={18} className="text-brand-accent" />}
            {activePolicyModal === 'faqs' && <HelpCircle size={18} className="text-brand-accent" />}
            
            <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              {activePolicyModal === 'contact' && 'Client Concierge & Atelier Contact'}
              {activePolicyModal === 'shipping' && 'Global Express Shipping & Duties'}
              {activePolicyModal === 'returns' && 'Complimentary Returns & Exchange Policy'}
              {activePolicyModal === 'faqs' && 'Frequently Asked Questions (FAQ)'}
            </h3>
          </div>
          <button
            onClick={() => setActivePolicyModal(null)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-4">
          
          {/* CONTACT FORM */}
          {activePolicyModal === 'contact' && (
            <div>
              {isSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 size={42} className="text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-display font-bold text-white">Message Transmitted</h4>
                  <p className="text-neutral-400 max-w-md mx-auto">
                    A dedicated 2L Client Advisor will review your inquiry and reply within 12 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Adrian Vance"
                        className="w-full bg-neutral-900 border border-brand-border rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full bg-neutral-900 border border-brand-border rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-neutral-900 border border-brand-border rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-accent font-sans"
                    >
                      <option value="Order Inquiry">Order Inquiry & Tracking</option>
                      <option value="Size Consultation">Sizing Consultation & Fit Advice</option>
                      <option value="Drop Reservation">Drop 08 Reservation & VIP Noir Access</option>
                      <option value="Press / Wholesale">Press, Editorial & Wholesale Relations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Specify order number or piece details..."
                      className="w-full bg-neutral-900 border border-brand-border rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] font-mono text-neutral-500">
                      Direct Atelier Line: +1 (800) 2L-HAUTE
                    </div>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-5 py-2.5 bg-brand-accent hover:bg-white text-black font-semibold rounded-xl transition-colors font-mono text-xs uppercase tracking-wider"
                    >
                      <span>Transmit Message</span>
                      <Send size={13} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SHIPPING POLICY */}
          {activePolicyModal === 'shipping' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-brand-accent/10 border border-brand-accent/30 rounded-xl">
                <p className="font-semibold text-brand-accent text-xs uppercase tracking-wider font-mono">
                  ✦ Complimentary Express Shipping Across India Over ₹999
                </p>
                <p className="text-neutral-300 text-xs mt-1">
                  Orders exceeding ₹999 automatically qualify for carbon-neutral express courier transit via Bluedart Priority Air.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white font-mono uppercase text-xs tracking-wider">Transit Timelines:</h4>
                <ul className="list-disc list-inside space-y-1.5 mt-2 text-neutral-400 text-xs">
                  <li><strong>Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad):</strong> 1-2 Business Days via Bluedart Air.</li>
                  <li><strong>Rest of India:</strong> 2-4 Business Days via Delhivery Express.</li>
                  <li><strong>Global Destinations:</strong> 3-5 Business Days via DHL Express Air.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white font-mono uppercase text-xs tracking-wider">All-Inclusive Indian Pricing:</h4>
                <p className="text-neutral-400 text-xs mt-1">
                  All domestic prices shown in Indian Rupees (₹) include applicable GST. International orders are handled DDP (Delivered Duty Paid) with zero unexpected courier customs or clearance fees at your doorstep.
                </p>
              </div>
            </div>
          )}

          {/* RETURNS & EXCHANGES */}
          {activePolicyModal === 'returns' && (
            <div className="space-y-4">
              <p>
                At 2L, every piece is tailored with exacting standards. We want you to be completely satisfied with the drape and construction of your garment.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-neutral-900 border border-brand-border rounded-xl">
                  <h5 className="font-mono text-white text-xs uppercase font-bold">30-Day Window</h5>
                  <p className="text-neutral-400 text-xs mt-1">Initiate returns or size exchanges within 30 days of receiving your drop.</p>
                </div>
                <div className="p-3 bg-neutral-900 border border-brand-border rounded-xl">
                  <h5 className="font-mono text-white text-xs uppercase font-bold">Complimentary Return Label</h5>
                  <p className="text-neutral-400 text-xs mt-1">Pre-paid DHL return label included in every luxury packaging box.</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white font-mono uppercase text-xs tracking-wider">Return Conditions:</h4>
                <ul className="list-disc list-inside space-y-1 text-neutral-400 text-xs mt-2">
                  <li>Garments must remain unworn, unwashed, and free of fragrance.</li>
                  <li>Original 2L archive safety seal and hangtags must be intact.</li>
                  <li>Footwear must include the original protective shoe box and dust bags.</li>
                </ul>
              </div>
            </div>
          )}

          {/* FAQS */}
          {activePolicyModal === 'faqs' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-neutral-900 border border-brand-border rounded-xl">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Q: What does the "2L" designation represent?</h5>
                <p className="text-neutral-400 text-xs mt-1">
                  "2L" stands for "Dual Lineage" — our foundational ethos bridging the architectural minimalism of French haute couture with the meticulous, heavyweight textile craft of Japanese street culture.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-900 border border-brand-border rounded-xl">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Q: How do your extended plus sizes (2XL and 3XL) fit?</h5>
                <p className="text-neutral-400 text-xs mt-1">
                  Unlike brands that simply scale up length, our 2XL and 3XL garments are individually re-patterned with broader shoulder blocks, generous chest circumferences, and proportional drape lengths so the aesthetic remains true to the high-fashion oversized runway look.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-900 border border-brand-border rounded-xl">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Q: Are drops limited in quantity?</h5>
                <p className="text-neutral-400 text-xs mt-1">
                  Yes. Each drop is numbered and produced in controlled micro-batches to eliminate textile overproduction. Once an archive release sells out, it rarely restocks in the exact same wash.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-900 border border-brand-border rounded-xl">
                <h5 className="font-semibold text-white text-xs uppercase font-mono">Q: Can I wash raw selvedge denim?</h5>
                <p className="text-neutral-400 text-xs mt-1">
                  For the highest contrast natural fading, we recommend wearing your raw selvedge denim unwashed for at least 3-6 months. When needed, soak in cold water inside-out and line dry in the shade.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#17171E] border-t border-brand-border/70 flex justify-end">
          <button
            onClick={() => setActivePolicyModal(null)}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-mono uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
