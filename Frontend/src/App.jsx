import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Marquee } from './components/common/Marquee';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { ShopLookModal } from './components/common/ShopLookModal';
import { PolicyModals } from './components/common/PolicyModals';
import { AuthModal } from './components/common/AuthModal';
import { Toast } from './components/common/Toast';

import { HomePage } from './components/home/HomePage';
import { CatalogPage } from './components/catalog/CatalogPage';
import { ProductDetailPage } from './components/pdp/ProductDetailPage';
import { AccountPage } from './components/account/AccountPage';
import { AdminPortal } from './components/admin/AdminPortal';

import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderSuccessModal } from './components/cart/OrderSuccessModal';

const AppContent = () => {
  const { activeView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#08080A] text-neutral-100 font-sans selection:bg-brand-accent selection:text-black">
      {/* 1. Global Announcement Marquee Bar */}
      <Marquee />

      {/* 1. Sticky Global Navigation Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'catalog' && <CatalogPage />}
        {activeView === 'pdp' && <ProductDetailPage />}
        {activeView === 'account' && <AccountPage />}
        {activeView === 'admin' && <AdminPortal />}
      </main>

      {/* 7. Professional Footer & Legal Sections */}
      <Footer />

      {/* Global Interactive Modals & Slide-out Drawers */}
      <QuickSearchModal />
      <SizeGuideModal />
      <ShopLookModal />
      <PolicyModals />
      <AuthModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
