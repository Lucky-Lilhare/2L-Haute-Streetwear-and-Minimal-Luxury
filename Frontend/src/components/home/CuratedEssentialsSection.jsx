import React from 'react';
import { ArrowRight, Feather } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const CuratedEssentialsSection = () => {
  const { navigateTo, navigateToSection, formatPrice } = useStore();
  const essentials = PRODUCTS.filter((p) => p.category === 't-shirts' || p.id === '2l-h01' || p.id === '2l-s01');

  return (
    <section className="py-20 bg-[#0E0E11] border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-neutral-400 mb-2 font-medium">
              Heavyweight Interlock Textiles
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Everyday Essentials
            </h2>
          </div>
          <button
            onClick={() => navigateToSection({ category: 't-shirts' })}
            className="mt-3 md:mt-0 text-xs uppercase tracking-wider text-neutral-400 hover:text-white flex items-center space-x-1 transition-colors font-medium"
          >
            <span>View All Tops</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3 Pillars Showcase Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="p-6 rounded-2xl bg-[#131316] border border-white/[0.07] space-y-2">
            <span className="text-sm font-semibold text-neutral-400">01 // 450 GSM</span>
            <h4 className="text-base font-semibold text-white">Double-Needle Ribbed Collar</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              Custom milled heavy ribbing designed to never buckle, bacon, or stretch even after dozens of aggressive washes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#131316] border border-white/[0.07] space-y-2">
            <span className="text-sm font-semibold text-neutral-400">02 // 0% Shrinkage</span>
            <h4 className="text-base font-semibold text-white">Double Enzyme Washed</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              Every yard of combed Egyptian cotton is steam-stabilized and washed prior to pattern cutting to guarantee zero shrinkage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#131316] border border-white/[0.07] space-y-2">
            <span className="text-sm font-semibold text-neutral-400">03 // Up To 3XL</span>
            <h4 className="text-base font-semibold text-white">Anatomical Boxy Silhouette</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-normal">
              Dropped shoulder angles engineered to create a clean, masculine, draped structural frame on any body type.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {essentials.map((item) => (
            <div
              key={item.id}
              onClick={() => navigateTo('pdp', item)}
              className="group bg-[#131316] border border-white/[0.07] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-subtle"
            >
              <div className="relative aspect-[3/4] bg-[#0E0E10] overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  onError={(e) => { e.currentTarget.src = '/images/heavyweight_boxy_tee.jpg'; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-neutral-200 uppercase font-medium border border-white/10">
                  {item.subCategory}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-white group-hover:text-neutral-300 transition-colors text-sm line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1 font-normal">{item.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {item.sizes.length} Sizes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
