import { getProductsByCategory } from '@/lib/productService';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { Header } from '@/components/ecommerce/header';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';

// Server Component — KHÔNG có 'use client', KHÔNG có hooks
export default async function DienThoaiPage() {
  const products = await getProductsByCategory('dien-thoai');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <Breadcrumbs items={[{ label: 'Điện thoại', href: '/dien-thoai' }]} className="mb-4" />

        {/* Banner */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 aspect-[3/1] md:aspect-[4/1]"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/15" />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 text-white">
            <p className="text-sm md:text-base font-medium opacity-90 mb-1">Bộ sưu tập smartphone mới nhất 2024</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-balance">Điện Thoại Chính Hãng</h1>
            <p className="text-sm md:text-base opacity-80 mt-2 max-w-lg hidden sm:block">
              iPhone 16, Samsung Galaxy S24, Xiaomi 14 — Giá tốt nhất, bảo hành chính hãng.
            </p>
          </div>
        </div>

        {(!products || products.length === 0) ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-xl font-semibold mb-2">Chưa có sản phẩm</p>
            <p className="text-sm">Danh mục này đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <ProductGrid products={products} categoryTitle="Điện thoại" />
        )}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
