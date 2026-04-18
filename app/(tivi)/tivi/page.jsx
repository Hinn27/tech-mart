import { CategoryPageLayout } from '@/components/ecommerce/category-page-layout';
import { getProductsByCategory } from '@/lib/productService';

export default async function TiviPage() {
  const products = await getProductsByCategory('tivi');
  return (
    <CategoryPageLayout
      categorySlug="tivi"
      categoryLabel="Tivi"
      bannerGradient="linear-gradient(135deg, #0891B2 0%, #0E7490 50%, #155E75 100%)"
      bannerSubtitle="Hình ảnh sống động, âm thanh chân thực"
      bannerTitle="Tivi 4K / Màn Hình Giải Trí"
      bannerDesc="Samsung Neo QLED 8K, LG OLED evo, Sony Bravia XR — Lắp đặt tận nhà, bảo hành chính hãng."
      products={products}
    />
  );
}
