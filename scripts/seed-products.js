/**
 * Script seed dữ liệu mock vào Supabase
 * Chạy: node scripts/seed-products.js
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Dữ liệu sản phẩm từ mock-data.js
const products = [
  // Điện thoại
  { name: 'iPhone 16 Pro Max 256GB - Titan Đen', slug: 'phone-1', category: 'dien-thoai', price: 34990000, original_price: 36990000, discount: 5, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', rating: 4.9, review_count: 1250, badge: 'hot', in_stock: true },
  { name: 'Samsung Galaxy S24 Ultra 512GB', slug: 'phone-2', category: 'dien-thoai', price: 31990000, original_price: 33990000, discount: 6, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop', rating: 4.8, review_count: 890, badge: 'sale', in_stock: true },
  { name: 'Xiaomi 14 Ultra 512GB - Đen', slug: 'phone-3', category: 'dien-thoai', price: 23990000, original_price: 25990000, discount: 8, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', rating: 4.7, review_count: 456, badge: 'new', in_stock: true },
  { name: 'OPPO Find X7 Ultra 256GB', slug: 'phone-4', category: 'dien-thoai', price: 22990000, original_price: 24990000, discount: 8, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', rating: 4.6, review_count: 234, in_stock: true },
  { name: 'Honor Magic 6 Pro 512GB', slug: 'phone-5', category: 'dien-thoai', price: 19990000, original_price: 21990000, discount: 9, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', rating: 4.5, review_count: 189, badge: 'sale', in_stock: true },

  // Máy tính bảng
  { name: 'iPad Pro M4 13 inch WiFi 256GB', slug: 'tablet-1', category: 'may-tinh-bang', price: 32990000, original_price: 34990000, discount: 6, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', rating: 4.9, review_count: 567, badge: 'hot', in_stock: true },
  { name: 'Samsung Galaxy Tab S9 Ultra 512GB', slug: 'tablet-2', category: 'may-tinh-bang', price: 27990000, original_price: 29990000, discount: 7, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop', rating: 4.8, review_count: 345, badge: 'sale', in_stock: true },
  { name: 'iPad Air M2 11 inch WiFi 128GB', slug: 'tablet-3', category: 'may-tinh-bang', price: 16990000, original_price: 17990000, discount: 6, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', rating: 4.7, review_count: 423, in_stock: true },
  { name: 'Xiaomi Pad 6S Pro 12.4 inch 256GB', slug: 'tablet-4', category: 'may-tinh-bang', price: 12990000, original_price: 14990000, discount: 13, image: 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=400&fit=crop', rating: 4.6, review_count: 234, badge: 'new', in_stock: true },
  { name: 'Huawei MatePad Pro 13.2 inch 256GB', slug: 'tablet-5', category: 'may-tinh-bang', price: 18990000, original_price: 20990000, discount: 10, image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400&h=400&fit=crop', rating: 4.5, review_count: 156, in_stock: true },

  // Laptop
  { name: 'MacBook Pro 16 M3 Max 36GB 1TB', slug: 'laptop-1', category: 'laptop', price: 89990000, original_price: 94990000, discount: 5, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', rating: 4.9, review_count: 234, badge: 'hot', in_stock: true },
  { name: 'ASUS ROG Strix G16 i9-14900HX RTX 4080', slug: 'laptop-2', category: 'laptop', price: 59990000, original_price: 64990000, discount: 8, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop', rating: 4.8, review_count: 189, badge: 'sale', in_stock: true },
  { name: 'Dell XPS 15 i7-13700H 32GB 1TB RTX 4060', slug: 'laptop-3', category: 'laptop', price: 45990000, original_price: 49990000, discount: 8, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', rating: 4.7, review_count: 312, in_stock: true },
  { name: 'MacBook Air 15 M3 16GB 512GB', slug: 'laptop-4', category: 'laptop', price: 36990000, original_price: 38990000, discount: 5, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop', rating: 4.8, review_count: 567, badge: 'new', in_stock: true },
  { name: 'Lenovo Legion Pro 7i i9-14900HX RTX 4090', slug: 'laptop-5', category: 'laptop', price: 79990000, original_price: 84990000, discount: 6, image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop', rating: 4.9, review_count: 145, in_stock: true },

  // Tivi
  { name: 'Samsung Neo QLED 8K 85 inch QN900D', slug: 'tv-1', category: 'tivi', price: 129990000, original_price: 139990000, discount: 7, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', rating: 4.9, review_count: 89, badge: 'hot', in_stock: true },
  { name: 'LG OLED evo G4 77 inch 4K Smart TV', slug: 'tv-2', category: 'tivi', price: 89990000, original_price: 94990000, discount: 5, image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop', rating: 4.8, review_count: 156, badge: 'sale', in_stock: true },
  { name: 'Sony BRAVIA XR A95L 65 inch OLED 4K', slug: 'tv-3', category: 'tivi', price: 79990000, original_price: 84990000, discount: 6, image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop', rating: 4.9, review_count: 123, in_stock: true },
  { name: 'TCL C845 75 inch Mini LED 4K QLED', slug: 'tv-4', category: 'tivi', price: 34990000, original_price: 39990000, discount: 13, image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=400&fit=crop', rating: 4.6, review_count: 234, badge: 'sale', in_stock: true },
  { name: 'Samsung The Frame 55 inch QLED 4K 2024', slug: 'tv-5', category: 'tivi', price: 29990000, original_price: 32990000, discount: 9, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop', rating: 4.7, review_count: 345, badge: 'new', in_stock: true },

  // Gia dụng
  { name: 'Dyson V15 Detect Absolute - Máy hút bụi', slug: 'appliance-1', category: 'gia-dung', price: 18990000, original_price: 21990000, discount: 14, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop', rating: 4.9, review_count: 567, badge: 'hot', in_stock: true },
  { name: 'Roborock S8 Pro Ultra - Robot hút bụi', slug: 'appliance-2', category: 'gia-dung', price: 32990000, original_price: 36990000, discount: 11, image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=400&fit=crop', rating: 4.8, review_count: 345, badge: 'sale', in_stock: true },
  { name: 'Philips Air Purifier AC3858', slug: 'appliance-3', category: 'gia-dung', price: 12990000, original_price: 14990000, discount: 13, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', rating: 4.7, review_count: 234, in_stock: true },
  { name: 'Xiaomi Smart Air Fryer 6.5L', slug: 'appliance-4', category: 'gia-dung', price: 2490000, original_price: 2990000, discount: 17, image: 'https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=400&h=400&fit=crop', rating: 4.6, review_count: 890, badge: 'new', in_stock: true },
  { name: 'Dyson Purifier Hot+Cool HP07', slug: 'appliance-5', category: 'gia-dung', price: 16990000, original_price: 18990000, discount: 11, image: 'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=400&h=400&fit=crop', rating: 4.8, review_count: 456, in_stock: true },
];

async function seed() {
  console.log('🌱 Bắt đầu seed dữ liệu vào Supabase...');

  // Xóa dữ liệu cũ
  const { error: deleteError } = await supabase.from('products').delete().neq('id', 0);
  if (deleteError) console.log('⚠️ Bảng products có thể chưa có dữ liệu:', deleteError.message);

  // Insert dữ liệu mới
  const { data, error } = await supabase.from('products').insert(products).select();

  if (error) {
    console.error('❌ Lỗi khi seed:', error);
    return;
  }

  console.log(`✅ Seed thành công ${data.length} sản phẩm!`);

  // Thống kê theo danh mục
  const counts = {};
  data.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  console.log('📊 Thống kê:');
  Object.entries(counts).forEach(([cat, count]) => {
    console.log(`   - ${cat}: ${count} sản phẩm`);
  });
}

seed();
