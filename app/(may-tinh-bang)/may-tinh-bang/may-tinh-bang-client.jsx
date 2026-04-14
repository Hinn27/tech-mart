'use client';

import { useState, useCallback, useMemo } from 'react';
import { Header, MobileMenu } from '@/components/ecommerce/header';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';
import { formatPrice } from '@/lib/mock-data';
import useCartStore from '@/store/cartStore';

const ACCENT = '#7C3AED';

export default function DienThoaiClient({ products = [] }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1);
  }, [addToCart]);

  // Lọc theo thương hiệu
  const brands = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Apple', name: 'Apple (iPhone)' },
    { id: 'Samsung', name: 'Samsung' },
    { id: 'Xiaomi', name: 'Xiaomi' },
  ];

  // Lọc và sắp xếp sản phẩm
  const sortedProducts = useMemo(() => {
    let filtered = [...products];

    // Lọc thương hiệu
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((product) => {
        const name = (product.name || '').toLowerCase();
        if (selectedBrand === 'Apple') return name.includes('iphone') || name.includes('apple');
        if (selectedBrand === 'Samsung') return name.includes('samsung') || name.includes('galaxy');
        if (selectedBrand === 'Xiaomi') return name.includes('xiaomi');
        return true;
      });
    }

    // Lọc theo giá
    if (priceRange === 'under10') filtered = filtered.filter((p) => p.price < 10000000);
    if (priceRange === '10to20') filtered = filtered.filter((p) => p.price >= 10000000 && p.price <= 20000000);
    if (priceRange === '20to30') filtered = filtered.filter((p) => p.price > 20000000 && p.price <= 30000000);
    if (priceRange === 'over30') filtered = filtered.filter((p) => p.price > 30000000);

    // Sắp xếp
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popular') return (b.review_count || 0) - (a.review_count || 0);
      return 0;
    });

    return filtered;
  }, [products, selectedBrand, priceRange, sortBy]);

  const breadcrumbItems = [{ label: 'Điện thoại', href: '/dien-thoai' }];

  // Empty state khi không có sản phẩm
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="mx-auto max-w-[1400px] px-4 py-20 text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">Đang tải dữ liệu...</p>
            <p className="text-sm">Hoặc hiện chưa có sản phẩm nào trong danh mục này.</p>
          </div>
        </main>
        <Footer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="mx-auto max-w-[1400px] px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        {/* Hero Banner Điện thoại */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 aspect-[3/1] md:aspect-[4/1]"
          style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #1E40AF 50%, #1E3A8A 100%)` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/15" />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 text-white">
            <p className="text-sm md:text-base font-medium opacity-90 mb-1">
              Bộ sưu tập smartphone mới nhất 2024
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-balance">
              Điện Thoại Chính Hãng
            </h1>
            <p className="text-sm md:text-base opacity-80 mt-2 max-w-lg hidden sm:block">
              iPad Pro M4, Galaxy Tab S9 Ultra, Xiaomi Pad 6S Pro — Giá tốt nhất, bảo hành chính hãng, giao hàng nhanh toàn quốc.
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Bộ lọc */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <div className="sticky top-20 space-y-5">
              {/* Bộ lọc thương hiệu */}
              <div className="rounded-xl bg-card border border-border p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4" style={{ color: ACCENT }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Thương hiệu
                </h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand.id}
                        onChange={() => setSelectedBrand(brand.id)}
                        className="sr-only"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedBrand === brand.id
                            ? 'border-[#7C3AED]'
                            : 'border-border group-hover:border-muted-foreground/50'
                        }`}
                      >
                        {selectedBrand === brand.id && (
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                        )}
                      </div>
                      <span className="text-sm text-foreground">{brand.name}</span>
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
                    { id: 'under10', name: `Dưới ${formatPrice(10000000)}` },
                    { id: '10to20', name: `${formatPrice(10000000)} - ${formatPrice(20000000)}` },
                    { id: '20to30', name: `${formatPrice(20000000)} - ${formatPrice(30000000)}` },
                    { id: 'over30', name: `Trên ${formatPrice(30000000)}` },
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
                            ? 'border-[#7C3AED]'
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

              {(selectedBrand !== 'all' || priceRange !== 'all') && (
                <button
                  onClick={() => { setSelectedBrand('all'); setPriceRange('all'); }}
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
                Điện thoại ({sortedProducts.length} sản phẩm)
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
                  <h4 className="text-sm font-semibold text-foreground mb-2">Thương hiệu</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedBrand === brand.id
                            ? 'text-white border-[#7C3AED]'
                            : 'border-border text-foreground hover:border-[#7C3AED]/50'
                        }`}
                        style={selectedBrand === brand.id ? { backgroundColor: ACCENT } : {}}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Khoảng giá</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', name: 'Tất cả' },
                      { id: 'under10', name: 'Dưới 10Tr' },
                      { id: '10to20', name: '10Tr - 20Tr' },
                      { id: '20to30', name: '20Tr - 30Tr' },
                      { id: 'over30', name: 'Trên 30Tr' },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setPriceRange(range.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          priceRange === range.id
                            ? 'text-white border-[#7C3AED]'
                            : 'border-border text-foreground hover:border-[#7C3AED]/50'
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
                            ? 'text-white border-[#7C3AED]'
                            : 'border-border text-foreground hover:border-[#7C3AED]/50'
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
              categoryTitle="Điện thoại"
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
      <AuthModal />
    </div>
  );
}
