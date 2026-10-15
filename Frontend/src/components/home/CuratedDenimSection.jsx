import React from 'react';
import { ArrowRight, Ruler } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const CuratedDenimSection = () => {
  const { navigateTo, navigateToSection, setIsSizeGuideOpen, formatPrice } = useStore();
  const denimProducts = PRODUCTS.filter((p) => p.category === 'jeans');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Editorial Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#121216] p-8 md:p-12 mb-10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs uppercase tracking-wider font-medium">
            <span>Kurabo Shuttle Loom Archives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase leading-tight">
            The Denim Edit
          </h2>
          <p className="text-neutral-300 text-sm font-normal leading-relaxed">
            Woven in Okayama, Japan on vintage shuttle looms from 14.5oz ring-spun raw cotton. Engineered with dramatic baggy architecture, functional 3D tactical cargo compartments, and straight leg cuts tailored from size 28 up to 3XL.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigateToSection({ category: 'jeans' })}
              className="px-5 py-2.5 bg-white text-black font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center space-x-2"
            >
              <span>Explore Denim Fits</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="px-4 py-2.5 bg-neutral-900 border border-white/15 text-neutral-300 hover:text-white rounded-full text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 font-medium"
            >
              <Ruler size={13} />
              <span>Size Guide</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative typography watermark */}
        <div className="absolute right-4 bottom-2 text-[80px] sm:text-[120px] font-bold text-white/[0.03] select-none pointer-events-none leading-none">
          14.5OZ
        </div>
      </div>

      {/* Grid of Curated Denim Pieces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {denimProducts.map((denim) => (
          <div
            key={denim.id}
            onClick={() => navigateTo('pdp', denim)}
            className="group bg-[#131316] border border-white/[0.07] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-subtle"
          >
            <div className="relative aspect-[4/5] bg-[#0E0E10] overflow-hidden">
              <img
                src={denim.images[0]}
                alt={denim.name}
                onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-neutral-200 uppercase font-medium border border-white/10">
                {denim.subCategory} Fit
              </div>
              {denim.hasPlusSize && (
                <div className="absolute bottom-3 left-3 bg-neutral-900/90 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-[9px] text-neutral-200 uppercase font-medium">
                  Up to 3XL
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-medium text-white group-hover:text-neutral-300 transition-colors text-sm line-clamp-1">
                  {denim.name}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-1 font-normal">{denim.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {formatPrice(denim.price)}
                </span>
                <span className="text-xs text-neutral-400 group-hover:text-white transition-colors flex items-center space-x-1 font-medium">
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
