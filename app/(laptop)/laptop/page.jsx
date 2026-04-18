import { CategoryPageLayout } from '@/components/ecommerce/category-page-layout';
import { getProductsByCategory } from '@/lib/productService';

export default async function LaptopPage() {
  const products = await getProductsByCategory('laptop');
  return (
    <CategoryPageLayout
      categorySlug="laptop"
      categoryLabel="Laptop & PC"
      bannerGradient="linear-gradient(135deg, #FF5722 0%, #E64A19 50%, #D84315 100%)"
      bannerSubtitle="Hiệu năng đỉnh cao cho mọi nhu cầu"
      bannerTitle="Laptop Gaming & Văn Phòng"
      bannerDesc="MacBook Pro M3, Dell XPS 15, ASUS ROG Strix — Trả góp 0%, giao hàng toàn quốc."
      products={products}
    />
  );
}
