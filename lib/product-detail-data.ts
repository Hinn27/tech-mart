// Chi tiết sản phẩm mẫu cho Product Detail Page

export interface ProductVariant {
  id: string;
  storage: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image: string;
}

export interface ProductPromotion {
  id: string;
  title: string;
  description: string;
}

export interface ProductSpecification {
  category: string;
  specs: { label: string; value: string }[];
}

export interface ProductReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  images?: string[];
}

export interface ProductDetail {
  id: string;
  name: string;
  shortName: string;
  brand: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: string[];
  variants: ProductVariant[];
  colors: ProductColor[];
  promotions: ProductPromotion[];
  specifications: ProductSpecification[];
  highlights: string;
  reviews: ProductReview[];
}

// iPhone 16 Pro Max chi tiết
export const iphone16ProMaxDetail: ProductDetail = {
  id: 'phone-iphone-16-pro-max',
  name: 'iPhone 16 Pro Max',
  shortName: 'iPhone 16 Pro Max',
  brand: 'Apple',
  category: 'Điện thoại',
  categorySlug: 'dien-thoai',
  subcategory: 'iPhone',
  subcategorySlug: 'iphone',
  rating: 4.9,
  reviewCount: 1240,
  soldCount: 5680,
  images: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1695048064884-b7fae9c3d5dc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1695048064879-0c39eb0b8e52?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
  ],
  variants: [
    { id: 'v1', storage: '256GB', price: 34990000, originalPrice: 36990000, inStock: true },
    { id: 'v2', storage: '512GB', price: 40990000, originalPrice: 42990000, inStock: true },
    { id: 'v3', storage: '1TB', price: 46990000, originalPrice: 48990000, inStock: false },
  ],
  colors: [
    { id: 'c1', name: 'Titan Tự nhiên', hex: '#8A8680', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop' },
    { id: 'c2', name: 'Titan Đen', hex: '#3C3C3C', image: 'https://images.unsplash.com/photo-1695048064884-b7fae9c3d5dc?w=800&h=800&fit=crop' },
    { id: 'c3', name: 'Titan Trắng', hex: '#F5F5F0', image: 'https://images.unsplash.com/photo-1695048064879-0c39eb0b8e52?w=800&h=800&fit=crop' },
    { id: 'c4', name: 'Titan Sa mạc', hex: '#BFA48F', image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop' },
  ],
  promotions: [
    { id: 'p1', title: 'Trả góp 0%', description: 'Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng hoặc công ty tài chính' },
    { id: 'p2', title: 'Tặng ốp lưng', description: 'Tặng ốp lưng chính hãng Apple trị giá 890.000₫' },
    { id: 'p3', title: 'Giảm thêm 500K', description: 'Nhập mã IPHONE500 khi thanh toán để được giảm thêm 500.000₫' },
    { id: 'p4', title: 'Bảo hành 2 năm', description: 'Bảo hành chính hãng 24 tháng tại trung tâm Apple' },
    { id: 'p5', title: 'Thu cũ đổi mới', description: 'Thu cũ iPhone đời cũ, giảm đến 5.000.000₫ khi lên đời' },
  ],
  specifications: [
    {
      category: 'Màn hình',
      specs: [
        { label: 'Công nghệ màn hình', value: 'Super Retina XDR OLED' },
        { label: 'Kích thước', value: '6.9 inch' },
        { label: 'Độ phân giải', value: '2868 x 1320 pixels' },
        { label: 'Tần số quét', value: '120Hz ProMotion' },
        { label: 'Độ sáng tối đa', value: '2000 nits (ngoài trời)' },
      ],
    },
    {
      category: 'Camera sau',
      specs: [
        { label: 'Camera chính', value: '48MP, f/1.78, OIS, sensor-shift' },
        { label: 'Camera góc siêu rộng', value: '48MP, f/2.2, 120°' },
        { label: 'Camera tele 5x', value: '12MP, f/2.8, OIS' },
        { label: 'Quay video', value: '4K@120fps, Dolby Vision HDR, ProRes' },
        { label: 'Tính năng', value: 'Action Mode, Cinematic Mode, Photonic Engine' },
      ],
    },
    {
      category: 'Camera trước',
      specs: [
        { label: 'Độ phân giải', value: '12MP, f/1.9' },
        { label: 'Tính năng', value: 'Face ID, Animoji, Memoji, Smart HDR 5' },
      ],
    },
    {
      category: 'Hiệu năng',
      specs: [
        { label: 'Chip xử lý', value: 'Apple A18 Pro (3nm)' },
        { label: 'CPU', value: '6 nhân (2 hiệu năng cao + 4 tiết kiệm)' },
        { label: 'GPU', value: '6 nhân, Ray Tracing' },
        { label: 'Neural Engine', value: '16 nhân' },
        { label: 'RAM', value: '8GB' },
      ],
    },
    {
      category: 'Bộ nhớ',
      specs: [
        { label: 'Dung lượng', value: '256GB / 512GB / 1TB' },
        { label: 'Thẻ nhớ ngoài', value: 'Không hỗ trợ' },
      ],
    },
    {
      category: 'Pin & Sạc',
      specs: [
        { label: 'Dung lượng pin', value: '4685mAh' },
        { label: 'Sạc nhanh', value: '27W có dây, 25W MagSafe' },
        { label: 'Thời gian sạc đầy', value: '~2 giờ' },
        { label: 'Cổng sạc', value: 'USB-C (USB 3.0)' },
      ],
    },
    {
      category: 'Kết nối',
      specs: [
        { label: 'SIM', value: 'Nano SIM + eSIM (hỗ trợ 2 eSIM)' },
        { label: '5G', value: 'Có' },
        { label: 'WiFi', value: 'WiFi 7 (802.11be)' },
        { label: 'Bluetooth', value: '5.3' },
        { label: 'NFC', value: 'Có (Apple Pay)' },
      ],
    },
    {
      category: 'Thiết kế & Trọng lượng',
      specs: [
        { label: 'Kích thước', value: '163.0 x 77.6 x 8.25 mm' },
        { label: 'Trọng lượng', value: '227g' },
        { label: 'Chất liệu khung', value: 'Titanium Grade 5' },
        { label: 'Mặt lưng', value: 'Kính cường lực' },
        { label: 'Chuẩn kháng nước', value: 'IP68 (6m/30 phút)' },
      ],
    },
  ],
  highlights: `
    <h3>iPhone 16 Pro Max - Đỉnh cao công nghệ smartphone</h3>
    <p>iPhone 16 Pro Max là chiếc điện thoại mạnh mẽ nhất mà Apple từng tạo ra, với chip A18 Pro tiên tiến được sản xuất trên tiến trình 3nm thế hệ thứ 2, mang đến hiệu năng vượt trội và hiệu suất năng lượng tuyệt vời.</p>
    
    <h4>Màn hình Super Retina XDR lớn nhất</h4>
    <p>Với kích thước 6.9 inch, iPhone 16 Pro Max sở hữu màn hình lớn nhất từ trước đến nay trên iPhone. Công nghệ ProMotion với tần số quét thích ứng từ 1Hz đến 120Hz mang đến trải nghiệm mượt mà trong mọi thao tác.</p>
    
    <img src="https://images.unsplash.com/photo-1695048064884-b7fae9c3d5dc?w=800&h=450&fit=crop" alt="iPhone 16 Pro Max Display" />
    
    <h4>Hệ thống camera Pro cách mạng</h4>
    <p>Hệ thống camera Pro được nâng cấp toàn diện với camera chính 48MP và camera góc siêu rộng 48MP hoàn toàn mới. Camera tele 5x tetraprism cho phép zoom quang học xa hơn bao giờ hết, cùng với khả năng quay video 4K@120fps ấn tượng.</p>
    
    <img src="https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=450&fit=crop" alt="iPhone 16 Pro Max Camera" />
    
    <h4>Thiết kế Titanium cao cấp</h4>
    <p>Khung viền được chế tác từ Titanium Grade 5 - cùng loại hợp kim được sử dụng trong tàu vũ trụ - mang đến sự bền bỉ tuyệt đối trong khi giảm trọng lượng đáng kể so với thép không gỉ.</p>
    
    <h4>Action Button - Nút tác vụ mới</h4>
    <p>Nút Action Button thay thế công tắc rung, cho phép bạn tùy chỉnh để kích hoạt nhanh các tính năng yêu thích như Camera, Flashlight, Voice Memo, hoặc bất kỳ Shortcut nào bạn muốn.</p>
  `,
  reviews: [
    {
      id: 'r1',
      author: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      rating: 5,
      date: '15/03/2024',
      content: 'Máy quá đẹp và mượt! Chip A18 Pro xử lý mọi tác vụ rất nhanh. Camera chụp ảnh đêm cực kỳ ấn tượng. Rất hài lòng với sản phẩm.',
      helpful: 234,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1695048064884-b7fae9c3d5dc?w=400&h=400&fit=crop',
      ],
    },
    {
      id: 'r2',
      author: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      date: '12/03/2024',
      content: 'Nâng cấp từ iPhone 13 Pro Max, thực sự thấy sự khác biệt rõ rệt. Màn hình sáng hơn, pin trâu hơn, và Action Button rất tiện lợi.',
      helpful: 189,
    },
    {
      id: 'r3',
      author: 'Lê Văn C',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
      rating: 4,
      date: '10/03/2024',
      content: 'Máy tốt nhưng hơi nặng với mình. Tuy nhiên camera zoom 5x là điểm cộng lớn, chụp ảnh từ xa rất nét.',
      helpful: 156,
    },
    {
      id: 'r4',
      author: 'Phạm Thị D',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
      rating: 5,
      date: '08/03/2024',
      content: 'Đóng gói cẩn thận, giao hàng nhanh. Máy chính hãng 100%, đã check trên trang Apple. Sẽ ủng hộ shop tiếp!',
      helpful: 98,
    },
    {
      id: 'r5',
      author: 'Hoàng Văn E',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      date: '05/03/2024',
      content: 'Quay video 4K 120fps quá mượt, dùng làm content creation cực kỳ phù hợp. Pin dùng được cả ngày dài.',
      helpful: 87,
    },
  ],
};

