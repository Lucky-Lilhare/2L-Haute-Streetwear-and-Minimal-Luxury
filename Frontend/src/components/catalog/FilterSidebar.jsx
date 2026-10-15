import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/products';

export const FilterSidebar = ({ isMobile = false, onCloseMobile }) => {
  const { catalogFilters, setCatalogFilters, formatPrice } = useStore();

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'US 8', 'US 9', 'US 10', 'US 11'];
  const availableColors = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FAFAFA' },
    { name: 'Indigo', hex: '#1C2833' },
    { name: 'Taupe / Sand', hex: '#8C827A' },
    { name: 'Olive Drab', hex: '#3B4D3C' },
  ];

  const handleCategoryChange = (catId) => {
    setCatalogFilters((prev) => ({
      ...prev,
      category: catId,
      subCategory: 'all',
    }));
  };

  const toggleSize = (size) => {
    setCatalogFilters((prev) => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const toggleColor = (colorName) => {
    setCatalogFilters((prev) => {
      const exists = prev.colors.includes(colorName);
      const newColors = exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName];
      return { ...prev, colors: newColors };
    });
  };

  const resetAllFilters = () => {
    setCatalogFilters({
      category: 'all',
      subCategory: 'all',
      gender: 'all',
      minPrice: 399,
      maxPrice: 3000,
      sizes: [],
      colors: [],
      plusSizeOnly: false,
      searchQuery: '',
      sortBy: 'featured',
    });
  };

  return (
    <aside className={`space-y-6 ${isMobile ? 'p-6' : 'w-60 shrink-0'}`}>
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal size={15} className="text-white" />
          <h3 className="text-xs uppercase tracking-wider text-white font-semibold">
            Filters
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={resetAllFilters}
            className="text-[11px] text-neutral-400 hover:text-white transition-colors flex items-center space-x-1 font-medium"
            title="Reset Filters"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 text-neutral-400 hover:text-white rounded-lg ml-2"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* DEDICATED PLUS SIZE TOGGLE */}
      <div className="p-3.5 rounded-xl bg-neutral-900 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Plus Size Edit
            </span>
            <p className="text-xs font-semibold text-white">2XL & 3XL Fits</p>
          </div>
          <button
            onClick={() =>
              setCatalogFilters((prev) => ({
                ...prev,
                plusSizeOnly: !prev.plusSizeOnly,
              }))
            }
            className={`w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
              catalogFilters.plusSizeOnly ? 'bg-white' : 'bg-neutral-800'
            }`}
            aria-label="Toggle Plus Size Filter"
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform duration-200 ${
                catalogFilters.plusSizeOnly ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
          Category
        </h4>
        <div className="space-y-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                catalogFilters.category === cat.id
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <span>{cat.name}</span>
              {catalogFilters.category === cat.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
          Gender
        </h4>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {['all', 'men', 'women'].map((gen) => (
            <button
              key={gen}
              onClick={() => setCatalogFilters((prev) => ({ ...prev, gender: gen }))}
              className={`py-1.5 rounded-lg uppercase tracking-wider text-center transition-colors border font-medium ${
                catalogFilters.gender === gen
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              {gen === 'all' ? 'All' : gen}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
          <span>Max Price</span>
          <span className="text-white font-semibold">{formatPrice(catalogFilters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="399"
          max="3000"
          step="50"
          value={catalogFilters.maxPrice}
          onChange={(e) =>
            setCatalogFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-white bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Sizes Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
          Sizes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((sz) => {
            const isSelected = catalogFilters.sizes.includes(sz);

            return (
              <button
                key={sz}
                onClick={() => toggleSize(sz)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-white text-black font-semibold border-white'
                    : 'bg-neutral-900 border-white/10 text-neutral-300 hover:border-white/30'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
          Colors
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {availableColors.map((col) => {
            const isSelected = catalogFilters.colors.includes(col.name);

            return (
              <button
                key={col.name}
                onClick={() => toggleColor(col.name)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                  isSelected
                    ? 'border-white bg-white/10 text-white font-medium'
                    : 'border-white/10 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-700"
                  style={{ backgroundColor: col.hex }}
                />
                <span>{col.name}</span>
                {isSelected && <Check size={11} className="text-white ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
};
