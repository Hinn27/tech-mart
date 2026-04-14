import { getProductBySlug, getProductsByCategory } from '@/lib/productService';
import { notFound } from 'next/navigation';
import ProductDetailClient from './product-detail-client';

// Static paths cho build-time
export async function generateStaticParams() {
  const products = await getProductsByCategory('laptop');
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Server Component — fetch dữ liệu từ Supabase
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  // Gọi API thực tế từ Supabase
  const productDetail = await getProductBySlug(slug);

  if (!productDetail) {
    notFound();
  }

  return <ProductDetailClient productDetail={productDetail} slug={slug} />;
}
