import React from 'react';

export const Marquee = () => {
  const announcements = [
    'DROP 07: MONOLITHIC MINIMAL LIVE NOW',
    'FREE EXPRESS DELIVERY ACROSS INDIA OVER ₹999',
    "10% PRIVILEGE CODE: '2LFIRST'",
    'JAPANESE 14.5 OZ RAW SELVEDGE & 450 GSM COMBED COTTON',
    'INCLUSIVE STREETWEAR TAILORING — EXTENDED SIZES UP TO 3XL',
  ];

  return (
    <div className="relative bg-[#08080A] border-b border-white/[0.08] text-xs py-2 overflow-hidden select-none z-30 font-medium">
      <div className="flex w-max animate-marquee space-x-12 hover:[animation-play-state:paused] cursor-pointer">
        {[...announcements, ...announcements].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-3 text-neutral-400 tracking-wider text-[11px] uppercase">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
            <span className="hover:text-white transition-colors duration-150">{text}</span>
            <span className="text-neutral-600">/</span>
          </div>
        ))}
      </div>
    </div>
  );
};
