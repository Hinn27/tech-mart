import { AuthModal } from '@/components/ecommerce/auth-modal';
import { Breadcrumbs } from '@/components/ecommerce/breadcrumbs';
import { Footer } from '@/components/ecommerce/footer';
import { Header } from '@/components/ecommerce/header';
import { ProductGrid } from '@/components/ecommerce/product-grid';

/**
 * Layout dùng chung cho tất cả trang danh mục sản phẩm.
 * Server Component — nhận config và products, render toàn bộ layout.
 *
 * @param {object} props
 * @param {string} props.categorySlug    - Slug danh mục, VD: 'dien-thoai'
 * @param {string} props.categoryLabel   - Tên hiển thị, VD: 'Điện thoại'
 * @param {string} props.bannerGradient  - CSS gradient background cho banner
 * @param {string} props.bannerSubtitle  - Dòng phụ nhỏ trên banner
 * @param {string} props.bannerTitle     - Tiêu đề H1 trên banner
 * @param {string} props.bannerDesc      - Mô tả ngắn trên banner
 * @param {Array}  props.products        - Danh sách sản phẩm từ Supabase
 */
export function CategoryPageLayout({
  categorySlug,
  categoryLabel,
  bannerGradient,
  bannerSubtitle,
  bannerTitle,
  bannerDesc,
  products,
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <Breadcrumbs
          items={[{ label: categoryLabel, href: `/${categorySlug}` }]}
          className="mb-4"
        />

        {/* Banner */}
        <div
          className="relative overflow-hidden rounded-2xl mb-8 aspect-[3/1] md:aspect-[4/1]"
          style={{ background: bannerGradient }}
        >
          {/* Decorative circles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/15" />
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-12 text-white">
            <p className="text-sm md:text-base font-medium opacity-90 mb-1">
              {bannerSubtitle}
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold text-balance">
              {bannerTitle}
            </h1>
            <p className="text-sm md:text-base opacity-80 mt-2 max-w-lg hidden sm:block">
              {bannerDesc}
            </p>
          </div>
        </div>

        {/* Products or Empty State */}
        {!products || products.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <p className="text-xl font-semibold mb-2">Chưa có sản phẩm</p>
            <p className="text-sm">
              Danh mục này đang được cập nhật. Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} categoryTitle={categoryLabel} />
        )}
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
