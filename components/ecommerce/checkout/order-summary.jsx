'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchActiveVouchers } from '@/lib/voucherService';
import { formatPrice } from '@/lib/mock-data';
import { formatVoucherValue } from '@/lib/voucherUtils';
import { cn } from '@/lib/utils';
import useCartStore from '@/store/cartStore';
import useVoucherStore from '@/store/voucherStore';
import { Check, Loader2, ShoppingBag, Tag, Ticket, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function OrderSummary({ shippingFee = 0, onPlaceOrder }) {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const appliedVoucher = useVoucherStore((state) => state.appliedVoucher);
  const voucherError = useVoucherStore((state) => state.voucherError);
  const applyVoucher = useVoucherStore((state) => state.applyVoucher);
  const removeVoucher = useVoucherStore((state) => state.removeVoucher);
  const clearVoucherError = useVoucherStore((state) => state.clearVoucherError);
  const getDiscountAmount = useVoucherStore((state) => state.getDiscountAmount);

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [vouchersLoading, setVouchersLoading] = useState(true);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );
  const discount = getDiscountAmount(subtotal);
  const total = Math.max(0, subtotal + shippingFee - discount);
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    async function loadVouchers() {
      setVouchersLoading(true);
      try {
        const data = await fetchActiveVouchers();
        setVouchers(data);
      } catch (error) {
        console.error('[OrderSummary] Lỗi tải voucher:', error);
      } finally {
        setVouchersLoading(false);
      }
    }

    loadVouchers();
  }, []);

  useEffect(() => {
    if (!appliedVoucher) return;
    setCouponCode(appliedVoucher.code);
  }, [appliedVoucher]);

  const handleApplyCoupon = async (code = couponCode) => {
    setIsApplyingCoupon(true);
    clearVoucherError();
    const result = applyVoucher(code, vouchers, subtotal);
    if (result.success) {
      setCouponCode(result.voucher.code);
    }
    setIsApplyingCoupon(false);
  };

  const handlePlaceOrder = () => {
    onPlaceOrder?.();
    router.push('/dat-hang-thanh-cong');
  };

  return (
    <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <ShoppingBag className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-base font-bold text-foreground">Tóm tắt đơn hàng</h2>
        <span className="ml-auto text-sm font-medium text-muted-foreground">
          ({totalItems} sản phẩm)
        </span>
      </div>

      <div className="py-4 space-y-4 max-h-[280px] overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={`${item.product.id}-${item.category}`} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
              <img
                src={item.product.image || '/placeholder.jpg'}
                alt={item.product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="p-0.5 hover:text-accent transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-medium px-1">x{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-0.5 hover:text-accent transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="py-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">Mã giảm giá</span>
        </div>

        {appliedVoucher ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-success/10 border border-success/20 px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Check className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-sm font-bold text-success">{appliedVoucher.code}</span>
                <span className="text-sm text-success truncate">
                  (-{formatVoucherValue(appliedVoucher)})
                </span>
              </div>
              <button
                onClick={removeVoucher}
                className="p-1 rounded-md hover:bg-success/20 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Xóa mã giảm giá"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Đổi mã giảm giá"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  clearVoucherError();
                }}
                className="h-11 text-sm font-mono"
              />
              <Button
                variant="outline"
                onClick={() => handleApplyCoupon(couponCode)}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="h-11 px-4 text-sm font-medium shrink-0"
              >
                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Đổi mã'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã giảm giá"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  clearVoucherError();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyCoupon();
                }}
                className={cn('h-11 text-sm font-mono', voucherError && 'border-destructive focus-visible:ring-destructive')}
              />
              <Button
                variant="outline"
                onClick={() => handleApplyCoupon()}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="h-11 px-4 text-sm font-medium shrink-0"
              >
                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Áp dụng'}
              </Button>
            </div>

            {!vouchersLoading && vouchers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vouchers.slice(0, 4).map((voucher) => (
                  <button
                    key={voucher.id}
                    type="button"
                    onClick={() => {
                      setCouponCode(voucher.code);
                      handleApplyCoupon(voucher.code);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    {voucher.code} · {formatVoucherValue(voucher)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {voucherError && (
          <p className="mt-2 text-xs text-destructive font-medium" role="alert">
            {voucherError}
          </p>
        )}
      </div>

      <div className="py-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className={cn('font-medium', shippingFee === 0 ? 'text-success' : 'text-foreground')}>
            {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="font-medium text-success">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

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

      <Button
        onClick={handlePlaceOrder}
        className="w-full h-14 text-base font-extrabold rounded-xl bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20 transition-all active:scale-[0.98] tracking-wide"
      >
        HOÀN TẤT ĐẶT HÀNG
      </Button>

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
