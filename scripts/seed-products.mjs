import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Seed với các cột TỐI THIỂU nhất - chỉ những cột chắc chắn tồn tại
const products = [
  { name: 'iPhone 16 Pro Max 256GB', slug: 'phone-1', category: 'dien-thoai', price: 34990000, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', rating: 4.9, review_count: 1250 },
  { name: 'Samsung Galaxy S24 Ultra', slug: 'phone-2', category: 'dien-thoai', price: 31990000, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop', rating: 4.8, review_count: 890 },
  { name: 'Xiaomi 14 Ultra 512GB', slug: 'phone-3', category: 'dien-thoai', price: 23990000, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', rating: 4.7, review_count: 456 },
  { name: 'OPPO Find X7 Ultra', slug: 'phone-4', category: 'dien-thoai', price: 22990000, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', rating: 4.6, review_count: 234 },
  { name: 'Honor Magic 6 Pro', slug: 'phone-5', category: 'dien-thoai', price: 19990000, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', rating: 4.5, review_count: 189 },
  { name: 'iPad Pro M4 13 inch', slug: 'tablet-1', category: 'may-tinh-bang', price: 32990000, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', rating: 4.9, review_count: 567 },
  { name: 'Samsung Galaxy Tab S9 Ultra', slug: 'tablet-2', category: 'may-tinh-bang', price: 27990000, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop', rating: 4.8, review_count: 345 },
  { name: 'iPad Air M2 11 inch', slug: 'tablet-3', category: 'may-tinh-bang', price: 16990000, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', rating: 4.7, review_count: 423 },
  { name: 'Xiaomi Pad 6S Pro', slug: 'tablet-4', category: 'may-tinh-bang', price: 12990000, image: 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=400&fit=crop', rating: 4.6, review_count: 234 },
  { name: 'Huawei MatePad Pro 13.2', slug: 'tablet-5', category: 'may-tinh-bang', price: 18990000, image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400&h=400&fit=crop', rating: 4.5, review_count: 156 },
  { name: 'MacBook Pro 16 M3 Max', slug: 'laptop-1', category: 'laptop', price: 89990000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', rating: 4.9, review_count: 234 },
  { name: 'ASUS ROG Strix G16', slug: 'laptop-2', category: 'laptop', price: 59990000, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop', rating: 4.8, review_count: 189 },
  { name: 'Dell XPS 15 i7', slug: 'laptop-3', category: 'laptop', price: 45990000, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', rating: 4.7, review_count: 312 },
  { name: 'MacBook Air 15 M3', slug: 'laptop-4', category: 'laptop', price: 36990000, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop', rating: 4.8, review_count: 567 },
  { name: 'Lenovo Legion Pro 7i', slug: 'laptop-5', category: 'laptop', price: 79990000, image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop', rating: 4.9, review_count: 145 },
  { name: 'Samsung Neo QLED 8K 85"', slug: 'tv-1', category: 'tivi', price: 129990000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', rating: 4.9, review_count: 89 },
  { name: 'LG OLED evo G4 77"', slug: 'tv-2', category: 'tivi', price: 89990000, image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop', rating: 4.8, review_count: 156 },
  { name: 'Sony BRAVIA XR A95L 65"', slug: 'tv-3', category: 'tivi', price: 79990000, image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop', rating: 4.9, review_count: 123 },
  { name: 'TCL C845 75 inch', slug: 'tv-4', category: 'tivi', price: 34990000, image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=400&fit=crop', rating: 4.6, review_count: 234 },
  { name: 'Samsung The Frame 55"', slug: 'tv-5', category: 'tivi', price: 29990000, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop', rating: 4.7, review_count: 345 },
  { name: 'Dyson V15 Detect', slug: 'appliance-1', category: 'gia-dung', price: 18990000, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop', rating: 4.9, review_count: 567 },
  { name: 'Roborock S8 Pro Ultra', slug: 'appliance-2', category: 'gia-dung', price: 32990000, image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=400&fit=crop', rating: 4.8, review_count: 345 },
  { name: 'Philips Air Purifier', slug: 'appliance-3', category: 'gia-dung', price: 12990000, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', rating: 4.7, review_count: 234 },
  { name: 'Xiaomi Air Fryer 6.5L', slug: 'appliance-4', category: 'gia-dung', price: 2490000, image: 'https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=400&h=400&fit=crop', rating: 4.6, review_count: 890 },
  { name: 'Dyson Hot+Cool HP07', slug: 'appliance-5', category: 'gia-dung', price: 16990000, image: 'https://images.unsplash.com/photo-1527698266440-12104e498b76?w=400&h=400&fit=crop', rating: 4.8, review_count: 456 },
];

async function seed() {
  console.log('🌱 Seed dữ liệu vào Supabase...');

  // Thử insert từng sản phẩm để tìm cột nào tồn tại
  const test = products[0];
  const { error: testError } = await supabase.from('products').insert([test]);
  if (testError) {
    console.error('❌ Lỗi với cột cơ bản nhất:', testError.message);
    console.log('\n💡 Schema hiện tại của bảng products có thể khác. Hãy kiểm tra Supabase Dashboard > Table Editor.');
    return;
  }

  // Nếu test thành công, insert tất cả
  const { data, error } = await supabase.from('products').upsert(products, { onConflict: 'slug' }).select();
  if (error) {
    console.error('❌ Lỗi:', error);
    return;
  }

  console.log(`✅ Seed thành công ${data.length} sản phẩm!`);
  const counts = {};
  data.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  console.log('📊 Thống kê:');
  Object.entries(counts).forEach(([cat, count]) => console.log(`   - ${cat}: ${count}`));
}

seed();
