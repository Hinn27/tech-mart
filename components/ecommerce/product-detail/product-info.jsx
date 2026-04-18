'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import { Check, Gift, Minus, Plus, ShoppingCart, Star, Zap } from 'lucide-react';
import { useState } from 'react';
import { ColorSelector, StorageSelector } from './variant-selector';

export function ProductInfo({
  product,
  selectedVariant,
  selectedColor,
  onVariantChange,
  onColorChange,
  onAddToCart,
  onBuyNow,
  user,
  openAuthModal,
}) {
  const [quantity, setQuantity] = useState(1);

  const discount = Math.round(
    ((selectedVariant.originalPrice - selectedVariant.price) /
      selectedVariant.originalPrice) *
      100
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ======================== */}
      {/* Tiêu đề H1 & Đánh giá sao vàng */}
      {/* ======================== */}
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl lg:text-[2rem] font-extrabold leading-tight text-foreground">
          {product.title || product.name} {selectedVariant.storage} — {selectedColor.name}
        </h1>

        {/* Số sao vàng + Số đánh giá */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sao vàng */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-5 w-5 transition-colors',
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                )}
              />
            ))}
            <span className="ml-2 text-base font-bold text-foreground">
              {product.rating}
            </span>
          </div>

          {/* Số đánh giá */}
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount.toLocaleString('vi-VN')} đánh giá)
          </span>

          {/* Đã bán */}
          <span className="text-sm text-muted-foreground">
            | Đã bán{' '}
            <span className="font-semibold text-foreground">
              {product.soldCount.toLocaleString('vi-VN')}
            </span>
          </span>
        </div>
      </div>

      {/* ======================== */}
      {/* Giá bán — Cụm giá nổi bật */}
      {/* ======================== */}
      <div className="flex items-baseline gap-3 flex-wrap p-4 rounded-xl bg-muted/40 border border-border">
        {/* Giá khuyến mãi — Đỏ to */}
        <span className="text-3xl md:text-4xl font-extrabold text-destructive tracking-tight">
          {formatPrice(selectedVariant.price)}
        </span>

        {/* Giá gốc — Xám gạch ngang */}
        <span className="text-lg text-muted-foreground line-through">
          {formatPrice(selectedVariant.originalPrice)}
        </span>

        {/* % Giảm */}
        <span className="px-2.5 py-1 rounded-md bg-destructive text-destructive-foreground text-sm font-bold">
          -{discount}%
        </span>
      </div>

      {/* ======================== */}
      {/* Variant Selectors — Bộ chọn Biến thể (Swatches, không Dropdown) */}
      {/* ======================== */}
      <div className="space-y-5">
        {/* Dung lượng — Button Group */}
        <StorageSelector
          variants={product.variants}
          selectedId={selectedVariant.id}
          onSelect={onVariantChange}
        />

        {/* Màu sắc — Color Swatches (Tròn có mã màu + dấu tick) */}
        <ColorSelector
          colors={product.colors}
          selectedId={selectedColor.id}
          onSelect={onColorChange}
        />
      </div>

      {/* ======================== */}
      {/* Khuyến mãi — Khối hộp viền đứt nét */}
      {/* ======================== */}
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/40 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Gift className="h-4.5 w-4.5 text-accent" />
          </div>
          <span className="font-bold text-base text-foreground">Ưu đãi khi mua hàng</span>
        </div>
        <ul className="space-y-3">
          {product.promotions.map((promo) => (
            <li key={promo.id} className="flex items-start gap-3 text-sm">
              <div className="h-5 w-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-success" strokeWidth={3} />
              </div>
              <span className="leading-relaxed">
                <span className="font-semibold text-foreground">{promo.title}:</span>{' '}
                <span className="text-muted-foreground">{promo.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ======================== */}
      {/* Call-to-Action (CTA) — Desktop */}
      {/* ======================== */}
      <div className="space-y-5 pt-2">
        {/* Input chọn số lượng (+ / -) */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Số lượng:</span>
          <div className="flex items-center border-2 border-border rounded-xl overflow-hidden bg-card">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className={cn(
                'p-3 hover:bg-muted transition-colors',
                quantity <= 1 && 'opacity-40 cursor-not-allowed'
              )}
              disabled={quantity <= 1}
              aria-label="Giảm số lượng"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))
              }
              className="w-16 text-center border-x-2 border-border py-2.5 bg-transparent text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Số lượng"
            />
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className={cn(
                'p-3 hover:bg-muted transition-colors',
                quantity >= 99 && 'opacity-40 cursor-not-allowed'
              )}
              disabled={quantity >= 99}
              aria-label="Tăng số lượng"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Trạng thái kho */}
          {selectedVariant.inStock ? (
            <span className="text-sm text-success font-semibold bg-success/10 px-3 py-1 rounded-lg">
              ✓ Còn hàng
            </span>
          ) : (
            <span className="text-sm text-destructive font-semibold">
              ✗ Hết hàng
            </span>
          )}
        </div>

        {/* 2 nút CTA to ngang nhau */}
        <div className="grid grid-cols-2 gap-3">
          {/* Nút THÊM VÀO GIỎ HÀNG — To, nổi bật, màu Accent (Cam Neon #FF5722) */}
          <Button
            size="lg"
            className="gap-2.5 h-14 text-base font-bold rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
            onClick={() => {
              if (!user) {
                useAuthStore.getState().openAuthModal();
                return;
              }
              onAddToCart(quantity);
            }}
            disabled={!selectedVariant.inStock}
          >
            <ShoppingCart className="h-5 w-5" />
            {user ? 'THÊM VÀO GIỎ HÀNG' : 'ĐĂNG NHẬP ĐỂ MUA'}
          </Button>

          {/* Nút MUA NGAY — To ngang, màu Đỏ thuần */}
          <Button
            size="lg"
            className="gap-2.5 h-14 text-base font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
            onClick={() => {
              if (!user) {
                useAuthStore.getState().openAuthModal();
                return;
              }
              onBuyNow(quantity);
            }}
            disabled={!selectedVariant.inStock}
          >
            <Zap className="h-5 w-5" />
            {user ? 'MUA NGAY' : 'ĐĂNG NHẬP ĐỂ MUA'}
          </Button>
        </div>
      </div>
    </div>
  );
}
