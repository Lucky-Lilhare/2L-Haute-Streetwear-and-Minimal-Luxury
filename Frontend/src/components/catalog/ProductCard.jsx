import React, { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ProductCard = ({ product }) => {
  const { navigateTo, addToCart, wishlist, toggleWishlist, formatPrice } = useStore();
  const [selectedQuickSize, setSelectedQuickSize] = useState(product.sizes[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.images[0] || '/images/raw_baggy_denim.jpg');

  const isFav = wishlist.includes(product.id);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, selectedQuickSize, product.colors[0], 1, true);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#131316] border border-white/[0.07] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-subtle"
    >
      {/* Product Image Container */}
      <div 
        onClick={() => navigateTo('pdp', product)}
        className="relative aspect-[3/4] bg-[#0E0E10] overflow-hidden cursor-pointer"
      >
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc('/images/raw_baggy_denim.jpg')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-black text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              New Drop
            </span>
          )}
          {product.hasPlusSize && (
            <span className="bg-neutral-900/90 backdrop-blur-md border border-white/20 text-neutral-200 text-[10px] font-medium px-2.5 py-0.5 rounded-full tracking-wider">
              XS – 3XL
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Wishlist piece"
        >
          <Heart
            size={16}
            className={isFav ? 'text-white fill-white' : 'text-neutral-300'}
          />
        </button>

        {/* Interactive Quick-Add Drawer on Hover */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black via-black/90 to-transparent transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between font-medium">
            <span>Size:</span>
            <span className="text-white font-semibold">{selectedQuickSize}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2.5">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedQuickSize(sz)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  selectedQuickSize === sz
                    ? 'bg-white text-black font-semibold'
                    : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-white/10'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('pdp', product)}
              className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/15 font-medium rounded-xl text-xs uppercase tracking-wider transition-colors text-center"
            >
              View Piece
            </button>
            <button
              onClick={handleQuickAdd}
              className="px-3.5 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs transition-colors"
              title="Add to bag"
            >
              <ShoppingBag size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5 font-medium">
            <span className="uppercase tracking-widest text-[10px] text-neutral-400">
              {product.category}
            </span>
            <div className="flex items-center space-x-1 text-neutral-300">
              <Star size={12} className="text-amber-400 fill-amber-400" />
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

        {/* Price & Sizes preview */}
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

          {/* Clean sizes preview */}
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
};
