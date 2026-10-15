import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Tag, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';

export const QuickSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo, formatPrice, navigateToSection, products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  const trendingSearches = [
    'Raw Selvedge Baggy',
    '450 GSM Heavyweight',
    'Chunky Runner 01',
    'Flax Linen Shirt',
    'Plus Size 3XL',
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchTerm.toLowerCase().trim();
  const catalogList = products && products.length > 0 ? products : PRODUCTS;
  const filteredProducts = query
    ? catalogList.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesSubCategory = p.subCategory.toLowerCase().includes(query);
        const matchesTagline = p.tagline.toLowerCase().includes(query);
        const matchesSize = p.sizes.some((s) => s.toLowerCase() === query);
        return matchesName || matchesCategory || matchesSubCategory || matchesTagline || matchesSize;
      })
    : [];

  const handleProductSelect = (product) => {
    setIsSearchOpen(false);
    navigateTo('pdp', product);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#111115] border border-white/10 rounded-2xl shadow-dark-xl overflow-hidden animate-slideInRight"
        style={{ animationDuration: '0.2s' }}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-3.5 border-b border-white/[0.08] bg-[#141418]">
          <Search size={18} className="text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drops, denim, t-shirts, sneakers, sizes..."
            className="w-full bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-neutral-400 hover:text-white mr-2"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-[11px] uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-800 px-2 py-1 rounded border border-neutral-700 ml-1 font-medium"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {searchTerm ? (
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-wider pb-3 border-b border-white/[0.06] mb-3 font-medium">
                <span>Matching Pieces ({filteredProducts.length})</span>
                <span>2L Archive</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-950 border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                              {product.category}
                            </span>
                            {product.hasPlusSize && (
                              <span className="text-[10px] text-neutral-300 bg-neutral-800 px-1.5 py-0.2 rounded font-medium">
                                Up to 3XL
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-white group-hover:text-neutral-200 transition-colors mt-0.5">
                            {product.name}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right pl-3 shrink-0">
                        <span className="text-sm text-neutral-100 font-semibold">
                          {formatPrice(product.price)}
                        </span>
                        <ChevronRight size={15} className="text-neutral-500 group-hover:text-white ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-neutral-400 text-sm">No archive pieces matching "{searchTerm}".</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2.5 font-medium">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleTagClick(term)}
                      className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs transition-all flex items-center space-x-1.5 font-medium"
                    >
                      <Tag size={11} className="text-neutral-500" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 mb-2.5 font-medium">
                  Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateToSection({ category: 'jeans' });
                    }}
                    className="p-3 bg-neutral-900/60 hover:bg-neutral-800 border border-white/10 rounded-xl text-left transition-colors"
                  >
                    <p className="text-xs font-semibold text-white">Jeans & Denim</p>
                    <p className="text-[10px] text-neutral-400">14.5oz Raw</p>
                  </button>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateToSection({ category: 't-shirts' });
                    }}
                    className="p-3 bg-neutral-900/60 hover:bg-neutral-800 border border-white/10 rounded-xl text-left transition-colors"
                  >
                    <p className="text-xs font-semibold text-white">Heavy T-Shirts</p>
                    <p className="text-[10px] text-neutral-400">450 GSM</p>
                  </button>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateToSection({ category: 'sneakers' });
                    }}
                    className="p-3 bg-neutral-900/60 hover:bg-neutral-800 border border-white/10 rounded-xl text-left transition-colors"
                  >
                    <p className="text-xs font-semibold text-white">Footwear</p>
                    <p className="text-[10px] text-neutral-400">Sculpted Soles</p>
                  </button>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigateToSection({ category: 'all', plusSizeOnly: true });
                    }}
                    className="p-3 bg-neutral-900/60 hover:bg-neutral-800 border border-white/10 rounded-xl text-left transition-colors"
                  >
                    <p className="text-xs font-semibold text-white">Plus Sizing</p>
                    <p className="text-[10px] text-neutral-400">2XL / 3XL</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
