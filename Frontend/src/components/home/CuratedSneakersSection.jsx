import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const CuratedSneakersSection = () => {
  const { navigateTo, navigateToSection, formatPrice } = useStore();
  const sneakerProducts = PRODUCTS.filter((p) => p.category === 'sneakers');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-neutral-400 mb-2 font-medium">
            Footwear Laboratory
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Footwear & Runners
          </h2>
        </div>
        <button
          onClick={() => navigateToSection({ category: 'sneakers' })}
          className="mt-3 md:mt-0 text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center space-x-1 transition-colors font-medium"
        >
          <span>View All Footwear</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sneakerProducts.map((sneaker) => (
          <div
            key={sneaker.id}
            onClick={() => navigateTo('pdp', sneaker)}
            className="group relative bg-[#131316] border border-white/[0.07] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-subtle"
          >
            {/* Sneaker Photography */}
            <div className="relative aspect-[4/3] bg-[#0E0E10] overflow-hidden flex items-center justify-center p-6">
              <img
                src={sneaker.images[0]}
                alt={sneaker.name}
                onError={(e) => { e.currentTarget.src = '/images/chunky_runner.jpg'; }}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-neutral-200 uppercase tracking-wider font-medium border border-white/10">
                {sneaker.subCategory}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 space-y-2.5 bg-[#141418]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">
                  Drop S07
                </span>
                <span className="text-sm font-semibold text-white">
                  {formatPrice(sneaker.price)}
                </span>
              </div>

              <h3 className="font-medium text-base text-white group-hover:text-neutral-200 transition-colors line-clamp-1">
                {sneaker.name}
              </h3>
              <p className="text-xs text-neutral-400 font-normal line-clamp-2">
                {sneaker.tagline}
              </p>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">US 7 – 13</span>
                <span className="text-neutral-300 group-hover:text-white transition-colors flex items-center space-x-1 font-medium">
                  <span>Explore Silhouette</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
