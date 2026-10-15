import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Check, 
  Layers, 
  Truck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const HeroBanner = () => {
  const { navigateTo, navigateToSection, addToCart, formatPrice } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentProduct = PRODUCTS[currentIndex] || PRODUCTS[0];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  }, []);

  // Auto-advance slides every 4.5 seconds when not paused by hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleDirectBuy = (product) => {
    addToCart(product, product.sizes[0], product.colors[0], 1, false);
    navigateTo('pdp', product);
  };

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0], 1, true);
  };

  // Discount percentage calculation
  const discountPercent = currentProduct.originalPrice
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="relative bg-[#08080A] text-white overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. INTERACTIVE PRODUCT HERO SLIDER (ALL PROJECT PRODUCTS)     */}
      {/* ============================================================ */}
      <section 
        className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center border-b border-white/[0.08] select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Editorial Atmospheric Background Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neutral-800/[0.15] rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-[#08080A]/60" />
        </div>

        {/* Main Slide Stage */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Product Information, Price & CTAs */}
            <div className="lg:col-span-6 space-y-5 text-left order-2 lg:order-1">
              
              {/* Top Meta Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold uppercase tracking-wider text-white">
                  <Flame size={12} className="text-amber-400 fill-amber-400" />
                  <span>Piece {String(currentIndex + 1).padStart(2, '0')} of {String(PRODUCTS.length).padStart(2, '0')}</span>
                </span>

                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-900 border border-white/10 text-[10px] uppercase tracking-wider text-neutral-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1" />
                  {currentProduct.category}
                </span>

                {currentProduct.hasPlusSize && (
                  <span className="px-2.5 py-1 rounded-full bg-neutral-900 border border-white/10 text-[10px] uppercase tracking-wider text-neutral-300 font-medium">
                    XS – 3XL
                  </span>
                )}
              </div>

              {/* Product Headline */}
              <div>
                <h2 
                  onClick={() => navigateTo('pdp', currentProduct)}
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-[1.08] hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  {currentProduct.name}
                </h2>
                
                <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg font-normal">
                  {currentProduct.tagline}
                </p>
              </div>

              {/* Price Display with Indian Rupee formatting and Discount Tag */}
              <div className="pt-2 flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {formatPrice(currentProduct.price)}
                </span>
                
                {currentProduct.originalPrice && (
                  <>
                    <span className="text-sm sm:text-base text-neutral-500 line-through font-medium">
                      {formatPrice(currentProduct.originalPrice)}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Available Sizes Pills Preview */}
              <div className="pt-1">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1.5 font-medium">
                  Available Atelier Sizes:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {currentProduct.sizes.map((sz) => (
                    <span
                      key={sz}
                      className="px-2 py-0.5 rounded-md bg-neutral-900/90 border border-white/10 text-[11px] text-neutral-300 font-medium"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigateTo('pdp', currentProduct)}
                  className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-full text-xs uppercase tracking-wider transition-all duration-200 flex items-center space-x-2 group cursor-pointer shadow-lg"
                >
                  <span>View Piece</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={(e) => handleQuickAdd(currentProduct, e)}
                  className="px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/15 hover:border-white/30 rounded-full text-xs uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer font-medium"
                >
                  <ShoppingBag size={14} />
                  <span>Add To Bag</span>
                </button>

                <button
                  onClick={() => navigateTo('catalog')}
                  className="px-4 py-3.5 text-neutral-400 hover:text-white text-xs uppercase tracking-wider transition-colors font-medium cursor-pointer"
                >
                  All Pieces ({PRODUCTS.length}) →
                </button>
              </div>

            </div>

            {/* Right Column: Hero Visual with Clean Architectural Framing */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div 
                onClick={() => navigateTo('pdp', currentProduct)}
                className="group relative w-full max-w-md sm:max-w-lg aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Product Image */}
                <img
                  key={currentProduct.id}
                  src={currentProduct.images[0]}
                  alt={currentProduct.name}
                  onError={(e) => { e.currentTarget.src = '/images/hero_streetwear.jpg'; }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Top Corner Badge: Made for India */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-wider font-semibold text-white">
                  2L Atelier // India
                </div>

                {/* Bottom Overlay Info on Card */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-white text-xs font-bold truncate">{currentProduct.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{currentProduct.fabric}</p>
                  </div>
                  <span className="text-sm font-bold text-white shrink-0">
                    {formatPrice(currentProduct.price)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Previous Slide Arrow Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-white text-neutral-300 hover:text-black border border-white/15 hover:border-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Slide Arrow Button */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-white text-neutral-300 hover:text-black border border-white/15 hover:border-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-md shadow-lg"
        >
          <ChevronRight size={20} />
        </button>

      </section>

      {/* ============================================================ */}
      {/* 2. SLIDER THUMBNAIL NAVIGATOR STRIP (ALL 15 PRODUCTS)         */}
      {/* ============================================================ */}
      <div className="bg-[#0B0B0E] border-b border-white/[0.08] py-3.5 px-4 overflow-x-auto hide-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 sm:space-x-3 w-max">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold px-2 shrink-0">
            Slide Index ({PRODUCTS.length}):
          </span>

          {PRODUCTS.map((prod, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={prod.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold border-white shadow-md'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  onError={(e) => { e.currentTarget.src = '/images/hero_streetwear.jpg'; }}
                  className="w-5 h-5 rounded-md object-cover shrink-0"
                />
                <span className="truncate max-w-[120px]">{prod.name}</span>
                <span className={`text-[10px] ${isActive ? 'text-black/80' : 'text-neutral-500'}`}>
                  {formatPrice(prod.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. ADJUSTED BRAND ETHOS & SPECIFICATIONS STRIP (SCREENSHOT 2) */}
      {/* ============================================================ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B0B0E] to-[#070709]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Manifesto */}
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] uppercase tracking-widest text-neutral-300 font-semibold">
              <Sparkles size={11} className="text-amber-400" />
              <span>Architectural Streetwear Atelier</span>
              <span className="text-neutral-500">•</span>
              <span className="text-white">India</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
              Material Precision & Street Purity
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
              Heavyweight Japanese raw denim, 450 GSM combed cottons, and minimal tailored silhouettes. Designed to outlast transient fashion cycles across India.
            </p>
          </div>

          {/* 4 Feature Spec Pillar Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-white/[0.08] hover:border-white/20 transition-all text-center space-y-1.5">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                450 GSM
              </p>
              <p className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                Combed Cotton
              </p>
              <p className="text-[11px] text-neutral-500 font-normal">
                Dense interlocking knit that maintains structured boxy drape wash after wash.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-white/[0.08] hover:border-white/20 transition-all text-center space-y-1.5">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                14.5 OZ
              </p>
              <p className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                Raw Selvedge
              </p>
              <p className="text-[11px] text-neutral-500 font-normal">
                Traditional shuttle-loom Kurabo weave tailored with architectural crease lines.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-white/[0.08] hover:border-white/20 transition-all text-center space-y-1.5">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                XS – 3XL
              </p>
              <p className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                Extended Sizing
              </p>
              <p className="text-[11px] text-neutral-500 font-normal">
                Proportionally re-patterned blocks ensuring high-fashion oversized runway drape.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-white/[0.08] hover:border-white/20 transition-all text-center space-y-1.5">
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
                PAN-INDIA
              </p>
              <p className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                Fast Express Dispatch
              </p>
              <p className="text-[11px] text-neutral-500 font-normal">
                Complimentary Bluedart air transit across Indian PIN codes on orders over ₹999.
              </p>
            </div>

          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('catalog')}
              className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Explore Full Collection
            </button>

            <button
              onClick={() => navigateToSection({ category: 'all', plusSizeOnly: true })}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/15 rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer font-medium"
            >
              Plus Size Edit (Up to 3XL)
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
