import { getProductsByCategory } from '@/lib/productService';
import LaptopClient from './laptop-client';

// Server Component — fetch dữ liệu từ Supabase
export default async function LaptopPage() {
  const products = await getProductsByCategory('laptop');
  return <LaptopClient products={products} />;
}
