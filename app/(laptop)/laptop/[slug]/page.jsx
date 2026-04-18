import { fetchProductDetailPage } from '@/lib/productDetailService';
import { getProductsByCategory } from '@/lib/productService';
import ProductDetailClient from './product-detail-client';

export async function generateStaticParams() {
  const products = await getProductsByCategory('laptop');
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const { productDetail, relatedProducts } = await fetchProductDetailPage('laptop', slug);
  return <ProductDetailClient productDetail={productDetail} slug={slug} relatedProducts={relatedProducts} />;
}
