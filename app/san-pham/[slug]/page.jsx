'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/ecommerce/header';
import { Footer } from '@/components/ecommerce/footer';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { ImageGallery } from '@/components/ecommerce/product-detail/image-gallery';
import { ProductInfo } from '@/components/ecommerce/product-detail/product-info';
import { ProductAccordion } from '@/components/ecommerce/product-detail/product-accordion';
import {
  ToastNotification,
  useToast,
} from '@/components/ecommerce/product-detail/toast-notification';
import {
  getProductDetailBySlug,
} from '@/lib/product-detail-data';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const product = getProductDetailBySlug(slug);

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants[0] || { id: '', storage: '', price: 0, originalPrice: 0, inStock: false }
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] || { id: '', name: '', hex: '', image: '' }
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleColorChange = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  const handleVariantChange = useCallback((variant) => {
    setSelectedVariant(variant);
  }, []);

  const handleAddToCart = useCallback(
    (quantity) => {
      if (!product) return;
      addToast({
        type: 'success',
        message: `Đã thêm ${quantity} ${product.shortName} ${selectedVariant.storage} — ${selectedColor.name} vào giỏ hàng thành công!`,
      });
      setCartQuantity((prev) => prev + quantity);
    },
    [product, selectedVariant, selectedColor, addToast]
  );

  const handleBuyNow = useCallback(
    (quantity) => {
      if (!product) return;
      addToast({
        type: 'info',
        message: `Đang chuyển đến trang thanh toán cho ${quantity} sản phẩm...`,
      });
    },
    [product, addToast]
  );

  const handleWishlist = useCallback(() => {
    setIsWishlisted((prev) => !prev);
    addToast({
      type: isWishlisted ? 'info' : 'success',
      message: isWishlisted
        ? 'Đã xóa khỏi danh sách yêu thích'
        : 'Đã thêm vào danh sách yêu thích',
    });
  }, [isWishlisted, addToast]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Không tìm thấy sản phẩm
            </h1>
            <p className="text-muted-foreground">
              Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get images — use color-specific image as first if available
  const images = selectedColor.image
    ? [selectedColor.image, ...product.images.filter((img) => img !== selectedColor.image)]
    : product.images;

  // Build breadcrumbs: Trang chủ > Điện thoại > Apple
  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: product.category, href: `/danh-muc/${product.categorySlug}` },
    { label: product.brand },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-6 lg:py-8">
        {/* ===== Breadcrumbs — Nằm trên cùng ===== */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* ===== Main Product Section — 2 Cột 50-50 ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ===== CỘT TRÁI — Image Gallery ===== */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ImageGallery
              images={images}
              productName={product.name}
              onWishlist={handleWishlist}
              isWishlisted={isWishlisted}
            />
          </div>

          {/* ===== CỘT PHẢI — Thông tin & Mua hàng ===== */}
          <div>
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              selectedColor={selectedColor}
              onVariantChange={handleVariantChange}
              onColorChange={handleColorChange}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* ===== Khu vực bên dưới — Accordion (Khối thả xuống) ===== */}
        <ProductAccordion product={product} />
      </main>

      <Footer />

      {/* ===== Mobile Bottom Bar — Thanh cố định dưới cùng trên mobile ===== */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 safe-area-bottom lg:hidden">
          <Button
            size="lg"
            className="w-full h-13 gap-2.5 text-sm font-bold rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
            onClick={() => handleAddToCart(1)}
            disabled={!selectedVariant.inStock}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            THÊM VÀO GIỎ HÀNG — {selectedVariant.price.toLocaleString('vi-VN')}₫
          </Button>
        </div>
      )}

      {/* Spacer cho mobile bottom bar */}
      {isMobile && <div className="h-20 lg:hidden" />}

      {/* ===== Toast Notifications — Snackbar góc dưới phải ===== */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
