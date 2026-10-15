import React, { useState, useMemo } from 'react';
import { 
  Grid2X2, 
  Grid3X3, 
  LayoutGrid, 
  X, 
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';

export const CatalogPage = () => {
  const { 
    catalogFilters, 
    setCatalogFilters, 
    gridColumns, 
    setGridColumns,
    navigateToSection,
    products 
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Subcategory Tabs mapping for Dedicated Section Navigation
  const subCategoryTabs = {
    jeans: [
      { id: 'all', label: 'All Denim' },
      { id: 'Baggy', label: 'Baggy' },
      { id: 'Cargo', label: 'Tactical Cargo' },
      { id: 'Straight', label: 'Straight Leg' },
      { id: 'Slim', label: 'Slim Selvedge' },
    ],
    't-shirts': [
      { id: 'all', label: 'All Tees' },
      { id: 'Oversized', label: '450 GSM Oversized' },
      { id: 'Graphic', label: 'Graphic' },
      { id: 'Solids', label: 'Heavy Solids' },
    ],
    shirts: [
      { id: 'all', label: 'All Shirts' },
      { id: 'Oversized', label: 'Architectural Poplin' },
      { id: 'Linen', label: 'Flax Linen' },
      { id: 'Casual', label: 'Flannel' },
    ],
    sneakers: [
      { id: 'all', label: 'All Footwear' },
      { id: 'Chunky', label: 'Chunky Runners' },
      { id: 'Minimalist', label: 'Minimalist Lows' },
      { id: 'High-tops', label: 'High-Tops' },
    ],
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const list = products && products.length > 0 ? products : PRODUCTS;
    return list.filter((item) => {
      if (catalogFilters.category !== 'all' && item.category !== catalogFilters.category) {
        return false;
      }
      if (catalogFilters.subCategory !== 'all' && item.subCategory !== catalogFilters.subCategory) {
        return false;
      }
      if (catalogFilters.gender !== 'all' && item.gender !== catalogFilters.gender && item.gender !== 'unisex') {
        return false;
      }
      if (catalogFilters.plusSizeOnly && !item.hasPlusSize) {
        return false;
      }
      if (item.price > catalogFilters.maxPrice) {
        return false;
      }
      if (catalogFilters.sizes.length > 0) {
        const matchesAnySize = catalogFilters.sizes.some((sz) => item.sizes.includes(sz));
        if (!matchesAnySize) return false;
      }
      if (catalogFilters.colors.length > 0) {
        const matchesAnyColor = catalogFilters.colors.some((col) =>
          item.colors.some((c) => c.name.toLowerCase().includes(col.toLowerCase()))
        );
        if (!matchesAnyColor) return false;
      }
      if (catalogFilters.searchQuery) {
        const q = catalogFilters.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (catalogFilters.sortBy === 'price-asc') return a.price - b.price;
      if (catalogFilters.sortBy === 'price-desc') return b.price - a.price;
      if (catalogFilters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (catalogFilters.sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [catalogFilters]);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === catalogFilters.category);
  const currentTabs = subCategoryTabs[catalogFilters.category] || null;

  // Dynamic header info based on active section/filters
  const getHeaderInfo = () => {
    if (catalogFilters.category !== 'all' && currentCategoryObj) {
      const genderPrefix = catalogFilters.gender === 'men' ? "Men's " : catalogFilters.gender === 'women' ? "Women's " : "";
      return {
        badge: `${genderPrefix ? genderPrefix.toUpperCase() : 'DROP 07'} • ATELIER COLLECTION`,
        title: `${genderPrefix}${currentCategoryObj.name}`,
        desc: currentCategoryObj.description || 'Curated luxury cuts, architectural fits, and artisan Japanese denim.'
      };
    }
    if (catalogFilters.gender === 'men') {
      return {
        badge: "MEN'S ATELIER • 2026 COLLECTION",
        title: "Men's Collection",
        desc: 'Precision-tailored menswear, 450 GSM oversized tees, Japanese selvedge denim, and structured footwear.'
      };
    }
    if (catalogFilters.gender === 'women') {
      return {
        badge: "WOMEN'S ATELIER • 2026 COLLECTION",
        title: "Women's Collection",
        desc: 'Architectural silhouettes, cocoon outerwear, relaxed luxury denim, and minimalist lambskin sneakers.'
      };
    }
    if (catalogFilters.sortBy === 'newest') {
      return {
        badge: 'LATEST DROP • DROP 07 ARCHIVE',
        title: 'New Arrivals',
        desc: 'Freshly released experimental cuts, heavyweight washes, and seasonal capsule additions.'
      };
    }
    if (catalogFilters.sortBy === 'price-asc') {
      return {
        badge: 'LIMITED ARCHIVAL SALE • UP TO 30% OFF',
        title: 'Seasonal Sale & Archive',
        desc: 'Curated previous drop pieces and daily essentials starting from ₹399 with special seasonal markdowns.'
      };
    }
    if (catalogFilters.plusSizeOnly) {
      return {
        badge: 'INCLUSIVE SIZING EDIT',
        title: 'Plus Size Collection (2XL – 3XL)',
        desc: 'Relaxed proportions, boxy drops, and comfortable streetwear cuts graded for 2XL and 3XL.'
      };
    }
    return {
      badge: 'DROP 07 ARCHIVE • ALL PIECES',
      title: 'All Collections',
      desc: 'Japanese shuttle loom denim, 450 GSM combed cottons, and architectural silhouettes.'
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      
      {/* Catalog Header Banner */}
      <div className="mb-8 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-neutral-400 mb-2 font-medium">
              {headerInfo.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight uppercase">
              {headerInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-normal">
              {headerInfo.desc}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="text-right text-xs text-neutral-400 font-medium">
            <span>Showing </span>
            <strong className="text-white text-sm">{filteredProducts.length}</strong>
            <span> of {(products || PRODUCTS).length} pieces</span>
          </div>
        </div>

        {/* Top Quick Filters for All / Men / Women if no subcategory tabs */}
        {!currentTabs && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 mt-6 hide-scrollbar">
            <button
              onClick={() => setCatalogFilters((prev) => ({ ...prev, gender: 'all' }))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
                catalogFilters.gender === 'all'
                  ? 'bg-white text-black font-semibold border-white shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setCatalogFilters((prev) => ({ ...prev, gender: 'men' }))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
                catalogFilters.gender === 'men'
                  ? 'bg-white text-black font-semibold border-white shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              Men's Edit
            </button>
            <button
              onClick={() => setCatalogFilters((prev) => ({ ...prev, gender: 'women' }))}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
                catalogFilters.gender === 'women'
                  ? 'bg-white text-black font-semibold border-white shadow-sm'
                  : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              Women's Edit
            </button>
            <button
              onClick={() =>
                setCatalogFilters((prev) => ({ ...prev, plusSizeOnly: !prev.plusSizeOnly }))
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all border flex items-center space-x-1.5 ${
                catalogFilters.plusSizeOnly
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-neutral-900 text-neutral-300 border-white/20 hover:text-white'
              }`}
            >
              <span>Plus Sizes (2XL/3XL)</span>
            </button>
          </div>
        )}

        {/* Dedicated Subcategory Tabs */}
        {currentTabs && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 mt-6 hide-scrollbar">
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setCatalogFilters((prev) => ({ ...prev, subCategory: tab.id }))
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all border ${
                  catalogFilters.subCategory === tab.id
                    ? 'bg-white text-black font-semibold border-white shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            {/* Direct Plus size quick toggle */}
            <button
              onClick={() =>
                setCatalogFilters((prev) => ({ ...prev, plusSizeOnly: !prev.plusSizeOnly }))
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all border flex items-center space-x-1.5 ${
                catalogFilters.plusSizeOnly
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-neutral-900 text-neutral-300 border-white/20 hover:text-white'
              }`}
            >
              <span>Plus Sizes (2XL/3XL)</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#121216] border border-white/[0.08] p-3 rounded-2xl">
        
        {/* Left: Mobile filter button & active tags */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-neutral-800 text-white text-xs uppercase tracking-wider border border-white/10 font-medium"
          >
            <Filter size={13} />
            <span>Filters</span>
            {catalogFilters.plusSizeOnly && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>

          {/* Active filter badges */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5 text-xs font-medium">
            {catalogFilters.plusSizeOnly && (
              <span className="inline-flex items-center space-x-1 bg-neutral-800 text-white border border-white/15 px-2.5 py-0.5 rounded-lg">
                <span>Plus Size 2XL/3XL</span>
                <button
                  onClick={() =>
                    setCatalogFilters((prev) => ({ ...prev, plusSizeOnly: false }))
                  }
                  className="hover:text-white ml-1"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {catalogFilters.gender !== 'all' && (
              <span className="inline-flex items-center space-x-1 bg-neutral-800 text-neutral-200 border border-white/10 px-2.5 py-0.5 rounded-lg">
                <span className="uppercase">{catalogFilters.gender}</span>
                <button
                  onClick={() =>
                    setCatalogFilters((prev) => ({ ...prev, gender: 'all' }))
                  }
                  className="hover:text-white ml-1"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {catalogFilters.sizes.map((s) => (
              <span
                key={s}
                className="inline-flex items-center space-x-1 bg-neutral-800 text-neutral-200 border border-white/10 px-2.5 py-0.5 rounded-lg"
              >
                <span>Size: {s}</span>
                <button
                  onClick={() =>
                    setCatalogFilters((prev) => ({
                      ...prev,
                      sizes: prev.sizes.filter((sz) => sz !== s),
                    }))
                  }
                  className="hover:text-white ml-1"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Sorting & Grid Switcher */}
        <div className="flex items-center space-x-3 ml-auto">
          <div className="flex items-center space-x-2 text-xs text-neutral-400 font-medium">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={catalogFilters.sortBy}
              onChange={(e) =>
                setCatalogFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              className="bg-neutral-900 text-neutral-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-white/40 text-xs font-medium cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Drops</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Grid Layout Switcher */}
          <div className="hidden md:flex items-center space-x-1 bg-neutral-900 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setGridColumns(2)}
              className={`p-1.5 rounded-lg transition-colors ${
                gridColumns === 2 ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="2 Columns"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setGridColumns(3)}
              className={`p-1.5 rounded-lg transition-colors ${
                gridColumns === 3 ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="3 Columns"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setGridColumns(4)}
              className={`p-1.5 rounded-lg transition-colors ${
                gridColumns === 4 ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="4 Columns"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div className="flex gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Mobile Filter Slideover Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-80 max-w-[85vw] bg-[#121217] h-full overflow-y-auto border-r border-white/10 animate-slideInRight">
              <FilterSidebar isMobile onCloseMobile={() => setMobileFilterOpen(false)} />
            </div>
          </div>
        )}

        {/* Products Grid Container */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length > 0 ? (
            <div
              className={`grid gap-6 ${
                gridColumns === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : gridColumns === 4
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl bg-[#121216] border border-white/[0.08] p-8 space-y-4">
              <p className="text-base font-semibold text-white">
                No pieces match your current filters.
              </p>
              <button
                onClick={() =>
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
                  })
                }
                className="px-5 py-2.5 bg-white text-black font-semibold rounded-full text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
