'use client';

import { useState, useCallback } from 'react';
import { Header, MobileMenu } from '@/components/ecommerce/header';
import { HeroSlider } from '@/components/ecommerce/hero-slider';
import { DealTabs } from '@/components/ecommerce/deal-tabs';
import { CategorySection } from '@/components/ecommerce/category-section';
import { CategorySidebar, PromotionSidebar } from '@/components/ecommerce/sidebars';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';
import {
  phoneProducts,
  tabletProducts,
  laptopProducts,
  tvProducts,
  applianceProducts,
} from '@/lib/mock-data';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';

export default function HomePage() {
  const cartCount = useCartStore((state) => state.getTotalItems());
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const signOut = useAuthStore((state) => state.signOut);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddToCart = useCallback((product) => {
    // In a real app, this would add to cart state/store
    console.log('Đã thêm vào giỏ hàng:', product.name);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        user={user}
        openAuthModal={openAuthModal}
        onSignOut={() => { signOut(); clearCart(); }}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        {/* 3-Column Grid Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Categories */}
          <CategorySidebar />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Hero Banner Slider */}
            <HeroSlider />

            {/* Today's Deals with Tabs */}
            <DealTabs onAddToCart={handleAddToCart} />

            {/* Category Sections */}
            <div className="space-y-10">
              <CategorySection
                title="Điện thoại bán chạy"
                slug="dien-thoai"
                products={phoneProducts}
                onAddToCart={handleAddToCart}
              />

              <CategorySection
                title="Máy tính bảng nổi bật"
                slug="may-tinh-bang"
                products={tabletProducts}
                onAddToCart={handleAddToCart}
              />

              <CategorySection
                title="Laptop & PC"
                slug="laptop-pc"
                products={laptopProducts}
                onAddToCart={handleAddToCart}
              />

              <CategorySection
                title="Tivi giá tốt"
                slug="tivi"
                products={tvProducts}
                onAddToCart={handleAddToCart}
              />

              <CategorySection
                title="Đồ gia dụng thông minh"
                slug="do-gia-dung"
                products={applianceProducts}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* Right Sidebar - Promotions */}
          <PromotionSidebar />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
}
