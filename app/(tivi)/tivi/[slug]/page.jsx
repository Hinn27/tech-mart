import { getProductBySlug, getProductsByCategory } from '@/lib/productService';
import { notFound } from 'next/navigation';
import ProductDetailClient from './product-detail-client';

// Static paths cho build-time
export async function generateStaticParams() {
  const products = await getProductsByCategory('tivi');
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Server Component — fetch dữ liệu từ Supabase
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  // Gọi API thực tế từ Supabase
  let productDetail = await getProductBySlug(slug);

  if (!productDetail) {
    notFound();
  }


  // Bổ sung fields mặc định cho Supabase products
  productDetail = {
    ...productDetail,
    variants: productDetail.variants || [{ id: "v1", storage: "Mặc định", price: productDetail.price || 0, originalPrice: productDetail.original_price || productDetail.price || 0, inStock: productDetail.in_stock ?? true }],
    colors: productDetail.colors || [{ id: "c1", name: "Mặc định", hex: "#808080", image: productDetail.image || "" }],
    promotions: productDetail.promotions || [],
    specifications: productDetail.specifications || [],
    highlights: productDetail.description || `<h3>${productDetail.name}</h3>`,
    reviews: productDetail.reviews || [],
    shortName: productDetail.name,
    images: productDetail.images || (productDetail.image ? [productDetail.image] : []),
    reviewCount: productDetail.review_count || productDetail.reviewCount || 0,
    soldCount: productDetail.sold_count || productDetail.soldCount || 0,
    rating: productDetail.rating || 4.5,
  };

  return <ProductDetailClient productDetail={productDetail} slug={slug} />;
}
