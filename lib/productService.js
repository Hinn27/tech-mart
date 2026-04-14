import { supabase } from './supabase';

/**
 * Chuyển đổi dữ liệu từ snake_case (Supabase) sang camelCase (frontend)
 */
function normalizeProduct(item) {
  if (!item) return null;
  return {
    id: item.id || item.slug || '',
    name: item.name || item.title || 'Đang cập nhật',
    title: item.name || item.title || 'Đang cập nhật',
    slug: item.slug || item.id || '',
    category: item.category || '',
    price: item.price || 0,
    originalPrice: item.original_price || item.originalPrice || item.old_price || item.oldPrice || null,
    oldPrice: item.original_price || item.originalPrice || item.old_price || item.oldPrice || null,
    discount: item.discount || 0,
    image: item.image || '/placeholder.jpg',
    rating: item.rating || 4.5,
    reviewCount: item.review_count || item.reviewCount || 0,
    review_count: item.review_count || item.reviewCount || 0,
    soldCount: item.sold_count || item.soldCount || 0,
    badge: item.badge || null,
    inStock: item.in_stock !== undefined ? item.in_stock : (item.inStock !== false),
    description: item.description || '',
    images: item.images || (item.image ? [item.image] : []),
    categorySlug: item.category_slug || item.categorySlug || item.category || '',
    specs: item.specs || {},
  };
}

/**
 * Lấy danh sách sản phẩm theo danh mục
 * @param {string} categoryName - Tên danh mục (ví dụ: 'dien-thoai', 'laptop')
 * @returns {Promise<Array>} Danh sách sản phẩm
 */
export async function getProductsByCategory(categoryName) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[ProductService] Lỗi khi lấy sản phẩm danh mục "${categoryName}":`, error);
      return [];
    }

    console.log(`[ProductService] Danh mục "${categoryName}": lấy được ${data?.length || 0} sản phẩm`);
    return (data || []).map(normalizeProduct);
  } catch (err) {
    console.error(`[ProductService] Exception khi lấy sản phẩm danh mục "${categoryName}":`, err);
    return [];
  }
}

/**
 * Lấy chi tiết một sản phẩm dựa vào slug
 * @param {string} slug - Slug của sản phẩm (ví dụ: 'iphone-15-pro-max')
 * @returns {Promise<Object|null>} Chi tiết sản phẩm hoặc null nếu không tìm thấy
 */
export async function getProductBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      // Lỗi PGRST116 = không tìm thấy bản ghi nào (expected khi slug không tồn tại)
      if (error.code === 'PGRST116') {
        console.warn(`[ProductService] Không tìm thấy sản phẩm với slug: "${slug}"`);
        return null;
      }
      console.error(`[ProductService] Lỗi khi lấy sản phẩm slug "${slug}":`, error);
      return null;
    }

    return normalizeProduct(data);
  } catch (err) {
    console.error(`[ProductService] Exception khi lấy sản phẩm slug "${slug}":`, err);
    return null;
  }
}

/**
 * Lấy tất cả sản phẩm (không lọc)
 * @returns {Promise<Array>} Danh sách tất cả sản phẩm
 */
export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ProductService] Lỗi khi lấy tất cả sản phẩm:', error);
      return [];
    }

    return (data || []).map(normalizeProduct);
  } catch (err) {
    console.error('[ProductService] Exception khi lấy tất cả sản phẩm:', err);
    return [];
  }
}
