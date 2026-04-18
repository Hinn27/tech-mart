// Dữ liệu tĩnh và helper cho E-commerce - TechElite

// ============================================================
// Danh mục sản phẩm (dùng cho Header mega menu và Sidebar)
// ============================================================
export const categories = [
  {
    id: '1',
    name: 'Điện thoại',
    icon: 'smartphone',
    slug: 'dien-thoai',
    subcategories: [
      { name: 'iPhone', slug: 'iphone' },
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Xiaomi', slug: 'xiaomi' },
      { name: 'OPPO', slug: 'oppo' },
      { name: 'Huawei', slug: 'huawei' },
      { name: 'Honor', slug: 'honor' },
    ],
  },
  {
    id: '2',
    name: 'Máy tính bảng',
    icon: 'tablet',
    slug: 'may-tinh-bang',
    subcategories: [
      { name: 'iPad', slug: 'ipad' },
      { name: 'Samsung Galaxy Tab', slug: 'samsung-tab' },
      { name: 'Xiaomi Pad', slug: 'xiaomi-pad' },
      { name: 'Huawei MatePad', slug: 'huawei-matepad' },
    ],
  },
  {
    id: '3',
    name: 'Laptop & PC',
    icon: 'laptop',
    slug: 'laptop',
    subcategories: [
      { name: 'MacBook', slug: 'macbook' },
      { name: 'Laptop Gaming', slug: 'laptop-gaming' },
      { name: 'Laptop Văn phòng', slug: 'laptop-van-phong' },
      { name: 'PC Gaming', slug: 'pc-gaming' },
      { name: 'PC Đồng bộ', slug: 'pc-dong-bo' },
    ],
  },
  {
    id: '4',
    name: 'Tivi',
    icon: 'tv',
    slug: 'tivi',
    subcategories: [
      { name: 'Samsung TV', slug: 'samsung-tv' },
      { name: 'LG TV', slug: 'lg-tv' },
      { name: 'Sony TV', slug: 'sony-tv' },
      { name: 'TCL TV', slug: 'tcl-tv' },
    ],
  },
  {
    id: '5',
    name: 'Đồ gia dụng',
    icon: 'home',
    slug: 'gia-dung',
    subcategories: [
      { name: 'Máy lọc không khí', slug: 'may-loc-khong-khi' },
      { name: 'Máy hút bụi', slug: 'may-hut-bui' },
      { name: 'Nồi chiên không dầu', slug: 'noi-chien-khong-dau' },
      { name: 'Robot hút bụi', slug: 'robot-hut-bui' },
    ],
  },
];

// ============================================================
// Banner slides cho HeroSlider
// ============================================================
export const bannerSlides = [
  {
    id: 1,
    title: 'MacBook Pro M3 Max',
    subtitle: 'Sức mạnh vượt trội cho mọi sáng tạo',
    description: 'Chip M3 Max mới nhất - Hiệu năng đỉnh cao',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop',
    buttonText: 'Khám phá ngay',
    buttonLink: '/laptop',
  },
  {
    id: 2,
    title: 'iPhone 16 Pro',
    subtitle: 'Titan. Khác biệt.',
    description: 'Camera 48MP - Chip A18 Pro - USB-C',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&h=600&fit=crop',
    buttonText: 'Mua ngay',
    buttonLink: '/dien-thoai',
  },
  {
    id: 3,
    title: 'Honor Magic 6 Pro',
    subtitle: 'AI Photography. Bước đột phá mới',
    description: 'Camera AI 50MP - Pin 5600mAh - Sạc 80W',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop',
    buttonText: 'Tìm hiểu thêm',
    buttonLink: '/dien-thoai',
  },
];

// ============================================================
// Promotions cho Sidebar
// ============================================================
export const promotions = [
  {
    id: 1,
    title: 'Mã giảm giá',
    subtitle: 'Giảm đến 500K',
    code: 'SUMMER500',
    bgColor: 'bg-gradient-to-br from-accent to-orange-600',
  },
  {
    id: 2,
    title: 'Ưu đãi Sinh viên',
    subtitle: 'Giảm thêm 10%',
    description: 'Xác minh qua email .edu',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
  },
  {
    id: 3,
    title: 'Flash Sale',
    subtitle: 'Mỗi ngày 12h',
    description: 'Giảm đến 50%',
    bgColor: 'bg-gradient-to-br from-success to-emerald-600',
  },
];

// ============================================================
// Helper: Format giá tiền sang định dạng Việt Nam
// ============================================================
export function formatPrice(price) {
  if (!price && price !== 0) return '—';
  return price.toLocaleString('vi-VN') + '₫';
}
