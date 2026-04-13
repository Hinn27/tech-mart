import { getProductsByCategory } from '@/lib/productService';
import DienThoaiClient from './dien-thoai-client';

// Server Component — fetch dữ liệu từ Supabase
export default async function DienThoaiPage() {
  // Gọi API thực tế từ Supabase
  const products = await getProductsByCategory('dien-thoai');

  // Fallback: nếu Supabase chưa có dữ liệu, trả về mảng rỗng
  // Client component sẽ hiển thị empty state hoặc loading
  return <DienThoaiClient products={products} />;
}
