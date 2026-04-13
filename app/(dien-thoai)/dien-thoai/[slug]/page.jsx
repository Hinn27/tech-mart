import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/productService';
import { phoneProducts } from '@/lib/mock-data';
import ProductDetailClient from './product-detail-client';

// Static paths cho build-time (dùng mock data làm fallback)
export function generateStaticParams() {
  return phoneProducts.map((product) => ({
    slug: product.id,
  }));
}

// Server Component — fetch dữ liệu từ Supabase
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  // Gọi API thực tế từ Supabase
  const productDetail = await getProductBySlug(slug);

  // Fallback: nếu Supabase chưa có dữ liệu, dùng mock data
  if (!productDetail) {
    const { getProductDetailBySlug } = await import('@/lib/product-detail-data');
    const mockData = getProductDetailBySlug(slug);
    if (!mockData) {
      notFound();
    }
    return <ProductDetailClient productDetail={mockData} slug={slug} useMockData />;
  }

  return <ProductDetailClient productDetail={productDetail} slug={slug} />;
}
