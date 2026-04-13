'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header, MobileMenu } from '@/components/ecommerce/header';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { FilterSidebar } from '@/components/ecommerce/filter-sidebar';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import {
  phoneProducts,
  tabletProducts,
  laptopProducts,
  tvProducts,
  applianceProducts,
  categories,
} from '@/lib/mock-data';

// Map category slugs to products
const productMap = {
  'dien-thoai': phoneProducts,
  'may-tinh-bang': tabletProducts,
  'laptop-pc': laptopProducts,
  'tivi': tvProducts,
  'do-gia-dung': applianceProducts,
};

// Generate expanded product catalog for realistic pagination
function generateExpandedProducts(baseProducts, multiplier = 5) {
  const result = [];
  for (let i = 0; i < multiplier; i++) {
    baseProducts.forEach((product, index) => {
      result.push({
        ...product,
        id: `${product.id}-${i}-${index}`,
      });
    });
  }
  return result;
}

const defaultFilters = {
  priceRange: [0, 100000000],
  brands: [],
  ram: [],
  storage: [],
};

export default function ProductListingPage() {
  const [cartCount, setCartCount] = useState(2);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCategory, setSelectedCategory] = useState('dien-thoai');
  const [selectedBrand, setSelectedBrand] = useState('apple');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Re-simulate loading when category changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedBrand]);

  // Get base products for selected category
  const baseProducts = productMap[selectedCategory] || phoneProducts;
  const allProducts = useMemo(
    () => generateExpandedProducts(baseProducts, 5),
    [baseProducts]
  );

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Price filter
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0) {
        const hasMatchingBrand = filters.brands.some((brand) =>
          product.name.toLowerCase().includes(brand.toLowerCase())
        );
        if (!hasMatchingBrand) return false;
      }

      // RAM filter
      if (filters.ram.length > 0) {
        const hasMatchingRam = filters.ram.some((ram) =>
          product.name.includes(ram)
        );
        if (!hasMatchingRam) return false;
      }

      // Storage filter
      if (filters.storage.length > 0) {
        const hasMatchingStorage = filters.storage.some((storage) =>
          product.name.includes(storage)
        );
        if (!hasMatchingStorage) return false;
      }

      return true;
    });
  }, [allProducts, filters]);

  // Build breadcrumbs based on selection
  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
  ];
  const categoryInfo = categories.find((c) => c.slug === selectedCategory);
  if (categoryInfo) {
    breadcrumbs.push({ label: categoryInfo.name, href: `/danh-muc/${selectedCategory}` });
  }
  const brandLabel = selectedBrand === 'all' ? 'Tất cả' : selectedBrand.charAt(0).toUpperCase() + selectedBrand.slice(1);
  breadcrumbs.push({ label: brandLabel });

  // Page title
  const categoryTitle = categoryInfo?.name || 'Sản phẩm';
  const pageTitle = selectedBrand === 'all'
    ? categoryTitle
    : `${categoryTitle} ${selectedBrand.charAt(0).toUpperCase() + selectedBrand.slice(1)}`;

  // Clear filters handler
  const handleClearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Add to cart handler
  const handleAddToCart = useCallback((_product) => {
    setCartCount((prev) => prev + 1);
  }, []);

  // Handle category change
  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    setSelectedBrand('all');
    setFilters(defaultFilters);
  };

  // Available brands for current category
  const availableBrands = useMemo(() => {
    const brands = new Set();
    baseProducts.forEach((p) => {
      const name = p.name.toLowerCase();
      if (name.includes('apple') || name.includes('iphone') || name.includes('macbook') || name.includes('ipad')) brands.add('Apple');
      if (name.includes('samsung') || name.includes('galaxy')) brands.add('Samsung');
      if (name.includes('xiaomi')) brands.add('Xiaomi');
      if (name.includes('oppo')) brands.add('OPPO');
      if (name.includes('honor')) brands.add('Honor');
      if (name.includes('huawei')) brands.add('Huawei');
      if (name.includes('lg')) brands.add('LG');
      if (name.includes('sony')) brands.add('Sony');
      if (name.includes('tcl')) brands.add('TCL');
      if (name.includes('dell')) brands.add('Dell');
      if (name.includes('asus') || name.includes('rog')) brands.add('ASUS');
      if (name.includes('lenovo')) brands.add('Lenovo');
      if (name.includes('philips')) brands.add('Philips');
      if (name.includes('dyson')) brands.add('Dyson');
      if (name.includes('roborock')) brands.add('Roborock');
    });
    return Array.from(brands);
  }, [baseProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        cartCount={cartCount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-card border-b border-border">
          <div className="mx-auto max-w-[1400px] px-4 py-3">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Category Quick Nav */}
        <div className="bg-card border-b border-border">
          <div className="mx-auto max-w-[1400px] px-4 py-3">
            <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar" aria-label="Danh mục sản phẩm">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.slug
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-[1400px] px-4 py-6">
          <div className="flex gap-6">
            {/* Filter Sidebar - Desktop (25%) */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="sticky top-20">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearFilters={handleClearFilters}
                  availableBrands={availableBrands}
                />
              </div>
            </aside>

            {/* Products Area (75%) */}
            <div className="flex-1 min-w-0">
              <ProductGrid
                products={filteredProducts}
                categoryTitle={pageTitle}
                isLoading={isLoading}
                onClearFilters={handleClearFilters}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
