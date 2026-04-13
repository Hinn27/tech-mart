'use client';

import { useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/mock-data';
import useCartStore from '@/store/cartStore';

export function ProductCard({ product, onAddToCart }) {
  const [isLiked, setIsLiked] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  // Xây dựng URL đúng theo danh mục
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

  const discountPercent = product.discount || 0;
  const savingsAmount = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden',
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
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.name || product.title || 'Sản phẩm'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-300" />
      </a>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <a
          href={productHref}
          className="font-medium text-foreground text-sm leading-snug line-clamp-2 hover:text-accent transition-colors mb-2"
          title={product.name}
        >
          {product.name}
        </a>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3 w-3',
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount.toLocaleString('vi-VN')})
          </span>
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