// Samsung Galaxy S24 Ultra chi tiết
export const samsungS24UltraDetail: ProductDetail = {
  id: 'phone-samsung-s24-ultra',
  name: 'Samsung Galaxy S24 Ultra',
  shortName: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  category: 'Điện thoại',
  categorySlug: 'dien-thoai',
  subcategory: 'Samsung',
  subcategorySlug: 'samsung',
  rating: 4.8,
  reviewCount: 890,
  soldCount: 3450,
  images: [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
  ],
  variants: [
    { id: 'v1', storage: '256GB', price: 31990000, originalPrice: 33990000, inStock: true },
    { id: 'v2', storage: '512GB', price: 36990000, originalPrice: 38990000, inStock: true },
    { id: 'v3', storage: '1TB', price: 42990000, originalPrice: 44990000, inStock: true },
  ],
  colors: [
    { id: 'c1', name: 'Titan Xám', hex: '#5C5C5C', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop' },
    { id: 'c2', name: 'Titan Đen', hex: '#2C2C2C', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop' },
    { id: 'c3', name: 'Titan Tím', hex: '#6B5B7B', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop' },
    { id: 'c4', name: 'Titan Vàng', hex: '#C4A862', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop' },
  ],
  promotions: [
    { id: 'p1', title: 'Trả góp 0%', description: 'Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng hoặc Samsung Finance+' },
    { id: 'p2', title: 'Tặng Galaxy Buds FE', description: 'Tặng tai nghe Galaxy Buds FE chính hãng trị giá 2.490.000₫' },
    { id: 'p3', title: 'Giảm thêm 1 Triệu', description: 'Nhập mã GALAXY1TR khi thanh toán để được giảm thêm 1.000.000₫' },
    { id: 'p4', title: 'Bảo hành 2 năm', description: 'Bảo hành chính hãng 24 tháng tại trung tâm Samsung' },
    { id: 'p5', title: 'Thu cũ đổi mới', description: 'Thu cũ điện thoại đời cũ, giảm đến 4.000.000₫ khi lên đời' },
  ],
  specifications: [
    {
      category: 'Màn hình',
      specs: [
        { label: 'Công nghệ màn hình', value: 'Dynamic AMOLED 2X' },
        { label: 'Kích thước', value: '6.8 inch' },
        { label: 'Độ phân giải', value: '3120 x 1440 pixels (QHD+)' },
        { label: 'Tần số quét', value: '120Hz thích ứng' },
        { label: 'Độ sáng tối đa', value: '2600 nits' },
      ],
    },
    {
      category: 'Camera sau',
      specs: [
        { label: 'Camera chính', value: '200MP, f/1.7, OIS' },
        { label: 'Camera góc siêu rộng', value: '12MP, f/2.2, 120°' },
        { label: 'Camera tele 3x', value: '10MP, f/2.4, OIS' },
        { label: 'Camera tele 10x', value: '50MP, f/3.4, OIS, zoom quang 5x' },
        { label: 'Quay video', value: '8K@30fps, 4K@120fps' },
      ],
    },
    {
      category: 'Hiệu năng',
      specs: [
        { label: 'Chip xử lý', value: 'Snapdragon 8 Gen 3 for Galaxy' },
        { label: 'CPU', value: '8 nhân (1x3.39GHz + 5x3.1GHz + 2x2.9GHz)' },
        { label: 'GPU', value: 'Adreno 750' },
        { label: 'RAM', value: '12GB' },
      ],
    },
    {
      category: 'Bộ nhớ',
      specs: [
        { label: 'Dung lượng', value: '256GB / 512GB / 1TB' },
        { label: 'Thẻ nhớ ngoài', value: 'Không hỗ trợ' },
      ],
    },
    {
      category: 'Pin & Sạc',
      specs: [
        { label: 'Dung lượng pin', value: '5000mAh' },
        { label: 'Sạc nhanh', value: '45W có dây, 15W không dây' },
        { label: 'Cổng sạc', value: 'USB-C (USB 3.2)' },
      ],
    },
    {
      category: 'Thiết kế & Trọng lượng',
      specs: [
        { label: 'Kích thước', value: '162.3 x 79.0 x 8.6 mm' },
        { label: 'Trọng lượng', value: '232g' },
        { label: 'Chất liệu khung', value: 'Titanium' },
        { label: 'Chuẩn kháng nước', value: 'IP68' },
      ],
    },
  ],
  highlights: `
    <h3>Samsung Galaxy S24 Ultra - AI Phone hàng đầu</h3>
    <p>Galaxy S24 Ultra là chiếc điện thoại Android mạnh mẽ nhất của Samsung, tích hợp Galaxy AI thông minh, chip Snapdragon 8 Gen 3 tối ưu và khung viền Titanium cao cấp.</p>

    <h4>Camera 200MP đỉnh cao</h4>
    <p>Hệ thống camera quad với cảm biến chính 200MP, zoom quang 5x và zoom số lên đến 100x Space Zoom, cho phép chụp ảnh từ khoảng cách xa vẫn sắc nét.</p>

    <img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=450&fit=crop" alt="Galaxy S24 Ultra Camera" />

    <h4>Galaxy AI - Trí tuệ nhân tạo</h4>
    <p>Tích hợp Circle to Search, Live Translate, Note Assist, Photo Assist và nhiều tính năng AI thông minh khác giúp cuộc sống dễ dàng hơn.</p>

    <h4>S Pen tích hợp</h4>
    <p>Bút S Pen được tích hợp sẵn với độ trễ cực thấp, hỗ trợ cử chỉ Air Action và nhận diện chữ viết tay chính xác.</p>
  `,
  reviews: [
    {
      id: 'r1',
      author: 'Đặng Văn F',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      date: '20/03/2024',
      content: 'Camera 200MP chụp ảnh cực kỳ chi tiết. Snapdragon 8 Gen 3 chơi game mượt mà. Galaxy AI rất tiện ích.',
      helpful: 189,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      ],
    },
    {
      id: 'r2',
      author: 'Vũ Thị G',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 5,
      date: '18/03/2024',
      content: 'Màn hình sáng đẹp, pin trâu cả ngày. S Pen viết vẽ rất thích.',
      helpful: 145,
    },
    {
      id: 'r3',
      author: 'Bùi Văn H',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
      rating: 4,
      date: '15/03/2024',
      content: 'Máy hơi nặng nhưng cấu hình quá tốt. Zoom 100x ấn tượng.',
      helpful: 98,
    },
  ],
};

// Function to get product detail by ID/slug
export function getProductDetailBySlug(slug: string): ProductDetail | null {
  const productMap: Record<string, ProductDetail> = {
    'phone-iphone-16-pro-max': iphone16ProMaxDetail,
    'iphone-16-pro-max': iphone16ProMaxDetail,
    'phone-1': iphone16ProMaxDetail,
    'phone-samsung-s24-ultra': samsungS24UltraDetail,
    'samsung-s24-ultra': samsungS24UltraDetail,
  };

  return productMap[slug] || iphone16ProMaxDetail; // Default to iPhone for demo
}
