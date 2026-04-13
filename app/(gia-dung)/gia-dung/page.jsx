'use client';

import { useState, useCallback } from 'react';
import { Header, MobileMenu } from '@/components/ecommerce/header';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';
import { applianceProducts, formatPrice } from '@/lib/mock-data';

const ACCENT = '#10B981';

export default function GiaDungPage() {
  const [cartCount, setCartCount] = useState(2);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const handleAddToCart = useCallback((product) => {
    setCartCount((prev) => prev + 1);
    console.log('Đã thêm vào giỏ hàng:', product.name);
  }, []);

  // Lọc theo loại sản phẩm
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'hut-bui', name: 'Máy hút bụi' },
    { id: 'loc-khong-khi', name: 'Máy lọc không khí' },
    { id: 'robot', name: 'Robot hút bụi' },
    { id: 'nau-an', name: 'Thiết bị nhà bếp' },
  ];

  const filteredProducts = applianceProducts.filter((product) => {
    if (selectedCategory !== 'all') {
      const name = product.name.toLowerCase();
      let matches = false;
      if (selectedCategory === 'hut-bui') matches = name.includes('hút bụi') || name.includes('dyson');
      if (selectedCategory === 'loc-khong-khi') matches = name.includes('lọc không khí') || name.includes('purifier');
      if (selectedCategory === 'robot') matches = name.includes('robot');
      if (selectedCategory === 'nau-an') matches = name.includes('nồi chiên') || name.includes('air fryer');
      if (!matches) return false;
    }

    if (priceRange === 'under5') return product.price < 5000000;
    if (priceRange === '5to15') return product.price >= 5000000 && product.price <= 15000000;
    if (priceRange === '15to25') return product.price > 15000000 && product.price <= 25000000;
    if (priceRange === 'over25') return product.price > 25000000;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
    return 0;
  });

  const breadcrumbItems = [{ label: 'Đồ gia dụng', href: '/gia-dung' }];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        cartCount={cartCount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="mx-auto max-w-[1400px] px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        {/* Hero Banner */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 aspect-[3/1] md:aspect-[4/1]"
          style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #059669 50%, #047857 100%)` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/15" />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 text-white">
            <p className="text-sm md:text-base font-medium opacity-90 mb-1">
              Đồ gia dụng thông minh — Tiện nghi cho mọi gia đình
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-balance">
              Gia Dụng & Thiết Bị Nhà Thông Minh
            </h1>
            <p className="text-sm md:text-base opacity-80 mt-2 max-w-lg hidden sm:block">
              Dyson V15, Roborock S8 Pro, Philips Air Purifier, Xiaomi Air Fryer — Giá tốt nhất, bảo hành chính hãng.
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Bộ lọc */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-20 space-y-5">
              {/* Bộ lọc loại sản phẩm */}
              <div className="rounded-xl bg-card border border-border p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4" style={{ color: ACCENT }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Loại sản phẩm
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="sr-only"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedCategory === cat.id
                            ? 'border-[#10B981]'
                            : 'border-border group-hover:border-muted-foreground/50'
                        }`}
                      >
                        {selectedCategory === cat.id && (
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                        )}
                      </div>
                      <span className="text-sm text-foreground">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bộ lọc khoảng giá */}
              <div className="rounded-xl bg-card border border-border p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4" style={{ color: ACCENT }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Khoảng giá
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', name: 'Tất cả' },
                    { id: 'under5', name: `Dưới ${formatPrice(5000000)}` },
                    { id: '5to15', name: `${formatPrice(5000000)} - ${formatPrice(15000000)}` },
                    { id: '15to25', name: `${formatPrice(15000000)} - ${formatPrice(25000000)}` },
                    { id: 'over25', name: `Trên ${formatPrice(25000000)}` },
                  ].map((range) => (
                    <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === range.id}
                        onChange={() => setPriceRange(range.id)}
                        className="sr-only"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          priceRange === range.id
                            ? 'border-[#10B981]'
                            : 'border-border group-hover:border-muted-foreground/50'
                        }`}
                      >
                        {priceRange === range.id && (
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                        )}
                      </div>
                      <span className="text-sm text-foreground">{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(selectedCategory !== 'all' || priceRange !== 'all') && (
                <button
                  onClick={() => { setSelectedCategory('all'); setPriceRange('all'); }}
                  className="w-full text-sm font-medium hover:underline"
                  style={{ color: ACCENT }}
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </aside>

          {/* Danh sách sản phẩm */}
          <div className="flex-1 min-w-0">
            {/* Bộ lọc mobile toggle */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="text-lg font-bold text-foreground">
                Đồ gia dụng ({sortedProducts.length} sản phẩm)
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border border-border bg-card"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Bộ lọc
              </button>
            </div>

            {/* Bộ lọc mobile drawer */}
            {showFilters && (
              <div className="lg:hidden mb-4 rounded-xl bg-card border border-border p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Loại sản phẩm</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedCategory === cat.id
                            ? 'text-white border-[#10B981]'
                            : 'border-border text-foreground hover:border-[#10B981]/50'
                        }`}
                        style={selectedCategory === cat.id ? { backgroundColor: ACCENT } : {}}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Khoảng giá</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', name: 'Tất cả' },
                      { id: 'under5', name: 'Dưới 5Tr' },
                      { id: '5to15', name: '5Tr - 15Tr' },
                      { id: '15to25', name: '15Tr - 25Tr' },
                      { id: 'over25', name: 'Trên 25Tr' },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setPriceRange(range.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          priceRange === range.id
                            ? 'text-white border-[#10B981]'
                            : 'border-border text-foreground hover:border-[#10B981]/50'
                        }`}
                        style={priceRange === range.id ? { backgroundColor: ACCENT } : {}}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Sắp xếp</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'popular', name: 'Phổ biến' },
                      { id: 'price-asc', name: 'Giá tăng' },
                      { id: 'price-desc', name: 'Giá giảm' },
                      { id: 'rating', name: 'Đánh giá' },
                    ].map((sort) => (
                      <button
                        key={sort.id}
                        onClick={() => setSortBy(sort.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          sortBy === sort.id
                            ? 'text-white border-[#10B981]'
                            : 'border-border text-foreground hover:border-[#10B981]/50'
                        }`}
                        style={sortBy === sort.id ? { backgroundColor: ACCENT } : {}}
                      >
                        {sort.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={sortedProducts}
              categoryTitle="Đồ gia dụng"
              onAddToCart={handleAddToCart}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
