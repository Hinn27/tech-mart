import { fetchProductDetailPage } from '@/lib/productDetailService';
import { getProductsByCategory } from '@/lib/productService';
import ProductDetailClient from './product-detail-client';

export const revalidate = 0;

export async function generateStaticParams() {
  const products = await getProductsByCategory('dien-thoai');
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const { productDetail, relatedProducts } = await fetchProductDetailPage('dien-thoai', slug);
  return <ProductDetailClient productDetail={productDetail} slug={slug} relatedProducts={relatedProducts} />;
}
