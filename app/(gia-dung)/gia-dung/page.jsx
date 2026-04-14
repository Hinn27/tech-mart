import { getProductsByCategory } from '@/lib/productService';
import GiaDungClient from './gia-dung-client';

// Server Component — fetch dữ liệu từ Supabase
export default async function GiaDungPage() {
  const products = await getProductsByCategory('gia-dung');
  return <GiaDungClient products={products} />;
}
