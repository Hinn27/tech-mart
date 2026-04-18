'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

export function ProductCard({ product, onAddToCart }) {
  const [isLiked, setIsLiked] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  // Xây dựng URL đúng theo danh mục
  const productHref = `/${product.category || 'dien-thoai'}/${product.slug || product.id}`;

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

  const discountPercent = product.discount || 0;
  const savingsAmount = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden h-full',
        'transition-all duration-300 cursor-pointer',
        'hover:-translate-y-1 hover:shadow-xl',
        'dark:hover:shadow-none dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]'
      )}
    >
      {/* Nhãn giảm giá đỏ - Badge */}
      {product.badge && (
        <span
          className={cn(
            'absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm',
            badgeStyles[product.badge]
          )}
        >
          {badgeLabels[product.badge]}
        </span>
      )}

      {/* Nút icon trái tim - Wishlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className={cn(
          'absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200',
          'bg-background/70 dark:bg-card/70',
          'hover:bg-background dark:hover:bg-card hover:scale-110',
          'shadow-sm',
          isLiked && 'text-destructive bg-destructive/10'
        )}
        title={isLiked ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        aria-label={isLiked ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        <Heart className={cn('h-4 w-4 transition-all', isLiked && 'fill-current')} />
      </button>

      {/* Product Image */}
      <a
        href={productHref}
        className="relative aspect-square overflow-hidden flex items-center justify-center p-2"
      >
        <img
          src={product.image || '/placeholder-logo.png'}
          alt={product.title || product.name || 'Sản phẩm'}
          className="w-full aspect-square object-contain p-2 bg-white"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-logo.png';
          }}
        />
      </a>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <div>
          {/* Title */}
          <a
            href={productHref}
            className="font-medium text-foreground text-sm leading-snug line-clamp-2 hover:text-accent transition-colors mb-2"
            title={product.name || product.title}
          >
            {product.name || product.title}
          </a>

          {/* Rating */}
          <div className="flex items-center text-sm mt-1">
            <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating))}</span>
            <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
            <span className="text-gray-500 ml-2">({product.reviewCount})</span>
          </div>

          {/* Specs Badges */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.values(product.specs).slice(0, 2).map((val, idx) => (
                <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded border">{val}</span>
              ))}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="mt-auto space-y-1.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-destructive">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Savings info */}
          {savingsAmount > 0 && (
            <p className="text-xs text-success font-medium">
              Tiết kiệm {formatPrice(savingsAmount)}
            </p>
          )}

          {/* Stock Status */}
          {product.inStock ? (
            <span className="text-xs text-success font-semibold inline-block bg-success/10 px-2 py-0.5 rounded">
              Còn hàng
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Hết hàng</span>
          )}
        </div>

        {/* Nút Thêm vào giỏ - Ẩn/hiện khi hover */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              openAuthModal();
              return;
            }
            addToCart(product, 1);
            onAddToCart?.(product);
          }}
          className={cn(
            'mt-3 w-full gap-2 text-sm font-medium',
            'bg-accent hover:bg-accent/90 text-accent-foreground',
            'transition-all duration-300',
            // Desktop: ẩn trên, hiện khi hover
            'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0',
            // Mobile: luôn hiển thị
            'md:opacity-0 md:group-hover:opacity-100',
            'max-md:opacity-100 max-md:translate-y-0'
          )}
          disabled={!product.inStock}
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Skeleton for loading state - Hiệu ứng nhấp nháy xám
// ============================================
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-card border border-border overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse-shimmer" />
      </div>

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Title lines */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
          <div className="h-4 bg-muted rounded-md w-3/4 animate-pulse" />
        </div>

        {/* Rating stars */}
        <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-muted rounded animate-pulse" />
          ))}
          <div className="h-3 w-12 bg-muted rounded ml-1 animate-pulse" />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <div className="h-5 bg-muted rounded-md w-1/2 animate-pulse" />
          <div className="h-3 bg-muted rounded-md w-1/3 animate-pulse" />
        </div>

        {/* Add to cart button placeholder */}
        <div className="h-9 bg-muted rounded-lg w-full animate-pulse" />
      </div>
    </div>
  );
}
