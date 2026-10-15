import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Ruler, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertCircle,
  ZoomIn
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../catalog/ProductCard';

export const ProductDetailPage = () => {
  const {
    selectedProduct,
    navigateTo,
    addToCart,
    wishlist,
    toggleWishlist,
    formatPrice,
    setIsSizeGuideOpen,
    setIsCheckoutOpen,
    showToast,
    products,
  } = useStore();

  const product = selectedProduct || (products && products.length > 0 ? products[0] : PRODUCTS[0]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Pincode Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [deliveryPromise, setDeliveryPromise] = useState('');

  // Accordion toggles
  const [openAccordion, setOpenAccordion] = useState('fabric');

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    setPincodeStatus(null);
    setPincode('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const isFav = wishlist.includes(product.id);
  const crossSellProducts = (products && products.length > 0 ? products : PRODUCTS).filter((p) => p.id !== product.id).slice(0, 4);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!clean || clean.length < 5) {
      setPincodeStatus('error');
      setDeliveryPromise('Please enter a valid 6-digit Indian PIN code (e.g. 400050, 110001).');
      return;
    }

    const days = Math.floor(Math.random() * 2) + 2;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const dateStr = targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    setPincodeStatus('success');
    setDeliveryPromise(`✓ Bluedart Express delivery available to PIN ${clean} by ${dateStr}. Complimentary returns within 30 days.`);
    showToast(`PIN code ${clean} eligible for Bluedart Express Air`, 'success');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity, false);
    setIsCheckoutOpen(true);
  };

  const stockCount = product.stock?.[selectedSize] || 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      
      {/* Back button breadcrumb */}
      <div className="mb-6 flex items-center justify-between text-xs text-neutral-400 font-medium">
        <button
          onClick={() => navigateTo('catalog')}
          className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center space-x-2 text-neutral-400">
          <span>Drop S07</span>
          <span>•</span>
          <span className="uppercase text-neutral-200">{product.category}</span>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Image Gallery with Zoom */}
        <div className="lg:col-span-7 space-y-4">
          
          <div
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative aspect-[4/5] bg-[#0E0E10] rounded-2xl overflow-hidden border border-white/[0.08] cursor-crosshair group shadow-subtle select-none"
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
              className="w-full h-full object-cover transition-opacity duration-300"
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
              }}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {product.isBestseller && (
                <span className="bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                  Bestseller
                </span>
              )}
              {product.hasPlusSize && (
                <span className="bg-neutral-900/90 backdrop-blur-md border border-white/20 text-neutral-200 text-[10px] font-medium px-3 py-1 rounded-full tracking-wider">
                  XS – 3XL
                </span>
              )}
            </div>

            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] text-neutral-300 flex items-center space-x-1 pointer-events-none opacity-80 group-hover:opacity-100 font-medium">
              <ZoomIn size={12} />
              <span>Hover To Inspect Fabric</span>
            </div>
          </div>

          {/* Thumbnails row */}
          <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-white shadow-md'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Angle ${idx + 1}`}
                  onError={(e) => { e.currentTarget.src = '/images/raw_baggy_denim.jpg'; }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

        </div>

        {/* Right: Product Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2 border-b border-white/[0.08] pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                2L Atelier S07
              </span>
              <div className="flex items-center space-x-1.5 bg-neutral-900 border border-white/10 px-2.5 py-0.5 rounded-full">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-white">{product.rating}</span>
                <span className="text-xs text-neutral-400">({product.reviewsCount})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm text-neutral-300 font-normal leading-relaxed">
              {product.tagline}
            </p>

            <div className="pt-2 flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-neutral-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs bg-white/10 text-neutral-200 border border-white/15 px-2 py-0.5 rounded-full font-medium">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-400">
                Color: <strong className="text-white font-semibold">{selectedColor.name}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`group relative p-1 rounded-full border-2 transition-all cursor-pointer ${
                    selectedColor.name === c.name
                      ? 'border-white scale-110'
                      : 'border-transparent hover:border-neutral-500'
                  }`}
                  title={c.name}
                >
                  <span
                    className="w-6 h-6 rounded-full block border border-neutral-700"
                    style={{ backgroundColor: c.hex }}
                  />
                  {selectedColor.name === c.name && (
                    <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center space-x-2">
                <span className="text-neutral-400">
                  Size: <strong className="text-white font-semibold">{selectedSize}</strong>
                </span>
                {(selectedSize === '2XL' || selectedSize === '3XL') && (
                  <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded border border-white/15">
                    Plus Fit
                  </span>
                )}
              </div>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-neutral-300 hover:text-white transition-colors flex items-center space-x-1 cursor-pointer font-medium"
              >
                <Ruler size={13} />
                <span className="underline underline-offset-2">Size Guide</span>
              </button>
            </div>

            {/* Size Buttons Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {product.sizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all border text-center cursor-pointer ${
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

            {/* Live Stock Warning Alert */}
            <div className="flex items-center space-x-1.5 text-xs text-neutral-400 pt-1 font-normal">
              <span>
                {stockCount <= 3 ? `⚡ Only ${stockCount} left in size ${selectedSize} — Order soon` : `✓ In Stock: Ready for worldwide dispatch`}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 pt-1">
            <span className="text-xs text-neutral-400 font-medium">
              Quantity:
            </span>
            <div className="flex items-center bg-neutral-900 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-semibold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
              >
                <ShoppingBag size={16} />
                <span>Add To Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isFav
                    ? 'bg-neutral-800 border-white text-white'
                    : 'bg-neutral-900 border-white/10 hover:border-white/30 text-neutral-300 hover:text-white'
                }`}
                title="Wishlist piece"
              >
                <Heart size={18} className={isFav ? 'fill-white text-white' : ''} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/15 font-medium rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Instant Buy Now
            </button>
          </div>

          {/* PINCODE / POSTAL DELIVERY CHECKER */}
          <div className="p-4 rounded-2xl bg-[#131316] border border-white/[0.08] space-y-3">
            <div className="flex items-center space-x-2 text-xs text-neutral-300 font-medium">
              <Truck size={14} className="text-white" />
              <span>Delivery Estimator</span>
            </div>

            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN Code (e.g. 400050, 110001)..."
                className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium uppercase tracking-wider rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                Check
              </button>
            </form>

            {pincodeStatus && (
              <div
                className={`text-xs p-2.5 rounded-lg flex items-start space-x-2 animate-fadeIn ${
                  pincodeStatus === 'success'
                    ? 'bg-neutral-900 text-neutral-200 border border-white/15'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                }`}
              >
                {pincodeStatus === 'success' ? (
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{deliveryPromise}</span>
              </div>
            )}
          </div>

          {/* ACCORDIONS */}
          <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08] pt-1">
            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Fabric Composition & Sourcing</span>
                {openAccordion === 'fabric' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'fabric' && (
                <div className="pb-4 text-xs text-neutral-400 font-normal leading-relaxed space-y-2 animate-fadeIn">
                  <p>{product.fabric}</p>
                  <p>• Sourced ethically from audited textile mills in Okayama and Milan.</p>
                  <p>• Zero synthetic plastic microfibers.</p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'fit' ? null : 'fit')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Fit & Sizing Notes</span>
                {openAccordion === 'fit' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'fit' && (
                <div className="pb-4 text-xs text-neutral-400 font-normal leading-relaxed space-y-2 animate-fadeIn">
                  <p>{product.fit}</p>
                  <p>• Male model is 6'2" (188cm) wearing Size XL for the intentional boxy drape.</p>
                  <p>• Female model is 5'9" (175cm) wearing Size M.</p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Wash Care & Preservation</span>
                {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'care' && (
                <div className="pb-4 text-xs text-neutral-400 font-normal leading-relaxed space-y-1 animate-fadeIn">
                  <p>{product.care}</p>
                  <p>• Lay flat to dry away from direct UV sunlight to preserve natural dyes.</p>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setOpenAccordion(openAccordion === 'reviews' ? null : 'reviews')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Verified Client Reviews ({product.reviewsCount})</span>
                {openAccordion === 'reviews' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'reviews' && (
                <div className="pb-4 text-xs text-neutral-400 space-y-3 animate-fadeIn">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-amber-400">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-[11px] text-neutral-400">Verified Client (NY)</span>
                    </div>
                    <p className="font-medium text-neutral-200">"The weight of this textile is unbelievable."</p>
                    <p className="text-neutral-400 text-xs">Holds its architectural structure exactly like pictured. Best streetwear investment this season.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Cross-sells */}
      <div className="mt-20 pt-12 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
              Complementary Pieces
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Complete The Look
            </h3>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-xs uppercase tracking-wider text-neutral-400 hover:text-white font-medium"
          >
            View Entire Archive →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crossSellProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
};
