'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Tag, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function OrderSummary({ items, shippingFee, onPlaceOrder }) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Tính toán
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + shippingFee - discount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Áp dụng mã giảm giá
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError('');

    // Mô phỏng gọi API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (couponCode.toUpperCase() === 'SUMMER500') {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 500000 });
      setCouponCode('');
    } else {
      setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }

    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  return (
    <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <ShoppingBag className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-base font-bold text-foreground">Tóm tắt đơn hàng</h2>
        <span className="ml-auto text-sm font-medium text-muted-foreground">
          ({totalItems} sản phẩm)
        </span>
      </div>

      {/* ===== Giỏ hàng thu gọn — Danh sách dọc ===== */}
      <div className="py-4 space-y-4 max-h-[280px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.variant}`} className="flex gap-3">
            {/* Ảnh thumbnail nhỏ xíu */}
            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Info — tên ngắn gọn, màu sắc, số lượng, đơn giá */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-1 truncate">
                {item.product.name}
              </p>
              {item.variant && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {item.variant}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground font-medium">
                  x{item.quantity}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Mã giảm giá — Input + Nút Áp dụng ===== */}
      <div className="py-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">Mã giảm giá</span>
        </div>

        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-lg bg-success/10 border border-success/20 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm font-bold text-success">{appliedCoupon.code}</span>
              <span className="text-sm text-success">
                (-{formatPrice(appliedCoupon.discount)})
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1 rounded-md hover:bg-success/20 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Xóa mã giảm giá"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyCoupon();
              }}
              className={cn(
                'h-11 text-sm',
                couponError && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
              className="h-11 px-4 text-sm font-medium shrink-0"
            >
              {isApplyingCoupon ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Áp dụng'
              )}
            </Button>
          </div>
        )}

        {couponError && (
          <p className="mt-2 text-xs text-destructive font-medium" role="alert">
            {couponError}
          </p>
        )}

        {!appliedCoupon && (
          <p className="mt-2 text-xs text-muted-foreground">
            Thử mã:{' '}
            <button
              onClick={() => setCouponCode('SUMMER500')}
              className="font-medium text-accent hover:underline"
            >
              SUMMER500
            </button>
          </p>
        )}
      </div>

      {/* ===== Bảng tính tiền ===== */}
      <div className="py-4 border-t border-border space-y-3">
        {/* Tạm tính */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
        </div>

        {/* Phí vận chuyển */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span
            className={cn(
              'font-medium',
              shippingFee === 0 ? 'text-success' : 'text-foreground'
            )}
          >
            {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
          </span>
        </div>

        {/* Giảm giá */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="font-medium text-success">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      {/* ===== Dòng Tổng cộng — Chữ to, in đậm, màu nhấn ===== */}
      <div className="py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-foreground">Tổng cộng</span>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-accent tracking-tight">
              {formatPrice(total)}
            </span>
            <p className="text-[11px] text-muted-foreground mt-0.5">(Đã bao gồm VAT)</p>
          </div>
        </div>
      </div>

      {/* ===== Nút HOÀN TẤT ĐẶT HÀNG — Khổng lồ, full-width ===== */}
      <Button
        onClick={() => router.push('/dat-hang-thanh-cong')}
        className="w-full h-14 text-base font-extrabold rounded-xl bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20 transition-all active:scale-[0.98] tracking-wide"
      >
        HOÀN TẤT ĐẶT HÀNG
      </Button>

      {/* Trust Badges */}
      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Bảo mật SSL
        </span>
        <span className="text-border">|</span>
        <span>Đổi trả 30 ngày</span>
        <span className="text-border">|</span>
        <span>Hỗ trợ 24/7</span>
      </div>
    </div>
  );
}
