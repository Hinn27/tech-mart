import { getProductsByCategory } from '@/lib/productService';
import { ProductGrid } from '@/components/ecommerce/product-grid';
import { Header } from '@/components/ecommerce/header';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { Footer } from '@/components/ecommerce/footer';
import { AuthModal } from '@/components/ecommerce/auth-modal';

// Server Component — KHÔNG có 'use client'
export default async function LaptopPage() {
  const products = await getProductsByCategory('laptop');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <Breadcrumbs items={[{ label: 'Laptop & PC', href: '/laptop' }]} className="mb-4" />

        {/* Banner */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 aspect-[3/1] md:aspect-[4/1]"
          style={{ background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 50%, #D84315 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/15" />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 text-white">
            <p className="text-sm md:text-base font-medium opacity-90 mb-1">Hiệu năng đỉnh cao cho mọi nhu cầu</p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-balance">Laptop Gaming & Văn Phòng</h1>
            <p className="text-sm md:text-base opacity-80 mt-2 max-w-lg hidden sm:block">
              MacBook Pro M3, Dell XPS 15, ASUS ROG Strix — Trả góp 0%, giao hàng toàn quốc.
            </p>
          </div>
        </div>

        {(!products || products.length === 0) ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-xl font-semibold mb-2">Chưa có sản phẩm</p>
            <p className="text-sm">Danh mục này đang được cập nhật. Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <ProductGrid products={products} categoryTitle="Laptop & PC" />
        )}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
