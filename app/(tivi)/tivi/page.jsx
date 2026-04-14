import { getProductsByCategory } from '@/lib/productService';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { Header } from '@/components/ecommerce/header';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';

// Server Component — KHÔNG có 'use client'
export default async function TiviPage() {
  const products = await getProductsByCategory('tivi');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <Breadcrumbs items={[{ label: 'Tivi', href: '/tivi' }]} className="mb-4" />

        {/* Banner */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 aspect-[3/1] md:aspect-[4/1]"
          style={{ background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 50%, #155E75 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/15" />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 text-white">
            <p className="text-sm md:text-base font-medium opacity-90 mb-1">Hình ảnh sống động, âm thanh chân thực</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-balance">Tivi 4K / Màn Hình Giải Trí</h1>
            <p className="text-sm md:text-base opacity-80 mt-2 max-w-lg hidden sm:block">
              Samsung Neo QLED 8K, LG OLED evo, Sony Bravia XR — Lắp đặt tận nhà, bảo hành chính hãng.
            </p>
          </div>
        </div>

        {(!products || products.length === 0) ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-xl font-semibold mb-2">Chưa có sản phẩm</p>
            <p className="text-sm">Danh mục này đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <ProductGrid products={products} categoryTitle="Tivi" />
        )}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
