import { getProductsByCategory } from '@/lib/productService';
import MayTinhBangClient from './may-tinh-bang-client';

// Server Component — fetch dữ liệu từ Supabase
export default async function MayTinhBangPage() {
  const products = await getProductsByCategory('may-tinh-bang');
  return <MayTinhBangClient products={products} />;
}
