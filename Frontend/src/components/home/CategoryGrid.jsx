import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryGrid = () => {
  const { navigateToSection } = useStore();

  const categories = [
    {
      id: 'men',
      name: "Men's Atelier",
      subtitle: 'Boxy Drapes & Heavy Cottons',
      itemsCount: '34 Pieces',
      image: '/images/heavyweight_boxy_tee.jpg',
      action: () => navigateToSection({ category: 'all', gender: 'men' }),
      colSpan: 'md:col-span-2 md:row-span-2',
      badge: 'Drop 07'
    },
    {
      id: 'women',
      name: "Women's Collection",
      subtitle: 'Fluid Cuts & Tailored Outerwear',
      itemsCount: '28 Pieces',
      image: '/images/hero_streetwear.jpg',
      action: () => navigateToSection({ category: 'all', gender: 'women' }),
      colSpan: 'md:col-span-1 md:row-span-1',
      badge: null
    },
    {
      id: 'sneakers',
      name: 'Footwear & Runners',
      subtitle: 'Architectural Sculpted Lug Soles',
      itemsCount: '12 Silhouettes',
      image: '/images/chunky_runner.jpg',
      action: () => navigateToSection({ category: 'sneakers' }),
      colSpan: 'md:col-span-1 md:row-span-1',
      badge: 'Limited'
    },
    {
      id: 'jeans',
      name: 'Denim Laboratory',
      subtitle: '14.5oz Japanese Kurabo Selvedge',
      itemsCount: '18 Washes',
      image: '/images/raw_baggy_denim.jpg',
      action: () => navigateToSection({ category: 'jeans' }),
      colSpan: 'md:col-span-2 md:row-span-1',
      badge: 'Core Archive'
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-neutral-400 mb-2 font-medium">
            Curated Categories
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Featured Categories
          </h2>
        </div>
        <p className="text-xs text-neutral-400 font-normal mt-2 md:mt-0">
          Select Direct Category Gateway
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={cat.action}
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-500 cursor-pointer min-h-[300px] sm:min-h-[360px] bg-[#121215] ${cat.colSpan}`}
          >
            {/* Background image with hover zoom */}
            <div className="absolute inset-0 z-0">
              <img
                src={cat.image}
                alt={cat.name}
                onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-85 group-hover:brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            </div>

            {/* Top Badge */}
            {cat.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {cat.badge}
                </span>
              </div>
            )}

            {/* Hover arrow button */}
            <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:rotate-45 transition-all duration-300">
              <ArrowUpRight size={15} />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 space-y-1">
              <span className="text-[11px] text-neutral-400 tracking-wider uppercase font-medium">
                {cat.itemsCount}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-neutral-200 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-neutral-300 font-normal line-clamp-1">
                {cat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
