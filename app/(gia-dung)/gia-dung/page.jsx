import { CategoryPageLayout } from '@/components/ecommerce/category-page-layout';
import { getProductsByCategory } from '@/lib/productService';

export default async function GiaDungPage() {
  const products = await getProductsByCategory('gia-dung');
  return (
    <CategoryPageLayout
      categorySlug="gia-dung"
      categoryLabel="Đồ gia dụng"
      bannerGradient="linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)"
      bannerSubtitle="Tiện nghi cho mọi gia đình"
      bannerTitle="Đồ Gia Dụng Thông Minh"
      bannerDesc="Dyson V15, Roborock S8 Pro, Philips Air Purifier — Giá tốt nhất, giao hàng nhanh."
      products={products}
    />
  );
}
