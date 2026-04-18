import { getProductBySlug, getProductsByCategory, getRelatedProducts } from '@/lib/productService';
import { notFound } from 'next/navigation';

/**
 * Helper dùng chung cho tất cả product detail pages.
 * Server-side: fetch product + related, bổ sung default fields, trả về 404 nếu không tìm thấy.
 *
 * @param {string} categorySlug - VD: 'dien-thoai', 'laptop'
 * @param {string} slug         - Slug sản phẩm từ URL params
 * @returns {{ productDetail: object, relatedProducts: Array }}
 */
export async function fetchProductDetailPage(categorySlug, slug) {
  const [rawProduct, relatedProducts] = await Promise.all([
    getProductBySlug(slug),
    getRelatedProducts(categorySlug, slug, 4),
  ]);

  if (!rawProduct) notFound();

  const productDetail = {
    ...rawProduct,
    variants: rawProduct.variants ?? [{
      id: 'v1',
      storage: 'Mặc định',
      price: rawProduct.price ?? 0,
      originalPrice: rawProduct.original_price ?? rawProduct.price ?? 0,
      inStock: rawProduct.in_stock ?? true,
    }],
    colors: rawProduct.colors ?? [{
      id: 'c1',
      name: 'Mặc định',
      hex: '#808080',
      image: rawProduct.image ?? '',
    }],
    promotions: rawProduct.promotions ?? [],
    specifications: rawProduct.specifications ?? [],
    highlights: rawProduct.description ?? `<h3>${rawProduct.name}</h3>`,
    reviews: rawProduct.reviews ?? [],
    shortName: rawProduct.name,
    images: rawProduct.images ?? (rawProduct.image ? [rawProduct.image] : []),
    reviewCount: rawProduct.review_count ?? rawProduct.reviewCount ?? 0,
    soldCount: rawProduct.sold_count ?? rawProduct.soldCount ?? 0,
    rating: rawProduct.rating ?? 4.5,
  };

  return { productDetail, relatedProducts };
}
