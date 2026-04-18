import { fetchProductDetailPage } from '@/lib/productDetailService';
import { getProductsByCategory } from '@/lib/productService';
import ProductDetailClient from './product-detail-client';

export async function generateStaticParams() {
  const products = await getProductsByCategory('gia-dung');
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const { productDetail, relatedProducts } = await fetchProductDetailPage('gia-dung', slug);
  return <ProductDetailClient productDetail={productDetail} slug={slug} relatedProducts={relatedProducts} />;
}
