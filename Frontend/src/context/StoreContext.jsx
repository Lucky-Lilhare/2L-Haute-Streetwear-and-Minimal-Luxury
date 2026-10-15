import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, INITIAL_USER, GUEST_USER, CURRENCIES } from '../data/products';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  // Navigation & View
  const [activeView, setActiveView] = useState('home'); // 'home' | 'catalog' | 'pdp' | 'account' | 'wishlist'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeAccountTab, setActiveAccountTab] = useState('profile'); // 'profile' | 'orders' | 'addresses' | 'wishlist'

  // Dedicated Catalog Filters State
  const [catalogFilters, setCatalogFilters] = useState({
    category: 'all',
    subCategory: 'all',
    gender: 'all',
    minPrice: 399,
    maxPrice: 3000,
    sizes: [],
    colors: [],
    plusSizeOnly: false,
    searchQuery: '',
    sortBy: 'featured', // 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
  });

  // Layout preference
  const [gridColumns, setGridColumns] = useState(3); // 2 | 3 | 4

  // Cart State (Initialized with 1 staple item for instant interactive feel)
  const [cart, setCart] = useState([
    {
      id: '2l-t01',
      name: '450 GSM Monolith Boxy T-Shirt',
      size: 'XL',
      color: 'Obsidian Black',
      price: 599,
      quantity: 1,
      image: '/images/heavyweight_boxy_tee.jpg',
      stockAvailable: 14,
    }
  ]);
  const [appliedPromo, setAppliedPromo] = useState({ code: '', discountPercent: 0, freeShipping: false });

  // Wishlist State
  const [wishlist, setWishlist] = useState(['2l-j01', '2l-sn01']);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [shopLookPost, setShopLookPost] = useState(null);

  // Policy & Info Modals
  const [activePolicyModal, setActivePolicyModal] = useState(null); // 'contact' | 'shipping' | 'returns' | 'faqs'

  // Consumer User Authentication & Session State
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    try {
      const logged = localStorage.getItem('2l_user_logged_in');
      return logged === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('2l_user_profile');
      if (savedUser) return JSON.parse(savedUser);
      if (localStorage.getItem('2l_user_logged_in') === 'true') {
        return INITIAL_USER;
      }
    } catch {}
    return GUEST_USER;
  });

  // Consumer Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' | 'signup'

  const openAuthModal = (mode = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Live Products State (Baseline PRODUCTS + Real Admin Added Products)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('2l_custom_products');
      if (saved) {
        const customList = JSON.parse(saved);
        return [...customList, ...PRODUCTS.filter((p) => !customList.some((cp) => cp.id === p.id))];
      }
    } catch {
      // fallback
    }
    return PRODUCTS;
  });

  // Website & Customer Problem Issues State
  const [issues, setIssues] = useState(() => {
    try {
      const saved = localStorage.getItem('2l_issues_tickets');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ISS-1042',
        type: 'Order / Shipping',
        customerName: 'Aarav Mehta',
        email: 'aarav.m@example.com',
        orderId: '2L-98421',
        priority: 'High',
        status: 'In Progress',
        title: 'Delayed Delivery in Bangalore Hub',
        description: 'Shipment tracking shows stuck at Bangalore Sorting Centre for 4 days. Customer requested express re-route or delivery timeline update.',
        createdAt: '2026-10-14T10:30:00Z',
        notes: 'Contacted BlueDart courier manager. Re-dispatched on priority air van.',
      },
      {
        id: 'ISS-1043',
        type: 'Product Exchange',
        customerName: 'Priya Sharma',
        email: 'priya.s@example.com',
        orderId: '2L-98435',
        priority: 'Medium',
        status: 'Pending',
        title: 'Size Exchange for Selvedge Baggy Denim',
        description: 'Customer ordered Waist 32, wants size 34 exchange. Garment is unworn with original atelier tags intact.',
        createdAt: '2026-10-15T08:15:00Z',
        notes: 'Awaiting reverse courier pickup slot confirmation.',
      },
      {
        id: 'ISS-1044',
        type: 'Website / UI Bug',
        customerName: 'Staff Diagnostic',
        email: 'dev@2lclothing.com',
        orderId: 'N/A',
        priority: 'Critical',
        status: 'Investigating',
        title: 'UPI Payment Gateway Webhook Latency on Mobile Safari',
        description: 'Certain GPay transactions taking 4-5 seconds to return order confirmation callback. Added auto-polling fallback.',
        createdAt: '2026-10-15T11:45:00Z',
        notes: 'Engineering team inspecting webhook timeout retry queue.',
      },
      {
        id: 'ISS-1045',
        type: 'Payment / Refund',
        customerName: 'Vikram Sengupta',
        email: 'vikram.sen@example.com',
        orderId: '2L-98390',
        priority: 'Low',
        status: 'Resolved',
        title: 'Duplicate Payment Refund Processed',
        description: 'Customer accidentally clicked submit twice during checkout. Excess ₹1,299 refunded to original UPI VPA.',
        createdAt: '2026-10-13T14:20:00Z',
        notes: 'Bank reference ARN #9928172648. Customer confirmed receipt.',
      },
      {
        id: 'ISS-1046',
        type: 'Website / UI Bug',
        customerName: 'Customer Feedback',
        email: 'ananya.k@example.com',
        orderId: 'N/A',
        priority: 'Medium',
        status: 'Resolved',
        title: 'Navbar Dropdown Submenu Interaction',
        description: 'User requested direct redirection to Men and Women pages instead of slide-down menus.',
        createdAt: '2026-10-15T13:00:00Z',
        notes: 'Fixed! Upgraded navbar buttons to direct action links with active underline indicators.',
      }
    ];
  });

  // All Store Orders for Admin Hub
  const [allOrders, setAllOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('2l_all_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: '2L-98421',
        customerName: 'Aarav Mehta',
        email: 'aarav.m@example.com',
        phone: '+91 98765 43210',
        date: 'Oct 14, 2026',
        total: 1898,
        status: 'Processing',
        carrier: 'Bluedart Priority Air',
        trackingNumber: '2L-IN-98124019',
        shippingAddress: {
          name: 'Aarav Mehta',
          street: 'Flat 402, Prestige Tower, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
        },
        paymentMethod: 'UPI',
        items: [
          { name: '14.5oz Raw Selvedge Baggy Denim', quantity: 1, size: '32', price: 1299, image: '/images/raw_baggy_denim.jpg' },
          { name: '450 GSM Monolith Boxy T-Shirt', quantity: 1, size: 'XL', price: 599, image: '/images/heavyweight_boxy_tee.jpg' }
        ],
      },
      {
        id: '2L-98390',
        customerName: 'Rohan Verma',
        email: 'rohan.v@example.com',
        phone: '+91 91234 56789',
        date: 'Oct 13, 2026',
        total: 2499,
        status: 'Shipped',
        carrier: 'Delhivery Express Ground',
        trackingNumber: '2L-IN-49201948',
        shippingAddress: {
          name: 'Rohan Verma',
          street: '12-B Bandra West, Linking Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
        },
        paymentMethod: 'Card',
        items: [
          { name: 'Vaporwave Architectural Chunky Runner', quantity: 1, size: 'US 10', price: 2499, image: '/images/chunky_runner_sneaker.jpg' }
        ],
      },
      ...INITIAL_USER.orders
    ];
  });

  // Currency
  const [currency, setCurrency] = useState('INR');

  // Global Toast
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Host Authentication Gate (Restricted to Project Host/Admin only)
  const [isHostAuthenticated, setIsHostAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('2l_host_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Host Username, Password & Password Hint Credentials (Persisted in localStorage)
  const [hostUsername, setHostUsername] = useState(() => {
    try {
      const saved = localStorage.getItem('2l_host_username');
      if (saved && saved.trim() && saved.trim().toLowerCase() !== 'admin') return saved.trim();
    } catch {}
    return 'Admin@122'; // Configured host username
  });

  const [hostPassword, setHostPassword] = useState(() => {
    try {
      const saved = localStorage.getItem('2l_host_password');
      if (saved && saved.trim() && saved.trim() !== 'Admin@1201') return saved.trim();
      const savedPasskey = localStorage.getItem('2l_host_custom_passkey');
      if (savedPasskey && savedPasskey.trim() && savedPasskey.trim() !== 'Admin@1201') return savedPasskey.trim();
    } catch {}
    return 'Bucchi@1225'; // Configured host password
  });

  const [hostHint, setHostHint] = useState(() => {
    try {
      const saved = localStorage.getItem('2l_host_hint') || localStorage.getItem('2l_host_custom_hint');
      const currentPwd = localStorage.getItem('2l_host_password') || localStorage.getItem('2l_host_custom_passkey') || 'Bucchi@1225';
      // If hint matches the password or default keys, keep it blank!
      if (saved && saved.trim() && saved !== '2L-HOST-2026' && saved !== currentPwd && saved !== 'Bucchi@1225') {
        return saved.trim();
      }
    } catch {}
    return ''; // Blank by default, nothing written
  });

  // Sync localStorage with configured credentials
  useEffect(() => {
    try {
      const savedU = localStorage.getItem('2l_host_username');
      const savedP = localStorage.getItem('2l_host_password');
      if (!savedU || savedU.toLowerCase() === 'admin') {
        localStorage.setItem('2l_host_username', 'Admin@122');
      }
      if (!savedP || savedP === 'Admin@1201') {
        localStorage.setItem('2l_host_password', 'Bucchi@1225');
        localStorage.setItem('2l_host_custom_passkey', 'Bucchi@1225');
      }
    } catch {}
  }, []);

  const updateHostCredentials = (newUsername, newPassword, newHint = '') => {
    if (!newUsername || newUsername.trim().length < 2) {
      showToast('Host username must be at least 2 characters', 'error');
      return false;
    }
    if (!newPassword || newPassword.trim().length < 3) {
      showToast('Host password must be at least 3 characters', 'error');
      return false;
    }

    const cleanUsername = newUsername.trim();
    const cleanPassword = newPassword.trim();
    const cleanHint = (newHint && newHint.trim() !== cleanPassword && newHint.trim() !== 'Bucchi@1225' && newHint.trim() !== '2L-HOST-2026') ? newHint.trim() : '';

    setHostUsername(cleanUsername);
    setHostPassword(cleanPassword);
    setHostHint(cleanHint);

    try {
      localStorage.setItem('2l_host_username', cleanUsername);
      localStorage.setItem('2l_host_password', cleanPassword);
      localStorage.setItem('2l_host_hint', cleanHint);
      // Keep legacy keys updated for compatibility
      localStorage.setItem('2l_host_custom_passkey', cleanPassword);
      localStorage.setItem('2l_host_custom_hint', cleanHint);
    } catch {}

    showToast('Host credentials (Username & Password) updated successfully!', 'success');
    return true;
  };

  const hostLogin = (username, password) => {
    // If only one argument passed (legacy single field), handle password check
    let userArg = username;
    let passArg = password;
    if (password === undefined) {
      passArg = username;
      userArg = hostUsername;
    }

    if (!userArg || !passArg) {
      showToast('Please provide both Host Username and Password.', 'error');
      return false;
    }

    const u = userArg.trim().toLowerCase();
    const p = passArg.trim();

    // STRICT CREDENTIAL VERIFICATION:
    // Matches the active host credentials OR configured credentials Admin@122 / Bucchi@1225
    const isUsernameMatch = 
      u === (hostUsername || '').trim().toLowerCase() ||
      u === 'admin@122';

    const isPasswordMatch = 
      p === (hostPassword || '').trim() ||
      p === 'Bucchi@1225';

    if (isUsernameMatch && isPasswordMatch) {
      // Keep state and localStorage in sync
      if (hostUsername !== userArg.trim()) {
        setHostUsername(userArg.trim());
        try { localStorage.setItem('2l_host_username', userArg.trim()); } catch {}
      }
      if (hostPassword !== p) {
        setHostPassword(p);
        try {
          localStorage.setItem('2l_host_password', p);
          localStorage.setItem('2l_host_custom_passkey', p);
        } catch {}
      }
      try {
        sessionStorage.setItem('2l_host_auth', 'true');
      } catch {}
      setIsHostAuthenticated(true);
      showToast(`Host Access Verified: Welcome back, ${userArg.trim()}!`, 'success');
      return true;
    } else {
      showToast('Invalid Host Username or Password. Access denied.', 'error');
      return false;
    }
  };

  const hostLogout = () => {
    try {
      sessionStorage.removeItem('2l_host_auth');
    } catch {}
    setIsHostAuthenticated(false);
    setActiveView('home');
    showToast('Host session locked. Admin access restricted.', 'info');
  };

  // Aliases for full backward compatibility
  const hostPasskey = hostPassword;
  const hostPasskeyHint = hostHint;
  const showAutoFill = false;
  const updateHostSecurity = (newPasskey, newHint) => updateHostCredentials(hostUsername, newPasskey, newHint);

  // Helper: Format price based on currency
  const formatPrice = (amountInINR) => {
    const curr = CURRENCIES[currency] || CURRENCIES.INR;
    const converted = amountInINR * curr.rate;
    if (currency === 'INR') {
      return `${curr.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    if (currency === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  // View navigation helper
  const navigateTo = (view, product = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setSelectedProduct(product);
    }
    setActiveView(view);
  };

  // Direct section jump helper
  const navigateToSection = ({ category = 'all', subCategory = 'all', plusSizeOnly = false, gender = 'all', sortBy = null }) => {
    setCatalogFilters((prev) => ({
      ...prev,
      category,
      subCategory,
      plusSizeOnly,
      gender,
      sortBy: sortBy !== null ? sortBy : (gender !== 'all' ? 'featured' : prev.sortBy),
      searchQuery: '',
    }));
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist Actions
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      const prod = PRODUCTS.find((p) => p.id === productId);
      const prodName = prod ? prod.name : 'Piece';
      if (exists) {
        showToast(`Removed "${prodName}" from Archive Wishlist`, 'info');
      } else {
        showToast(`Added "${prodName}" to Archive Wishlist`, 'success');
      }
      return updated;
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Cart Actions
  const addToCart = (product, size, color, quantity = 1, openDrawer = true) => {
    const chosenSize = size || (product.sizes ? product.sizes[0] : 'Standard');
    const chosenColor = color ? (typeof color === 'string' ? color : color.name) : (product.colors ? product.colors[0].name : 'Default');
    const image = product.images ? product.images[0] : '';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === chosenSize && item.color === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            size: chosenSize,
            color: chosenColor,
            price: product.price,
            originalPrice: product.originalPrice,
            image,
            quantity,
            stockAvailable: product.stock?.[chosenSize] || 10,
          },
        ];
      }
    });

    showToast(`Added ${quantity}x "${product.name}" (${chosenSize} / ${chosenColor}) to Cart`, 'success');

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQuantity = (itemIndex, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemIndex);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[itemIndex].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (itemIndex) => {
    setCart((prev) => {
      const item = prev[itemIndex];
      if (item) {
        showToast(`Removed "${item.name}" from Cart`, 'info');
      }
      return prev.filter((_, idx) => idx !== itemIndex);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Move Wishlist item to cart
  const moveWishlistToCart = (productId, size = null) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;
    const selectedSize = size || prod.sizes[0];
    addToCart(prod, selectedSize, prod.colors[0], 1, true);
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast(`Moved "${prod.name}" to Cart`, 'success');
  };

  // Promo Code
  const applyPromoCode = (code) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === '2LFIRST') {
      setAppliedPromo({ code: '2LFIRST', discountPercent: 10, freeShipping: false });
      showToast('Promo code 2LFIRST applied: 10% OFF your entire order!', 'success');
      return true;
    } else if (trimmed === 'DROP20') {
      setAppliedPromo({ code: 'DROP20', discountPercent: 20, freeShipping: false });
      showToast('VIP Drop code DROP20 applied: 20% OFF!', 'success');
      return true;
    } else if (trimmed === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', discountPercent: 0, freeShipping: true });
      showToast('Complimentary Global Express Shipping applied!', 'success');
      return true;
    } else {
      showToast('Invalid or expired archive code. Try "2LFIRST" or "DROP20"', 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo({ code: '', discountPercent: 0, freeShipping: false });
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 999;
  const isEligibleFreeShipping = cartSubtotal >= freeShippingThreshold || appliedPromo.freeShipping;
  const standardShippingCost = cartSubtotal > 0 && !isEligibleFreeShipping ? 60 : 0;
  const discountAmount = appliedPromo.discountPercent > 0 ? (cartSubtotal * appliedPromo.discountPercent) / 100 : 0;
  const estimatedTax = cartSubtotal > 0 ? (cartSubtotal - discountAmount) * 0.12 : 0; // 12% GST
  const cartGrandTotal = Math.max(0, cartSubtotal - discountAmount + standardShippingCost + estimatedTax);

  // Profile Management
  const updateUserProfile = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
    showToast('Profile credentials successfully updated', 'success');
  };

  const addSavedAddress = (addressData) => {
    const newAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
      isDefault: user.savedAddresses.length === 0,
    };
    setUser((prev) => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, newAddress],
    }));
    showToast('Delivery address saved to archive', 'success');
  };

  const editSavedAddress = (id, updatedData) => {
    setUser((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.map((addr) => (addr.id === id ? { ...addr, ...updatedData } : addr)),
    }));
    showToast('Address updated successfully', 'success');
  };

  const deleteSavedAddress = (id) => {
    setUser((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter((addr) => addr.id !== id),
    }));
    showToast('Address removed', 'info');
  };

  const setDefaultSavedAddress = (id) => {
    setUser((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    }));
    showToast('Default shipping address updated', 'success');
  };

  // Consumer Authentication Handlers (Login, Register, Logout)
  const loginUser = async ({ email, password }) => {
    if (!email || !password) {
      showToast('Please provide both email and password.', 'error');
      return { success: false, message: 'Please provide both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check local registered user accounts
    try {
      const registered = JSON.parse(localStorage.getItem('2l_registered_users') || '[]');
      const match = registered.find((u) => u.email.toLowerCase() === cleanEmail && u.password === password);
      if (match) {
        const userProfile = {
          name: match.name,
          email: match.email,
          phone: match.phone || '',
          tier: match.tier || 'NOIR CLUB MEMBER',
          points: match.points || 150,
          nextTierPoints: match.nextTierPoints || 500,
          memberSince: match.memberSince || '2026',
          avatar: match.avatar || '/images/hero_streetwear.jpg',
          savedAddresses: match.savedAddresses || [],
          orders: match.orders || [],
        };
        setUser(userProfile);
        setIsUserLoggedIn(true);
        localStorage.setItem('2l_user_logged_in', 'true');
        localStorage.setItem('2l_user_profile', JSON.stringify(userProfile));
        closeAuthModal();
        showToast(`Welcome back, ${match.name}!`, 'success');
        return { success: true, user: userProfile };
      }
    } catch {}

    // 2. Demo User Login (Adrian Vance)
    if (cleanEmail === 'adrian.vance@atelier-2l.com' || cleanEmail === 'demo@2l.com' || cleanEmail === 'user@2l.com' || cleanEmail === 'adrian@2l.com') {
      setUser(INITIAL_USER);
      setIsUserLoggedIn(true);
      try {
        localStorage.setItem('2l_user_logged_in', 'true');
        localStorage.setItem('2l_user_profile', JSON.stringify(INITIAL_USER));
      } catch {}
      closeAuthModal();
      showToast(`Welcome back, ${INITIAL_USER.name}!`, 'success');
      return { success: true, user: INITIAL_USER };
    }

    // 3. Try Backend REST API endpoint /api/auth/login
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        const userProfile = {
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || '',
          tier: 'NOIR CLUB MEMBER',
          points: 150,
          nextTierPoints: 500,
          memberSince: '2026',
          avatar: '/images/hero_streetwear.jpg',
          savedAddresses: data.user.addresses || [],
          orders: [],
        };
        setUser(userProfile);
        setIsUserLoggedIn(true);
        localStorage.setItem('2l_user_logged_in', 'true');
        localStorage.setItem('2l_user_profile', JSON.stringify(userProfile));
        if (data.token) localStorage.setItem('2l_user_token', data.token);
        closeAuthModal();
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true, user: userProfile };
      }
    } catch {
      // Backend offline fallback handled gracefully
    }

    showToast('Invalid email or password credentials.', 'error');
    return { success: false, message: 'Invalid email or password credentials.' };
  };

  const registerUser = async ({ name, email, password, phone }) => {
    if (!name || !email || !password) {
      showToast('Please provide your name, email, and password.', 'error');
      return { success: false, message: 'Name, email, and password are required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      const registered = JSON.parse(localStorage.getItem('2l_registered_users') || '[]');
      if (registered.some((u) => u.email.toLowerCase() === cleanEmail)) {
        showToast('An account with this email already exists.', 'error');
        return { success: false, message: 'An account with this email already exists.' };
      }

      const newAccount = {
        name: cleanName,
        email: cleanEmail,
        password,
        phone: (phone || '').trim(),
        tier: 'NOIR CLUB MEMBER',
        points: 200, // Welcome signup bonus
        nextTierPoints: 500,
        memberSince: 'October 2026',
        avatar: '/images/hero_streetwear.jpg',
        savedAddresses: [],
        orders: [],
      };

      registered.push(newAccount);
      localStorage.setItem('2l_registered_users', JSON.stringify(registered));

      // Attempt dispatch to backend API
      try {
        fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, password, phone })
        }).catch(() => {});
      } catch {}

      setUser(newAccount);
      setIsUserLoggedIn(true);
      localStorage.setItem('2l_user_logged_in', 'true');
      localStorage.setItem('2l_user_profile', JSON.stringify(newAccount));
      closeAuthModal();
      showToast(`Welcome to 2L Haute Streetwear, ${cleanName}!`, 'success');
      return { success: true, user: newAccount };
    } catch (err) {
      showToast('Registration failed. Please try again.', 'error');
      return { success: false, message: err.message };
    }
  };

  const logoutUser = () => {
    setIsUserLoggedIn(false);
    setUser(GUEST_USER);
    try {
      localStorage.removeItem('2l_user_logged_in');
      localStorage.removeItem('2l_user_profile');
      localStorage.removeItem('2l_user_token');
    } catch {}
    showToast('You have been logged out of your account.', 'info');
  };

  // Checkout & Order Placement
  const placeOrder = (orderData) => {
    const newOrderId = `2L-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      total: cartGrandTotal,
      status: 'Confirmed',
      carrier: orderData.shippingMethod === 'express' ? 'Bluedart Priority Air' : 'Delhivery Express Ground',
      trackingNumber: `2L-IN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: '2-3 Business Days',
      shippingAddress: orderData.address,
      paymentMethod: orderData.paymentMethod,
      items: [...cart],
      steps: [
        { label: 'Order Confirmed', date: 'Just now', completed: true, current: true },
        { label: 'Atelier Tailoring & Inspection', date: 'Pending', completed: false },
        { label: 'Dispatched to Courier', date: 'Pending', completed: false },
        { label: 'Out for Delivery', date: 'Pending', completed: false },
        { label: 'Delivered', date: 'Pending', completed: false },
      ],
    };

    // Add order to user state & reward loyalty points (1 pt per ₹10)
    setUser((prev) => ({
      ...prev,
      points: prev.points + Math.round(cartGrandTotal / 10),
      orders: [newOrder, ...prev.orders],
    }));

    setAllOrders((prev) => {
      const updated = [newOrder, ...prev];
      try { localStorage.setItem('2l_all_orders', JSON.stringify(updated)); } catch {}
      return updated;
    });

    setLastPlacedOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
    showToast(`Order #${newOrderId} successfully placed!`, 'success');
  };

  // Product Administration (Strictly Host / Admin Only)
  const addProduct = (newProduct) => {
    if (!isHostAuthenticated) {
      showToast('Access Denied: Only verified project host can add products to the store.', 'error');
      return null;
    }

    const id = `2l-real-${Date.now().toString(36)}`;
    const productFormatted = {
      id,
      name: newProduct.name,
      category: newProduct.category || 't-shirts',
      subCategory: newProduct.subCategory || 'Oversized',
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice || Math.round(newProduct.price * 1.6)),
      description: newProduct.description || 'Artisan tailored luxury piece made from premium textiles.',
      fabric: newProduct.fabric || '450 GSM Heavy Combed Cotton',
      fit: newProduct.fit || 'Architectural Relaxed',
      sizes: newProduct.sizes && newProduct.sizes.length > 0 ? newProduct.sizes : ['S', 'M', 'L', 'XL'],
      colors: newProduct.colors && newProduct.colors.length > 0 ? newProduct.colors : [{ name: 'Obsidian Black', hex: '#111111' }],
      images: newProduct.images && newProduct.images.length > 0 ? newProduct.images : ['/images/heavyweight_boxy_tee.jpg'],
      rating: 5.0,
      reviewsCount: 1,
      gender: newProduct.gender || 'unisex',
      isNew: true,
      isBestseller: true,
      hasPlusSize: newProduct.hasPlusSize || false,
      stockCount: Number(newProduct.stockCount || 40),
    };

    setProducts((prev) => {
      const updated = [productFormatted, ...prev];
      try {
        const customOnly = updated.filter((p) => !PRODUCTS.some((base) => base.id === p.id));
        localStorage.setItem('2l_custom_products', JSON.stringify(customOnly));
      } catch {}
      return updated;
    });

    showToast(`"${productFormatted.name}" published to live store!`, 'success');
    return productFormatted;
  };

  const bulkAddProducts = async (newProductsList) => {
    if (!isHostAuthenticated) {
      showToast('Access Denied: Only verified project host can import products.', 'error');
      return { success: false, message: 'Unauthorized' };
    }

    if (!Array.isArray(newProductsList) || newProductsList.length === 0) {
      showToast('No products provided for bulk import.', 'error');
      return { success: false, message: 'Empty list' };
    }

    const normalizeCat = (cat) => {
      if (!cat) return 't-shirts';
      const c = String(cat).trim().toLowerCase();
      if (c.includes('jean') || c.includes('denim')) return 'jeans';
      if (c.includes('t-shirt') || c.includes('tee') || c === 'tshirt' || c === 't-shirts') return 't-shirts';
      if (c.includes('shirt') || c.includes('poplin')) return 'shirts';
      if (c.includes('sneaker') || c.includes('shoe') || c.includes('footwear')) return 'sneakers';
      if (c.includes('outerwear') || c.includes('jacket') || c.includes('hoodie')) return 'outerwear';
      return 't-shirts';
    };

    const normalizeSubCat = (sub, cat) => {
      if (sub && String(sub).trim()) return String(sub).trim();
      const c = normalizeCat(cat);
      if (c === 'jeans') return 'Baggy';
      if (c === 'sneakers') return 'Chunky';
      if (c === 'shirts') return 'Poplin';
      return 'Oversized';
    };

    const formattedList = [];
    const skippedDuplicates = [];

    const existingNames = new Set(products.map((p) => p.name.toLowerCase().trim()));
    const existingSkus = new Set(products.filter((p) => p.sku).map((p) => String(p.sku).toLowerCase().trim()));

    newProductsList.forEach((item, index) => {
      const rawTitle = (item.title || item.name || '').trim();
      const rawSku = (item.sku || '').trim();

      if (rawSku && existingSkus.has(rawSku.toLowerCase())) {
        skippedDuplicates.push({ title: rawTitle, sku: rawSku, reason: 'Duplicate SKU already exists' });
        return;
      }
      if (existingNames.has(rawTitle.toLowerCase())) {
        skippedDuplicates.push({ title: rawTitle, sku: rawSku, reason: 'Product with this title already exists' });
        return;
      }

      if (rawSku) existingSkus.add(rawSku.toLowerCase());
      existingNames.add(rawTitle.toLowerCase());

      const price = Number(item.sellingPrice ?? item.price ?? 799);
      const originalPrice = Number(item.mrp ?? item.originalPrice ?? Math.round(price * 1.5));
      const stockCount = Number(item.stock ?? item.stockCount ?? 25);
      const category = normalizeCat(item.category);
      const subCategory = normalizeSubCat(item.subcategory || item.subCategory, category);
      const id = `2l-bulk-${Date.now().toString(36)}-${index}-${Math.floor(Math.random() * 1000)}`;

      const formatted = {
        id,
        sku: rawSku || `2L-SKU-${Math.floor(10000 + Math.random() * 90000)}`,
        name: rawTitle,
        category,
        subCategory,
        price,
        originalPrice: originalPrice >= price ? originalPrice : Math.round(price * 1.5),
        stockCount: stockCount >= 0 ? stockCount : 25,
        fabric: item.fabric || '450 GSM Heavy Combed Cotton',
        fit: item.fit || (subCategory === 'Baggy' ? 'Exaggerated Baggy' : 'Architectural Oversized'),
        gender: item.gender ? item.gender.toLowerCase() : 'unisex',
        description: item.description || `${rawTitle} - Artisan tailored streetwear piece designed for the 2L atelier collection.`,
        images: Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : [item.image || '/images/heavyweight_boxy_tee.jpg'],
        sizes: Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes : ['S', 'M', 'L', 'XL'],
        colors: Array.isArray(item.colors) && item.colors.length > 0
          ? item.colors
          : [{ name: 'Obsidian Black', hex: '#111111' }],
        hasPlusSize: Boolean(item.hasPlusSize || (item.sizes && (item.sizes.includes('2XL') || item.sizes.includes('3XL')))),
        rating: 5.0,
        reviewsCount: 1,
        isNew: true,
        isBestseller: true,
      };

      formattedList.push(formatted);
    });

    if (formattedList.length > 0) {
      setProducts((prev) => {
        const updated = [...formattedList, ...prev];
        try {
          const customOnly = updated.filter((p) => !PRODUCTS.some((base) => base.id === p.id));
          localStorage.setItem('2l_custom_products', JSON.stringify(customOnly));
        } catch {}
        return updated;
      });

      // Dispatch to Backend API endpoint
      try {
        fetch('http://localhost:5000/api/products/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-host-key': hostPassword || '2L-HOST-2026',
          },
          body: JSON.stringify({ products: formattedList }),
        }).catch(() => {});
      } catch {}

      showToast(`Bulk Import Success: ${formattedList.length} products published to live store!`, 'success');
    }

    return {
      success: true,
      importedCount: formattedList.length,
      skippedCount: skippedDuplicates.length,
      importedProducts: formattedList,
      skippedDuplicates,
    };
  };

  const updateProduct = (id, updatedFields) => {
    if (!isHostAuthenticated) {
      showToast('Access Denied: Only verified project host can modify product catalog.', 'error');
      return false;
    }

    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      try {
        const customOnly = updated.filter((p) => !PRODUCTS.some((base) => base.id === p.id));
        localStorage.setItem('2l_custom_products', JSON.stringify(customOnly));
      } catch {}
      return updated;
    });
    showToast('Product specifications updated', 'success');
    return true;
  };

  const deleteProduct = (id) => {
    if (!isHostAuthenticated) {
      showToast('Access Denied: Only verified project host can delete products.', 'error');
      return false;
    }

    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        const customOnly = updated.filter((p) => !PRODUCTS.some((base) => base.id === p.id));
        localStorage.setItem('2l_custom_products', JSON.stringify(customOnly));
      } catch {}
      return updated;
    });
    showToast('Product removed from active catalog', 'info');
    return true;
  };

  // Issue & Website Problem Management (Strictly Host / Admin Only)
  const addIssue = (newIssue) => {
    const id = `ISS-${1000 + issues.length + 1}`;
    const issueFormatted = {
      id,
      type: newIssue.type || 'Website / UI Bug',
      customerName: newIssue.customerName || 'Staff Diagnostic',
      email: newIssue.email || 'support@2lclothing.com',
      orderId: newIssue.orderId || 'N/A',
      priority: newIssue.priority || 'Medium',
      status: 'Pending',
      title: newIssue.title,
      description: newIssue.description,
      createdAt: new Date().toISOString(),
      notes: newIssue.notes || '',
    };

    setIssues((prev) => {
      const updated = [issueFormatted, ...prev];
      try { localStorage.setItem('2l_issues_tickets', JSON.stringify(updated)); } catch {}
      return updated;
    });

    showToast(`Problem Ticket #${id} logged`, 'info');
    return issueFormatted;
  };

  const updateIssueStatus = (id, newStatus, newNotes = null) => {
    if (!isHostAuthenticated) {
      showToast('Access Denied: Only verified project host can resolve or update problem issues.', 'error');
      return false;
    }

    setIssues((prev) => {
      const updated = prev.map((iss) => {
        if (iss.id === id) {
          return {
            ...iss,
            status: newStatus,
            notes: newNotes !== null ? newNotes : iss.notes,
          };
        }
        return iss;
      });
      try { localStorage.setItem('2l_issues_tickets', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast(`Ticket #${id} marked as "${newStatus}"`, 'success');
    return true;
  };

  const deleteIssue = (id) => {
    if (!isHostAuthenticated) {
      showToast('Access Denied: Only verified project host can delete or archive issues.', 'error');
      return false;
    }

    setIssues((prev) => {
      const updated = prev.filter((iss) => iss.id !== id);
      try { localStorage.setItem('2l_issues_tickets', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast(`Issue #${id} archived`, 'info');
    return true;
  };

  // Order Administration (Strictly Host / Admin Only)
  const updateOrderStatus = (orderId, newStatus) => {
    if (!isHostAuthenticated) {
      showToast('Access Denied: Only verified project host can manage order status.', 'error');
      return false;
    }

    setAllOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
      try { localStorage.setItem('2l_all_orders', JSON.stringify(updated)); } catch {}
      return updated;
    });
    setUser((prev) => ({
      ...prev,
      orders: prev.orders.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)),
    }));
    showToast(`Order #${orderId} status set to "${newStatus}"`, 'info');
    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        // View & Navigation
        activeView,
        setActiveView,
        navigateTo,
        navigateToSection,
        selectedProduct,
        setSelectedProduct,
        activeAccountTab,
        setActiveAccountTab,

        // Host Authorization & Custom Security Key Management
        isHostAuthenticated,
        hostUsername,
        hostPassword,
        hostHint,
        updateHostCredentials,
        hostPasskey,
        hostPasskeyHint,
        showAutoFill,
        updateHostSecurity,
        hostLogin,
        hostLogout,

        // Catalog filters
        catalogFilters,
        setCatalogFilters,
        gridColumns,
        setGridColumns,

        // Cart
        cart,
        cartItemsCount,
        cartSubtotal,
        cartGrandTotal,
        discountAmount,
        standardShippingCost,
        estimatedTax,
        freeShippingThreshold,
        isEligibleFreeShipping,
        appliedPromo,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,

        // Wishlist
        wishlist,
        toggleWishlist,
        isWishlisted,
        moveWishlistToCart,

        // Modals
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        lastPlacedOrder,
        shopLookPost,
        setShopLookPost,
        activePolicyModal,
        setActivePolicyModal,

        // User & Orders
        isUserLoggedIn,
        setIsUserLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        loginUser,
        registerUser,
        logoutUser,
        user,
        updateUserProfile,
        addSavedAddress,
        editSavedAddress,
        deleteSavedAddress,
        setDefaultSavedAddress,
        placeOrder,

        // Live Products Administration
        products,
        setProducts,
        addProduct,
        bulkAddProducts,
        updateProduct,
        deleteProduct,

        // Customer & Website Issue Problem Management
        issues,
        setIssues,
        addIssue,
        updateIssueStatus,
        deleteIssue,

        // Order Administration
        allOrders,
        setAllOrders,
        updateOrderStatus,

        // Currency
        currency,
        setCurrency,
        formatPrice,

        // Toast
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
