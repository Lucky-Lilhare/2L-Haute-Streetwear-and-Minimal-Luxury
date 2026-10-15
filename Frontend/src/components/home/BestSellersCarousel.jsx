import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const BestSellersCarousel = () => {
  const { navigateTo, addToCart, wishlist, toggleWishlist, formatPrice } = useStore();
  const carouselRef = useRef(null);

  const bestSellers = PRODUCTS.filter((p) => p.isBestseller);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 border-t border-b border-white/[0.07] bg-[#0E0E11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Carousel Arrows */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-neutral-400 mb-2 font-medium">
              Curated Releases
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Best Sellers
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors"
              aria-label="Previous Products"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors"
              aria-label="Next Products"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto pb-6 scroll-smooth hide-scrollbar snap-x snap-mandatory"
        >
          {bestSellers.map((product) => {
            const isFav = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start group relative bg-[#131316] border border-white/[0.07] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-subtle"
              >
                {/* Image Container with Wishlist Toggle */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0C]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                    onClick={() => navigateTo('pdp', product)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    <span className="bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Bestseller
                    </span>
                    {product.hasPlusSize && (
                      <span className="bg-neutral-900/90 backdrop-blur-md border border-white/20 text-neutral-200 text-[10px] font-medium px-2.5 py-0.5 rounded-full tracking-wider">
                        XS – 3XL
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-white transition-transform duration-200 active:scale-95"
                    aria-label="Wishlist piece"
                  >
                    <Heart
                      size={16}
                      className={isFav ? 'text-white fill-white' : 'text-neutral-300'}
                    />
                  </button>

                  {/* Hover Quick Add Drawer */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigateTo('pdp', product)}
                      className="flex-1 py-2 text-center text-xs font-medium uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-colors"
                    >
                      View Piece
                    </button>
                    <button
                      onClick={() => addToCart(product, product.sizes[0], product.colors[0], 1, true)}
                      className="p-2 bg-white hover:bg-neutral-200 text-black rounded-lg transition-colors"
                      title="Quick Add Default Size"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 font-medium">
                      <span className="uppercase tracking-widest text-[10px] text-neutral-400">
                        {product.category}
                      </span>
                      <div className="flex items-center space-x-1 text-neutral-300">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => navigateTo('pdp', product)}
                      className="font-medium text-sm sm:text-base text-white hover:text-neutral-300 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-1 font-normal">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Price & Size tags */}
                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Quick sizes preview */}
                    <div className="flex items-center space-x-1">
                      {product.sizes.slice(0, 3).map((sz) => (
                        <span key={sz} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-white/10 text-neutral-300 font-medium">
                          {sz}
                        </span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-[10px] text-neutral-500 font-medium">
                          +{product.sizes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
