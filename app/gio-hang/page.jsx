'use client';

import { AuthModal } from '@/components/ecommerce/auth-modal';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { Footer } from '@/components/ecommerce/footer';
import { Header } from '@/components/ecommerce/header';
import { formatPrice } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { fetchActiveVouchers } from '@/lib/voucherService';
import useCartStore from '@/store/cartStore';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ClipboardCopy,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Ticket,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Checkout route mapping
const checkoutRoutes = {
  'dien-thoai': '/thanh-toan-dien-thoai',
  'may-tinh-bang': '/thanh-toan-may-tinh-bang',
  'laptop': '/thanh-toan-laptop',
  'tivi': '/thanh-toan-tv',
  'gia-dung': '/thanh-toan-gia-dung',
};

const categoryNames = {
  'dien-thoai': 'Điện thoại',
  'may-tinh-bang': 'Máy tính bảng',
  'laptop': 'Laptop & PC',
  'tivi': 'Tivi',
  'gia-dung': 'Đồ gia dụng',
};

export default function CartPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  // === Voucher State ===
  const [vouchers, setVouchers] = useState([]);
  const [vouchersLoading, setVouchersLoading] = useState(true);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch vouchers
  useEffect(() => {
    async function loadVouchers() {
      setVouchersLoading(true);
      const data = await fetchActiveVouchers();
      setVouchers(data);
      setVouchersLoading(false);
    }
    loadVouchers();
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Tính giảm giá
  const discountAmount = appliedVoucher
    ? appliedVoucher.type === 'percentage'
      ? Math.round(subtotal * (appliedVoucher.value / 100))
      : Math.min(appliedVoucher.value, subtotal)
    : 0;

  const finalTotal = subtotal - discountAmount;

  // Copy mã voucher
  const handleCopy = useCallback(
    async (code, id) => {
      try {
        await navigator.clipboard.writeText(code);
        setCopiedId(id);
        setVoucherInput(code);
        showToast(`Đã copy mã "${code}"`, 'success');
        setTimeout(() => setCopiedId(null), 2000);
      } catch {
        showToast('Không thể copy mã', 'error');
      }
    },
    []
  );

  // Áp dụng voucher
  const handleApplyVoucher = useCallback(() => {
    setVoucherError('');
    const code = voucherInput.toUpperCase().trim();
    if (!code) {
      setVoucherError('Vui lòng nhập mã giảm giá');
      return;
    }

    const found = vouchers.find((v) => v.code === code && v.is_active);
    if (!found) {
      setVoucherError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      return;
    }

    setAppliedVoucher(found);
    showToast(`Đã áp dụng mã "${code}" thành công!`, 'success');
  }, [voucherInput, vouchers]);

  // Hủy voucher
  const handleRemoveVoucher = useCallback(() => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
  }, []);

  // Nhóm theo danh mục để checkout
  const groupedItems = cart.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const breadcrumbItems = [{ label: 'Giỏ hàng', href: '/gio-hang' }];

  // Empty state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1400px] px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Giỏ hàng trống
            </h1>
            <p className="text-muted-foreground mb-6 max-w-md">
              Hãy khám phá các sản phẩm yêu thích và thêm chúng vào giỏ hàng của bạn.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-accent hover:bg-accent/90 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Tiếp tục mua sắm
            </Link>
          </motion.div>
        </main>
        <Footer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Giỏ hàng của bạn ({totalItems} sản phẩm)
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-destructive hover:underline font-medium"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm trong giỏ */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border card-shadow"
              >
                {/* Ảnh */}
                <Link
                  href={`/${item.category}/${item.product.id}`}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-lg bg-muted"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                {/* Thông tin */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <Link
                    href={`/${item.category}/${item.product.id}`}
                    className="font-semibold text-foreground hover:text-accent transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>

                  {/* Giá */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-destructive">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Số lượng + Xóa */}
                  <div className="flex items-center gap-3 mt-auto pt-3">
                    {/* Bộ chọn số lượng */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className={cn(
                          'p-1.5 hover:bg-muted transition-colors',
                          item.quantity <= 1 && 'opacity-40 cursor-not-allowed'
                        )}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold py-1.5 border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Thành tiền */}
                    <span className="text-sm font-bold text-foreground ml-auto">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Nút xóa */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Tiếp tục mua sắm */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Tiếp tục mua sắm
            </Link>

            {/* ======================== */}
            {/* Mã giảm giá khả dụng */}
            {/* ======================== */}
            <VoucherCards
              vouchers={vouchers}
              loading={vouchersLoading}
              copiedId={copiedId}
              onCopy={handleCopy}
            />
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-foreground">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium text-success">Miễn phí</span>
                </div>

                {/* Giảm giá từ voucher */}
                {appliedVoucher && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-success" />
                      <span className="text-success font-medium">
                        Mã: {appliedVoucher.code}
                      </span>
                    </div>
                    <span className="font-bold text-success">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-extrabold text-destructive">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* === Ô nhập mã giảm giá === */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Mã giảm giá
                </p>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/30">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-success" />
                      <code className="text-sm font-mono font-bold text-success">
                        {appliedVoucher.code}
                      </code>
                      <span className="text-xs text-success/80">
                        {appliedVoucher.type === 'percentage'
                          ? `(-${appliedVoucher.value}%)`
                          : `(-${Number(appliedVoucher.value).toLocaleString('vi-VN')}đ)`}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveVoucher}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Hủy mã"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        value={voucherInput}
                        onChange={(e) => {
                          setVoucherInput(e.target.value.toUpperCase());
                          setVoucherError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
                        className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm font-mono font-bold placeholder:text-muted-foreground placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        className="px-4 h-10 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-bold transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-xs text-destructive font-medium">
                        {voucherError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Nút thanh toán theo danh mục */}
              {Object.entries(groupedItems).map(([category, items]) => {
                const checkoutRoute = checkoutRoutes[category];
                const categoryTotal = items.reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                );

                return (
                  <button
                    key={category}
                    onClick={() => router.push(checkoutRoute)}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
                    style={{
                      backgroundColor: '#2563EB',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    Thanh toán — {categoryNames[category] || category} ({items.length} SP)
                    <br />
                    <span className="text-xs font-medium opacity-90">
                      {formatPrice(categoryTotal)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toast inline */}
        {toast && (
          <div
            className={`fixed bottom-5 right-5 z-[100] p-3 px-5 rounded-xl text-sm font-medium border-2 shadow-xl animate-in slide-in-from-bottom fade-in duration-200 ${
              toast.type === 'success'
                ? 'bg-card text-success border-success/30'
                : 'bg-card text-destructive border-destructive/30'
            }`}
          >
            {toast.message}
          </div>
        )}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

// ============================================================
// Voucher Cards — Thẻ mã giảm giá
// ============================================================
function VoucherCards({ vouchers, loading, copiedId, onCopy }) {
  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
          <Ticket className="h-4 w-4 text-accent" />
          Mã giảm giá khả dụng
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
        <Ticket className="h-4 w-4 text-accent" />
        Mã giảm giá khả dụng
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vouchers.map((v) => (
          <button
            key={v.id}
            onClick={() => onCopy(v.code, v.id)}
            className="group relative flex flex-col items-start p-3.5 rounded-xl border-2 border-dashed border-border bg-card hover:border-accent/50 hover:bg-accent/5 transition-all text-left"
          >
            {/* Badge Copy */}
            <span
              className={cn(
                'absolute top-2 right-2 p-1 rounded-md transition-colors',
                copiedId === v.id
                  ? 'bg-success/15 text-success'
                  : 'bg-muted/50 text-muted-foreground group-hover:text-accent'
              )}
            >
              {copiedId === v.id ? (
                <Check className="h-3 w-3" />
              ) : (
                <ClipboardCopy className="h-3 w-3" />
              )}
            </span>

            {/* Mã */}
            <code className="text-sm font-mono font-bold text-accent mb-1">
              {v.code}
            </code>
            {/* Mô tả */}
            <span className="text-xs text-muted-foreground">
              {v.type === 'percentage'
                ? `Giảm ${v.value}%`
                : `Giảm ${Number(v.value).toLocaleString('vi-VN')}đ`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
