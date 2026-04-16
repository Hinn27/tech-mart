import { supabase } from './supabase';

/**
 * Map tên category tiếng Việt → slug URL-safe
 */
function normalizeCategorySlug(category) {
  if (!category) return '';
  const cat = category.toLowerCase().trim();
  const categoryMap = {
    'điện thoại': 'dien-thoai',
    'dien thoai': 'dien-thoai',
    'laptop': 'laptop',
    'laptop & pc': 'laptop',
    'laptop pc': 'laptop',
    'máy tính bảng': 'may-tinh-bang',
    'may tinh bang': 'may-tinh-bang',
    'tivi': 'tivi',
    'tv': 'tivi',
    'đồ gia dụng': 'gia-dung',
    'do gia dung': 'gia-dung',
    'gia dụng': 'gia-dung',
    'gia dung': 'gia-dung',
  };
  return categoryMap[cat] || category.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Chuyển đổi dữ liệu từ snake_case (Supabase) sang camelCase (frontend)
 */
function normalizeProduct(item) {
  if (!item) return null;

  // Parse specs nếu là string JSON
  let specs = item.specs;
  if (typeof specs === 'string') {
    try {
      specs = JSON.parse(specs || '{}');
    } catch {
      specs = {};
    }
  }

  // Đảm bảo luôn có image - ưu tiên image, rồi đến imageUrl, thumbnail
  const imageUrl = item.image || item.imageUrl || item.thumbnail || '';

  return {
    id: item.id || item.slug || '',
    name: item.name || item.title || 'Đang cập nhật',
    title: item.name || item.title || 'Đang cập nhật',
    slug: item.slug || item.id || '',
    category: normalizeCategorySlug(item.category),
    categoryOriginal: item.category || '',
    price: item.price || 0,
    originalPrice: item.original_price ?? item.originalPrice ?? item.old_price ?? item.oldPrice ?? null,
    oldPrice: item.original_price ?? item.originalPrice ?? item.old_price ?? item.oldPrice ?? null,
    discount: item.discount || 0,
    image: imageUrl,
    imageUrl: imageUrl,
    rating: item.rating || 4.5,
    reviewCount: item.review_count ?? item.reviewCount ?? 0,
    review_count: item.review_count ?? item.reviewCount ?? 0,
    soldCount: item.sold_count ?? item.soldCount ?? 0,
    badge: item.badge || null,
    inStock: item.in_stock !== undefined ? item.in_stock : (item.inStock !== false),
    description: item.description || '',
    images: Array.isArray(item.images) ? item.images : (imageUrl ? [imageUrl] : []),
    categorySlug: item.category_slug || normalizeCategorySlug(item.category),
    specs: specs || {},
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
    return data.map(item => ({
      ...item,
      image: item.image,
      oldPrice: item.old_price,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      specs: typeof item.specs === 'string' ? JSON.parse(item.specs || '{}') : (item.specs || {})
    }));
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

    return {
      ...data,
      image: data.image,
      oldPrice: data.old_price,
      rating: data.rating || 0,
      reviewCount: data.review_count || 0,
      specs: typeof data.specs === 'string' ? JSON.parse(data.specs || '{}') : (data.specs || {})
    };
  } catch (err) {
    console.error(`[ProductService] Exception khi lấy sản phẩm slug "${slug}":`, err);
    return null;
  }
}

/**
 * Lấy sản phẩm liên quan theo category (không bao gồm sản phẩm hiện tại)
 * @param {string} category - Danh mục sản phẩm
 * @param {string} currentSlug - Slug của sản phẩm hiện tại (để loại trừ)
 * @param {number} limit - Số lượng sản phẩm tối đa trả về
 * @returns {Promise<Array>} Danh sách sản phẩm liên quan
 */
export async function getRelatedProducts(category, currentSlug, limit = 4) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('slug', currentSlug)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`[ProductService] Lỗi khi lấy sản phẩm liên quan danh mục "${category}":`, error);
      return [];
    }

    console.log(`[ProductService] Danh mục "${category}": lấy được ${data?.length || 0} sản phẩm liên quan`);
    return (data || []).map(item => ({
      ...item,
      image: item.image,
      oldPrice: item.old_price,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      specs: typeof item.specs === 'string' ? JSON.parse(item.specs || '{}') : (item.specs || {})
    }));
  } catch (err) {
    console.error(`[ProductService] Exception khi lấy sản phẩm liên quan danh mục "${category}":`, err);
    return [];
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
