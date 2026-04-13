'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, MobileMenu } from '@/components/ecommerce/header';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';
import { formatPrice } from '@/lib/mock-data';
import useCartStore from '@/store/cartStore';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

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
        <Header
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
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
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

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
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-extrabold text-destructive">
                    {formatPrice(subtotal)}
                  </span>
                </div>
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
      </main>

      <Footer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
