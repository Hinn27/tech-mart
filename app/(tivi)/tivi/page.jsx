import { getProductsByCategory } from '@/lib/productService';
import TiviClient from './tivi-client';

// Server Component — fetch dữ liệu từ Supabase
export default async function TiviPage() {
  const products = await getProductsByCategory('tivi');
  return <TiviClient products={products} />;
}
