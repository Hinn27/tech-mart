'use client';

import { AuthModal } from '@/components/ecommerce/auth-modal';
import { CategorySection } from '@/components/ecommerce/category-section';
import { DealTabs } from '@/components/ecommerce/deal-tabs';
import { Footer } from '@/components/ecommerce/footer';
import { Header } from '@/components/ecommerce/header';
import { HeroSlider } from '@/components/ecommerce/hero-slider';
import { CategorySidebar, PromotionSidebar } from '@/components/ecommerce/sidebars';
import { ProductCardSkeleton } from '@/components/ecommerce/product-card';
import { getProductsByCategory } from '@/lib/productService';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { useCallback, useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const cartCount = useCartStore((state) => state.getTotalItems());
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const signOut = useAuthStore((state) => state.signOut);

  // Real data states
  const [phoneProducts, setPhoneProducts] = useState([]);
  const [tabletProducts, setTabletProducts] = useState([]);
  const [laptopProducts, setLaptopProducts] = useState([]);
  const [tvProducts, setTvProducts] = useState([]);
  const [applianceProducts, setApplianceProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Supabase
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const [phones, tablets, laptops, tvs, appliances] = await Promise.all([
          getProductsByCategory('dien-thoai'),
          getProductsByCategory('may-tinh-bang'),
          getProductsByCategory('laptop'),
          getProductsByCategory('tivi'),
          getProductsByCategory('gia-dung'),
        ]);

        setPhoneProducts(phones);
        setTabletProducts(tablets);
        setLaptopProducts(laptops);
        setTvProducts(tvs);
        setApplianceProducts(appliances);
      } catch (error) {
        console.error('[HomePage] Lỗi khi tải sản phẩm:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((product) => {
    console.log('Đã thêm vào giỏ hàng:', product.name);
  }, []);

  // Build deal tabs from real data
  const dealTabs = [
    { id: 'phone', name: 'Điện thoại', products: phoneProducts },
    { id: 'tablet', name: 'Máy tính bảng', products: tabletProducts },
    { id: 'laptop', name: 'Laptop & PC', products: laptopProducts },
    { id: 'tv', name: 'Tivi', products: tvProducts },
    { id: 'appliance', name: 'Đồ gia dụng', products: applianceProducts },
  ];

  // Loading skeleton grid
  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

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
            {isLoading ? (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Ưu đãi hôm nay</h2>
                <SkeletonGrid />
              </div>
            ) : (
              <DealTabs dealTabs={dealTabs} onAddToCart={handleAddToCart} />
            )}

            {/* Category Sections */}
            <div className="space-y-10">
              {isLoading ? (
                <>
                  {['Điện thoại bán chạy', 'Máy tính bảng nổi bật', 'Laptop & PC', 'Tivi giá tốt', 'Đồ gia dụng thông minh'].map((title) => (
                    <div key={title} className="space-y-4">
                      <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
                      <SkeletonGrid />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {phoneProducts.length > 0 && (
                    <CategorySection
                      title="Điện thoại bán chạy"
                      slug="dien-thoai"
                      products={phoneProducts}
                      onAddToCart={handleAddToCart}
                    />
                  )}

                  {tabletProducts.length > 0 && (
                    <CategorySection
                      title="Máy tính bảng nổi bật"
                      slug="may-tinh-bang"
                      products={tabletProducts}
                      onAddToCart={handleAddToCart}
                    />
                  )}

                  {laptopProducts.length > 0 && (
                    <CategorySection
                      title="Laptop & PC"
                      slug="laptop"
                      products={laptopProducts}
                      onAddToCart={handleAddToCart}
                    />
                  )}

                  {tvProducts.length > 0 && (
                    <CategorySection
                      title="Tivi giá tốt"
                      slug="tivi"
                      products={tvProducts}
                      onAddToCart={handleAddToCart}
                    />
                  )}

                  {applianceProducts.length > 0 && (
                    <CategorySection
                      title="Đồ gia dụng thông minh"
                      slug="gia-dung"
                      products={applianceProducts}
                      onAddToCart={handleAddToCart}
                    />
                  )}
                </>
              )}
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
