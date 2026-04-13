'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header, MobileMenu } from '@/components/ecommerce/header';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { FilterSidebar } from '@/components/ecommerce/filter-sidebar';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { ProductCardSkeleton } from '@/components/ecommerce/product-card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  categories,
  phoneProducts,
  tabletProducts,
  laptopProducts,
  tvProducts,
  applianceProducts,
} from '@/lib/mock-data';

// Map slug to products
const productMap = {
  'dien-thoai': phoneProducts,
  'may-tinh-bang': tabletProducts,
  'laptop-pc': laptopProducts,
  'tivi': tvProducts,
  'do-gia-dung': applianceProducts,
};

// Generate more products for demo
function generateMoreProducts(baseProducts, multiplier = 3) {
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

export default function CategoryPage({ params }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const [cartCount, setCartCount] = useState(2);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [resolvedParams]);

  // Parse URL segments
  const slugSegments = resolvedParams?.slug || ['dien-thoai'];
  const mainCategory = slugSegments[0];
  const subCategory = slugSegments[1];

  // Get category info
  const categoryInfo = categories.find((c) => c.slug === mainCategory);
  const subCategoryInfo = categoryInfo?.subcategories?.find(
    (s) => s.slug === subCategory
  );

  // Get products
  const baseProducts = productMap[mainCategory] || phoneProducts;
  const allProducts = useMemo(
    () => generateMoreProducts(baseProducts, 5),
    [baseProducts]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Price filter
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Brand filter (mock - check if name contains brand)
      if (filters.brands.length > 0) {
        const hasMatchingBrand = filters.brands.some((brand) =>
          product.name.toLowerCase().includes(brand.toLowerCase())
        );
        if (!hasMatchingBrand) return false;
      }

      // RAM filter (mock)
      if (filters.ram.length > 0) {
        const hasMatchingRam = filters.ram.some((ram) =>
          product.name.includes(ram)
        );
        if (!hasMatchingRam) return false;
      }

      // Storage filter (mock)
      if (filters.storage.length > 0) {
        const hasMatchingStorage = filters.storage.some((storage) =>
          product.name.includes(storage)
        );
        if (!hasMatchingStorage) return false;
      }

      return true;
    });
  }, [allProducts, filters]);

  // Build breadcrumbs
  const breadcrumbs = [
    { label: categoryInfo?.name || 'Danh mục', href: `/danh-muc/${mainCategory}` },
  ];
  if (subCategoryInfo) {
    breadcrumbs.push({ label: subCategoryInfo.name });
  }

  // Page title
  const pageTitle = subCategoryInfo?.name || categoryInfo?.name || 'Sản phẩm';

  // Clear filters
  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  // Close filter drawer on ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsFilterDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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

        {/* Main Content */}
        <div className="mx-auto max-w-[1400px] px-4 py-6">
          <div className="flex gap-6">
            {/* Filter Sidebar - Desktop */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="sticky top-20">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ lọc
                  {(filters.brands.length > 0 ||
                    filters.ram.length > 0 ||
                    filters.storage.length > 0) && (
                    <span className="ml-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                      {filters.brands.length +
                        filters.ram.length +
                        filters.storage.length}
                    </span>
                  )}
                </Button>
              </div>

              <ProductGrid
                products={filteredProducts}
                categoryTitle={pageTitle}
                isLoading={isLoading}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[320px] max-w-full bg-card border-l border-border shadow-xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
              <span className="font-bold text-lg">Bộ lọc</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFilterDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
        </div>
      )}

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
