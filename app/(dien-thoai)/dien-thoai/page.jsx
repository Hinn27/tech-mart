import { CategoryPageLayout } from '@/components/ecommerce/category-page-layout';
import { getProductsByCategory } from '@/lib/productService';

export default async function DienThoaiPage() {
  const products = await getProductsByCategory('dien-thoai');
  return (
    <CategoryPageLayout
      categorySlug="dien-thoai"
      categoryLabel="Điện thoại"
      bannerGradient="linear-gradient(135deg, #2563EB 0%, #1E40AF 50%, #1E3A8A 100%)"
      bannerSubtitle="Bộ sưu tập smartphone mới nhất 2024"
      bannerTitle="Điện Thoại Chính Hãng"
      bannerDesc="iPhone 16, Samsung Galaxy S24, Xiaomi 14 — Giá tốt nhất, bảo hành chính hãng."
      products={products}
    />
  );
}
