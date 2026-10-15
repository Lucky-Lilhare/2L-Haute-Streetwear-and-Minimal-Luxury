import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X,
  ShieldCheck,
  Lock,
  LogOut,
  LogIn,
  UserPlus,
  Package
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CURRENCIES } from '../../data/products';

export const Navbar = () => {
  const {
    activeView,
    navigateTo,
    navigateToSection,
    catalogFilters,
    cartItemsCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setActiveAccountTab,
    currency,
    setCurrency,
    isHostAuthenticated,
    hostLogout,
    isUserLoggedIn,
    user,
    openAuthModal,
    logoutUser,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  const handleDirectSection = (options) => {
    navigateToSection(options);
    setMobileMenuOpen(false);
  };

  const isHomeActive = activeView === 'home';
  const isMenActive = activeView === 'catalog' && catalogFilters.gender === 'men' && catalogFilters.sortBy !== 'newest' && catalogFilters.sortBy !== 'price-asc';
  const isWomenActive = activeView === 'catalog' && catalogFilters.gender === 'women' && catalogFilters.sortBy !== 'newest' && catalogFilters.sortBy !== 'price-asc';
  const isCollectionsActive = activeView === 'catalog' && catalogFilters.gender === 'all' && catalogFilters.category === 'all' && catalogFilters.sortBy !== 'newest' && catalogFilters.sortBy !== 'price-asc';
  const isNewArrivalsActive = activeView === 'catalog' && catalogFilters.sortBy === 'newest';
  const isSaleActive = activeView === 'catalog' && catalogFilters.sortBy === 'price-asc';

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${isScrolled ? 'glass-nav py-3' : 'bg-[#0B0B0D] border-b border-white/[0.08] py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Left Navigation Links (Desktop) - Direct Section Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-wider font-medium">
            <button 
              onClick={() => handleNavClick('home')}
              className={`transition-colors py-1 relative ${isHomeActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
            >
              Home
              {isHomeActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />}
            </button>

            <button 
              onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'men', sortBy: 'featured' })}
              className={`transition-colors py-1 relative ${isMenActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
            >
              Men
              {isMenActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />}
            </button>

            <button 
              onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'women', sortBy: 'featured' })}
              className={`transition-colors py-1 relative ${isWomenActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
            >
              Women
              {isWomenActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />}
            </button>

            <button 
              onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'all', sortBy: 'featured' })}
              className={`transition-colors py-1 relative ${isCollectionsActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
            >
              Collections
              {isCollectionsActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />}
            </button>

            <button 
              onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'all', sortBy: 'newest' })}
              className={`transition-colors py-1 relative ${isNewArrivalsActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
            >
              New Arrivals
              {isNewArrivalsActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />}
            </button>

            <button 
              onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'all', sortBy: 'price-asc' })}
              className={`transition-colors py-1 relative flex items-center space-x-1.5 ${isSaleActive ? 'text-white font-semibold' : 'text-neutral-300 hover:text-white'}`}
            >
              <span>Sale</span>
              <span className="text-[9px] bg-white/10 text-neutral-200 border border-white/20 px-1 py-0.2 rounded font-medium">-30%</span>
              {isSaleActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />}
            </button>
          </nav>

          {/* Brand Logo "2L" */}
          <div className="flex-1 lg:flex-none text-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="group inline-flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-neutral-300 transition-colors">
                2L
              </span>
              <span className="text-[9px] tracking-[0.25em] text-neutral-400 uppercase -mt-0.5 font-medium">
                INDIA
              </span>
            </button>
          </div>

          {/* Right Navigation & Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Authenticated Host Master Controls (Hidden from public visitors) */}
            {isHostAuthenticated && (
              <div className="hidden sm:flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/40 rounded-full pl-3 pr-1.5 py-1 text-xs">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center space-x-1.5 font-bold transition-all cursor-pointer ${
                    activeView === 'admin' ? 'text-amber-300' : 'text-amber-400 hover:text-amber-300'
                  }`}
                  title="Open Host Atelier Control Center"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>👑 Host Atelier</span>
                </button>
                <button
                  onClick={() => hostLogout()}
                  className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white bg-black/50 hover:bg-black px-2 py-0.5 rounded-full transition-colors cursor-pointer border border-white/10"
                  title="Lock Host Session"
                >
                  Lock
                </button>
              </div>
            )}

            {/* Interactive Search Bar Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-3 py-1.5 rounded-full text-xs text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <Search size={14} className="text-neutral-400" />
              <span className="text-xs">Search pieces...</span>
              <kbd className="hidden xl:inline-block bg-neutral-800 text-[10px] text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-700">⌘K</kbd>
            </button>

            {/* Currency selector */}
            <div className="relative group hidden sm:block">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs text-neutral-400 hover:text-white border-0 focus:ring-0 cursor-pointer py-1 pr-3 uppercase appearance-none font-medium"
              >
                {Object.keys(CURRENCIES).map((cur) => (
                  <option key={cur} value={cur} className="bg-neutral-900 text-white">
                    {cur} ({CURRENCIES[cur].symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                setActiveAccountTab('wishlist');
                navigateTo('account');
              }}
              className="relative p-2 text-neutral-300 hover:text-white transition-colors"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart 
                size={19} 
                className={wishlist.length > 0 ? 'text-white fill-white' : 'text-neutral-300'} 
              />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fadeIn">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Profile / Auth Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className={`p-2 transition-colors relative flex items-center space-x-1 cursor-pointer ${
                  activeView === 'account' ? 'text-white' : 'text-neutral-300 hover:text-white'
                }`}
                aria-label="User Account"
                title={isUserLoggedIn ? `Account (${user.name})` : 'Sign In / Register'}
              >
                <User size={19} />
                {isUserLoggedIn ? (
                  <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#08080A]" />
                ) : (
                  <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>

              {/* Account Dropdown Menu */}
              {isAccountDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsAccountDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#111115] border border-white/15 p-2 shadow-2xl z-50 text-left animate-fadeIn">
                    {isUserLoggedIn ? (
                      /* Logged In State */
                      <div>
                        {/* User Identity Header */}
                        <div className="p-3 border-b border-white/10 mb-1">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                          <span className="inline-block mt-1.5 text-[9px] uppercase tracking-wider bg-white/10 text-neutral-300 font-semibold px-2 py-0.5 rounded-full border border-white/10">
                            {user.tier}
                          </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-0.5 text-xs">
                          <button
                            onClick={() => {
                              setActiveAccountTab('profile');
                              navigateTo('account');
                              setIsAccountDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <User size={14} className="text-neutral-400" />
                            <span>My Profile</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveAccountTab('orders');
                              navigateTo('account');
                              setIsAccountDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <Package size={14} className="text-neutral-400" />
                            <span>My Orders</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveAccountTab('wishlist');
                              navigateTo('account');
                              setIsAccountDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <Heart size={14} className="text-neutral-400" />
                            <span>Wishlist ({wishlist.length})</span>
                          </button>
                        </div>

                        {/* Logout Option */}
                        <div className="border-t border-white/10 mt-1.5 pt-1.5">
                          <button
                            onClick={() => {
                              logoutUser();
                              setIsAccountDropdownOpen(false);
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-semibold text-xs cursor-pointer"
                          >
                            <LogOut size={14} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Not Logged In State */
                      <div className="p-2 space-y-2 text-xs">
                        <div className="px-2 py-1">
                          <p className="text-xs font-bold text-white uppercase tracking-wider">Welcome to 2L</p>
                          <p className="text-[11px] text-neutral-400">Sign in to track orders & save wishlist</p>
                        </div>

                        <button
                          onClick={() => {
                            openAuthModal('signin');
                            setIsAccountDropdownOpen(false);
                          }}
                          className="w-full py-2 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <LogIn size={13} />
                          <span>Sign In</span>
                        </button>

                        <button
                          onClick={() => {
                            openAuthModal('signup');
                            setIsAccountDropdownOpen(false);
                          }}
                          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <UserPlus size={13} />
                          <span>Create Account</span>
                        </button>

                        <div className="border-t border-white/10 pt-2 px-1">
                          <button
                            onClick={() => {
                              navigateTo('account');
                              setIsAccountDropdownOpen(false);
                            }}
                            className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Go to Account Center →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full border border-white/10 transition-colors"
              aria-label="Shopping Bag"
              title="Cart Drawer"
            >
              <ShoppingBag size={17} />
              {cartItemsCount > 0 ? (
                <span className="absolute -top-1 -right-1 bg-white text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-fadeIn">
                  {cartItemsCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 bg-neutral-800 text-neutral-400 text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  0
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-dropdown border-t border-white/10 mt-3 px-6 py-6 space-y-3 animate-fadeIn text-xs uppercase tracking-wider font-medium">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`block w-full text-left py-2 border-b border-white/10 ${isHomeActive ? 'text-white font-bold' : 'text-neutral-300'}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'men', sortBy: 'featured' })} 
            className={`block w-full text-left py-2 border-b border-white/10 ${isMenActive ? 'text-white font-bold' : 'text-neutral-300'}`}
          >
            Men's Collection
          </button>
          <button 
            onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'women', sortBy: 'featured' })} 
            className={`block w-full text-left py-2 border-b border-white/10 ${isWomenActive ? 'text-white font-bold' : 'text-neutral-300'}`}
          >
            Women's Collection
          </button>
          <button 
            onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'all', sortBy: 'featured' })} 
            className={`block w-full text-left py-2 border-b border-white/10 ${isCollectionsActive ? 'text-white font-bold' : 'text-neutral-300'}`}
          >
            All Collections
          </button>
          <button 
            onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'all', sortBy: 'newest' })} 
            className={`block w-full text-left py-2 border-b border-white/10 ${isNewArrivalsActive ? 'text-white font-bold' : 'text-neutral-300'}`}
          >
            New Arrivals
          </button>
          <button 
            onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: false, gender: 'all', sortBy: 'price-asc' })} 
            className={`flex justify-between items-center w-full py-2 border-b border-white/10 ${isSaleActive ? 'text-white font-bold' : 'text-neutral-300'}`}
          >
            <span>Sale</span>
            <span className="text-[10px] bg-white/10 text-neutral-200 border border-white/20 px-1.5 py-0.5 rounded font-medium">-30%</span>
          </button>
          <button 
            onClick={() => handleDirectSection({ category: 'all', subCategory: 'all', plusSizeOnly: true, gender: 'all', sortBy: 'featured' })} 
            className="block w-full text-left py-2 border-b border-white/10 text-white font-semibold"
          >
            Plus Size (2XL – 3XL)
          </button>
          <button 
            onClick={() => { setActiveAccountTab('wishlist'); handleNavClick('account'); }} 
            className="flex justify-between items-center w-full py-2 border-b border-white/10 text-neutral-300"
          >
            <span>Wishlist</span>
            <span className="bg-white text-black px-1.5 py-0.5 rounded-full text-[10px] font-bold">{wishlist.length}</span>
          </button>
          <button 
            onClick={() => { setActiveAccountTab('profile'); handleNavClick('account'); }} 
            className="block w-full text-left py-2 border-b border-white/10 text-neutral-300"
          >
            VIP Account & Orders
          </button>

          {/* Mobile Auth / Logout options */}
          <div className="py-2 border-b border-white/10">
            {isUserLoggedIn ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-neutral-400 lowercase">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <LogOut size={12} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 bg-white text-black font-bold text-center rounded-xl text-xs uppercase"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 bg-neutral-900 border border-white/20 text-white font-semibold text-center rounded-xl text-xs uppercase"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          {isHostAuthenticated && (
            <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
              <button 
                onClick={() => handleNavClick('admin')} 
                className="flex items-center space-x-2 py-2 text-amber-400 font-bold"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>👑 Host Atelier Control</span>
              </button>
              <button
                onClick={() => {
                  hostLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 px-2.5 py-1 rounded"
              >
                Lock Session
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
