import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { LOOKBOOK_POSTS } from '../../data/products';

const InstagramIcon = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const LookbookReel = () => {
  const { setShopLookPost } = useStore();

  return (
    <section className="py-20 bg-[#0A0A0D] border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-widest text-neutral-400 mb-2 font-medium">
              <InstagramIcon size={13} />
              <span>@2L_STUDIOS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Community Lookbook
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-normal mt-2 md:mt-0">
            Tap Any Photo To Shop The Silhouette
          </p>
        </div>

        {/* 6-Grid Editorial Instagram Reel */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {LOOKBOOK_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setShopLookPost(post)}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-sm"
            >
              <img
                src={post.image}
                alt={post.caption}
                onError={(e) => { e.currentTarget.src = '/images/hero_streetwear.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
              />

              {/* Instagram tag icon top right */}
              <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <InstagramIcon size={12} />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-left">
                <div className="flex items-center space-x-1 text-[11px] text-rose-400 mb-1 font-medium">
                  <Heart size={11} className="fill-rose-400" />
                  <span>{post.likes}</span>
                </div>
                <p className="text-xs font-semibold text-white line-clamp-1">{post.productName}</p>
                <div className="mt-2 flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-white text-black rounded-lg text-[11px] font-semibold uppercase tracking-wider">
                  <ShoppingBag size={11} />
                  <span>Shop Look</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
