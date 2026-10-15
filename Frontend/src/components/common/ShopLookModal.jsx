import React from 'react';
import { X, Heart, ShoppingBag, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const ShopLookModal = () => {
  const { shopLookPost, setShopLookPost, navigateTo, addToCart, formatPrice } = useStore();

  if (!shopLookPost) return null;

  const product = PRODUCTS.find((p) => p.id === shopLookPost.productId);

  const handleGoToProduct = () => {
    if (product) {
      setShopLookPost(null);
      navigateTo('pdp', product);
    }
  };

  const handleQuickAdd = () => {
    if (product) {
      addToCart(product, product.sizes[0], product.colors[0], 1, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#111115] border border-white/10 rounded-2xl shadow-dark-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[85vh]">
        {/* Editorial Photo */}
        <div className="relative bg-[#0A0A0C] flex items-center justify-center h-72 md:h-full overflow-hidden">
          <img
            src={shopLookPost.image}
            alt={shopLookPost.caption}
            onError={(e) => { e.currentTarget.src = '/images/hero_streetwear.jpg'; }}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center space-x-1.5 text-xs text-neutral-300 font-medium">
            <MapPin size={12} />
            <span>{shopLookPost.location}</span>
          </div>
        </div>

        {/* Look Details & Shoppable Tag */}
        <div className="p-6 md:p-7 flex flex-col justify-between bg-[#131317]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
                  2L
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">{shopLookPost.user}</h4>
                  <p className="text-[11px] text-neutral-400">Lookbook Drop 07</p>
                </div>
              </div>
              <button
                onClick={() => setShopLookPost(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/60"
              >
                <X size={17} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 mt-4 leading-relaxed font-normal">
              "{shopLookPost.caption}"
            </p>

            <div className="flex items-center space-x-3 mt-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center space-x-1 text-rose-400">
                <Heart size={13} className="fill-rose-400" />
                <span>{shopLookPost.likes}</span>
              </span>
              <span>• Tagged in Lookbook</span>
            </div>

            {/* Featured Product Box */}
            {product && (
              <div className="mt-5 p-3.5 rounded-xl bg-neutral-900 border border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  Featured Piece
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                    className="w-14 h-16 object-cover rounded-lg bg-neutral-950 border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs sm:text-sm font-semibold text-white truncate">{product.name}</h5>
                    <p className="text-xs font-semibold text-white mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  <button
                    onClick={handleGoToProduct}
                    className="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs uppercase tracking-wider transition-colors font-medium"
                  >
                    <span>View Piece</span>
                    <ExternalLink size={12} />
                  </button>
                  <button
                    onClick={handleQuickAdd}
                    className="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    <ShoppingBag size={12} />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.08] text-center">
            <button
              onClick={() => {
                setShopLookPost(null);
                navigateTo('catalog');
              }}
              className="inline-flex items-center space-x-1 text-xs text-neutral-400 hover:text-white uppercase tracking-wider font-medium"
            >
              <span>Explore All Runway Pieces</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
