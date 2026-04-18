import { CategoryPageLayout } from '@/components/ecommerce/category-page-layout';
import { getProductsByCategory } from '@/lib/productService';

export default async function MayTinhBangPage() {
  const products = await getProductsByCategory('may-tinh-bang');
  return (
    <CategoryPageLayout
      categorySlug="may-tinh-bang"
      categoryLabel="Máy tính bảng"
      bannerGradient="linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)"
      bannerSubtitle="Màn hình lớn, hiệu năng mạnh mẽ"
      bannerTitle="Máy Tính Bảng Cao Cấp"
      bannerDesc="iPad Pro M4, Samsung Galaxy Tab S9, Xiaomi Pad 6 — Trải nghiệm đỉnh cao."
      products={products}
    />
  );
}
