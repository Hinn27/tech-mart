'use client';

import { useState } from 'react';
import { ProductCard, ProductCardSkeleton } from './product-card';
import { formatPrice } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  PackageX,
  RotateCcw,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PRODUCTS_PER_PAGE = 12;

export function ProductGrid({
  products,
  categoryTitle,
  isLoading = false,
  onClearFilters,
  onAddToCart,
}) {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'popular':
        return b.reviewCount - a.reviewCount;
      case 'newest':
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state - Skeleton Loaders
  if (isLoading) {
    return (
      <div className="space-y-6">
        <TopBar
          title={categoryTitle}
          count={0}
          viewMode={viewMode}
          sortBy={sortBy}
          onViewModeChange={setViewMode}
          onSortChange={setSortBy}
          isLoading
        />
        {/* Skeleton Grid - Hiệu ứng nhấp nháy xám */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state - Trạng thái rỗng
  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <TopBar
          title={categoryTitle}
          count={0}
          viewMode={viewMode}
          sortBy={sortBy}
          onViewModeChange={setViewMode}
          onSortChange={setSortBy}
        />
        <EmptyState onClearFilters={onClearFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TopBar
        title={categoryTitle}
        count={products.length}
        viewMode={viewMode}
        sortBy={sortBy}
        onViewModeChange={setViewMode}
        onSortChange={setSortBy}
      />

      {/* Product Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}

      {/* Pagination - MUI-style ở giữa màn hình */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

// ============================================
// Top Bar Component
// ============================================
function TopBar({
  title,
  count,
  viewMode,
  sortBy,
  onViewModeChange,
  onSortChange,
  isLoading,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
      {/* Tiêu đề danh mục + Số lượng kết quả */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {isLoading ? (
          <div className="h-4 w-36 bg-muted animate-pulse rounded mt-1.5" />
        ) : (
          <p className="text-sm text-muted-foreground mt-1">
            Tìm thấy <span className="font-semibold text-foreground">{count.toLocaleString('vi-VN')}</span> sản phẩm
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Dropdown Sắp xếp */}
        <Select value={sortBy} onValueChange={(v) => onSortChange(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
            <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
            <SelectItem value="popular">Phổ biến nhất</SelectItem>
          </SelectContent>
        </Select>

        {/* Toggle chế độ xem: Lưới / Danh sách */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-none h-9 w-9 transition-colors',
              viewMode === 'grid'
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'hover:bg-muted'
            )}
            onClick={() => onViewModeChange('grid')}
            title="Xem dạng lưới"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-none h-9 w-9 transition-colors',
              viewMode === 'list'
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'hover:bg-muted'
            )}
            onClick={() => onViewModeChange('list')}
            title="Xem dạng danh sách"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Product List Item (for list view)
// ============================================
function ProductListItem({
  product,
  onAddToCart,
}) {
  const productHref = `/${product.category}/${product.id}`;

  const badgeStyles = {
    new: 'bg-success text-success-foreground',
    sale: 'bg-destructive text-destructive-foreground',
    hot: 'bg-accent text-accent-foreground',
  };

  const badgeLabels = {
    new: 'Mới',
    sale: `-${product.discount}%`,
    hot: 'Hot',
  };

  return (
    <div className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-lg transition-all card-shadow">
      {/* Image */}
      <a
        href={productHref}
        className="relative w-36 h-36 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {product.badge && (
          <span
            className={cn(
              'absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs font-semibold',
              badgeStyles[product.badge]
            )}
          >
            {badgeLabels[product.badge]}
          </span>
        )}
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.name || product.title || 'Sản phẩm'}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </a>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <a
          href={productHref}
          className="font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors"
        >
          {product.name}
        </a>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-muted text-muted'
              )}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviewCount.toLocaleString('vi-VN')} đánh giá)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-bold text-destructive">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock + Add to Cart */}
        <div className="flex items-center gap-3 mt-auto pt-3">
          {product.inStock ? (
            <span className="text-xs text-success font-semibold bg-success/10 px-2 py-0.5 rounded">
              Còn hàng
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Hết hàng</span>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            size="sm"
            className="ml-auto gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!product.inStock}
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Empty State Component
// ============================================
function EmptyState({ onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Hình minh họa giỏ hàng trống */}
      <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center mb-6 relative">
        <PackageX className="h-14 w-14 text-muted-foreground" />
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-destructive text-xs font-bold">!</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">
        Không tìm thấy sản phẩm phù hợp
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed">
        Không có sản phẩm nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc hoặc bỏ chọn để xem thêm sản phẩm.
      </p>

      {onClearFilters && (
        <Button onClick={onClearFilters} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <RotateCcw className="h-4 w-4" />
          Bỏ lọc
        </Button>
      )}
    </div>
  );
}

// ============================================
// Pagination Component - MUI-style
// ============================================
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10 py-4"
      aria-label="Phân trang"
    >
      {/* Nút về trang đầu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="h-9 w-9 text-muted-foreground"
        aria-label="Về trang đầu"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Nút trang trước */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 text-muted-foreground"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Số trang */}
      {getPageNumbers().map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-muted-foreground select-none"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onPageChange(page)}
            className={cn(
              'h-9 w-9 text-sm font-medium',
              currentPage === page
                ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm'
                : 'text-foreground hover:bg-muted'
            )}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        )
      )}

      {/* Nút trang sau */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 text-muted-foreground"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Nút về trang cuối */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 text-muted-foreground"
        aria-label="Về trang cuối"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
