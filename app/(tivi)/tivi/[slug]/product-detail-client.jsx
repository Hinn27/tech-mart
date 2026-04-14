'use client';

import { AuthModal } from '@/components/ecommerce/auth-modal';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { Footer } from '@/components/ecommerce/footer';
import { Header } from '@/components/ecommerce/header';
import { ImageGallery } from '@/components/ecommerce/product-detail/image-gallery';
import { ProductAccordion } from '@/components/ecommerce/product-detail/product-accordion';
import { ProductInfo } from '@/components/ecommerce/product-detail/product-info';
import { ToastNotification, useToast } from '@/components/ecommerce/product-detail/toast-notification';
import { tvProducts } from '@/lib/mock-data';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

// Checkout route mapping theo danh mục
const checkoutRoutes = {
  '/dien-thoai': '/thanh-toan-dien-thoai',
  '/may-tinh-bang': '/thanh-toan-may-tinh-bang',
  '/laptop': '/thanh-toan-laptop',
  '/tivi': '/thanh-toan-tv',
  '/gia-dung': '/thanh-toan-gia-dung',
};

export default function ProductDetailClient({ productDetail, slug }) {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(2);
    const { toasts, addToast, removeToast } = useToast();
  const addToCart = useCartStore((state) => state.addToCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
    const openAuthModal = useAuthStore((state) => state.openAuthModal);

  const [selectedVariant, setSelectedVariant] = useState(productDetail?.variants?.[0]);
  const [selectedColor, setSelectedColor] = useState(productDetail?.colors?.[0]);

  // Xác định danh mục hiện tại từ pathname
  const currentCategory = pathname.includes('laptop') ? 'laptop'
    : pathname.includes('may-tinh-bang') ? 'may-tinh-bang'
    : pathname.includes('tivi') ? 'tivi'
    : pathname.includes('gia-dung') ? 'gia-dung'
    : 'dien-thoai';

  const categoryNames = {
    'dien-thoai': 'Điện thoại',
    'laptop': 'Laptop & PC',
    'may-tinh-bang': 'Máy tính bảng',
    'tivi': 'Tivi',
    'gia-dung': 'Đồ gia dụng',
  };

  const handleAddToCart = useCallback((quantity) => {
    addToCart(
      {
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.variants?.[0]?.price || 0,
        image: productDetail.images?.[0] || '',
        category: currentCategory,
      },
      quantity
    );
    setCartCount((prev) => prev + quantity);
    addToast({
      message: `Đã thêm ${quantity} ${productDetail?.name || 'sản phẩm'} vào giỏ hàng`,
      type: 'success',
      productName: productDetail?.name,
    });
  }, [productDetail, currentCategory, addToCart, addToast]);

  const handleBuyNow = useCallback((quantity) => {
    // Kiểm tra đăng nhập trước khi mua
    if (!user) {
      openAuthModal();
      return;
    }

    // Bước 1: Dọn sạch giỏ hàng cũ
    clearCart();

    // Bước 2: Thêm ĐÚNG DUY NHẤT sản phẩm hiện tại vào giỏ
    addToCart(
      {
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.variants?.[0]?.price || 0,
        image: productDetail.images?.[0] || '',
        category: currentCategory,
      },
      quantity
    );

    // Bước 3: Chuyển sang trang thanh toán
    let checkoutRoute = '/thanh-toan-laptop'; // Mặc định
    for (const [path, route] of Object.entries(checkoutRoutes)) {
      if (pathname.includes(path)) {
        checkoutRoute = route;
        break;
      }
    }
    router.push(checkoutRoute);
  }, [productDetail, pathname, router, addToCart, clearCart, user, openAuthModal, currentCategory]);

  const handleWishlist = useCallback(() => {
    addToast({
      message: `Đã thêm "${productDetail?.name}" vào danh sách yêu thích`,
      type: 'info',
    });
  }, [productDetail?.name, addToast]);

  const breadcrumbItems = [
    { label: categoryNames[currentCategory] || 'Sản phẩm', href: `/${currentCategory}` },
    { label: productDetail.shortName || productDetail.name, href: `/${currentCategory}/${slug}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Mobile Menu Drawer */}
            {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        {/* Layout 2 cột: Ảnh + Thông tin */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Cột trái: Ảnh sản phẩm */}
          <div>
            <ImageGallery
              images={productDetail.images}
              productName={productDetail.name}
              onWishlist={handleWishlist}
            />
          </div>

          {/* Cột phải: Thông tin sản phẩm */}
          <div>
            <ProductInfo
              product={productDetail}
              selectedVariant={selectedVariant}
              selectedColor={selectedColor}
              onVariantChange={setSelectedVariant}
              onColorChange={setSelectedColor}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Accordion thông tin chi tiết */}
        <ProductAccordion product={productDetail} />

        {/* Sản phẩm liên quan */}
        <section className="mt-12">
          <h2 className="text-xl font-extrabold text-foreground mb-5">
            Sản phẩm tương tự
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tvProducts
              .filter((p) => p.id !== slug)
              .slice(0, 4)
              .map((product) => (
                <a
                  key={product.id}
                  href={`/${product.category}/${product.id}`}
                  className="group rounded-xl bg-card border border-border overflow-hidden hover:shadow-lg transition-all card-shadow"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${
                          product.badge === 'hot'
                            ? 'bg-accent text-white'
                            : product.badge === 'sale'
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-success text-success-foreground'
                        }`}
                      >
                        {product.badge === 'hot' ? 'Hot' : product.badge === 'sale' ? `-${product.discount}%` : 'Mới'}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-bold text-destructive">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5">
                      <svg className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-muted-foreground">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal />

      {/* Toast Notification */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
