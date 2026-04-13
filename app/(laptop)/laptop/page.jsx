'use client';

import { useState, useCallback } from 'react';
import { Header, MobileMenu } from '@/components/ecommerce/header';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';
import { laptopProducts, formatPrice } from '@/lib/mock-data';

const ACCENT = '#FF5722';

export default function LaptopPage() {
  const [cartCount, setCartCount] = useState(2);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const handleAddToCart = useCallback((product) => {
    setCartCount((prev) => prev + 1);
    console.log('Đã thêm vào giỏ hàng:', product.name);
  }, []);

  // Lọc theo thương hiệu
  const brands = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Apple', name: 'Apple (MacBook)' },
    { id: 'ASUS', name: 'ASUS (ROG)' },
    { id: 'Dell', name: 'Dell (XPS)' },
    { id: 'Lenovo', name: 'Lenovo (Legion)' },
  ];

  const filteredProducts = laptopProducts.filter((product) => {
    if (selectedBrand !== 'all') {
      const matchesBrand =
        (selectedBrand === 'Apple' && product.name.includes('MacBook')) ||
        (selectedBrand === 'ASUS' && product.name.includes('ASUS')) ||
        (selectedBrand === 'Dell' && product.name.includes('Dell')) ||
        (selectedBrand === 'Lenovo' && product.name.includes('Lenovo'));
      if (!matchesBrand) return false;
    }

    if (priceRange === 'under40') return product.price < 40000000;
    if (priceRange === '40to60') return product.price >= 40000000 && product.price <= 60000000;
    if (priceRange === '60to80') return product.price > 60000000 && product.price <= 80000000;
    if (priceRange === 'over80') return product.price > 80000000;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
    return 0;
  });

  const breadcrumbItems = [{ label: 'Laptop & PC', href: '/laptop' }];

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
          style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #E64A19 50%, #D84315 100%)` }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/15" />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 text-white">
            <p className="text-sm md:text-base font-medium opacity-90 mb-1">
              Laptop & PC — Hiệu năng đỉnh cao cho mọi nhu cầu
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-balance">
              Laptop & Máy Tính Để Bàn
            </h1>
            <p className="text-sm md:text-base opacity-80 mt-2 max-w-lg hidden sm:block">
              MacBook Pro M3, Dell XPS 15, ASUS ROG Strix, Lenovo Legion — Giá tốt nhất, trả góp 0%, giao hàng toàn quốc.
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
                            ? 'border-[#FF5722]'
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
                    { id: 'under40', name: `Dưới ${formatPrice(40000000)}` },
                    { id: '40to60', name: `${formatPrice(40000000)} - ${formatPrice(60000000)}` },
                    { id: '60to80', name: `${formatPrice(60000000)} - ${formatPrice(80000000)}` },
                    { id: 'over80', name: `Trên ${formatPrice(80000000)}` },
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
                            ? 'border-[#FF5722]'
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
                Laptop & PC ({sortedProducts.length} sản phẩm)
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
                            ? 'text-white border-[#FF5722]'
                            : 'border-border text-foreground hover:border-[#FF5722]/50'
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
                      { id: 'under40', name: 'Dưới 40Tr' },
                      { id: '40to60', name: '40Tr - 60Tr' },
                      { id: '60to80', name: '60Tr - 80Tr' },
                      { id: 'over80', name: 'Trên 80Tr' },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setPriceRange(range.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          priceRange === range.id
                            ? 'text-white border-[#FF5722]'
                            : 'border-border text-foreground hover:border-[#FF5722]/50'
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
                            ? 'text-white border-[#FF5722]'
                            : 'border-border text-foreground hover:border-[#FF5722]/50'
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
              categoryTitle="Laptop & PC"
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
