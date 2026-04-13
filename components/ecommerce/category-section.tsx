'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from './product-card';
import { Product } from '@/lib/mock-data';

interface CategorySectionProps {
  title: string;
  slug: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export function CategorySection({ title, slug, products, onAddToCart }: CategorySectionProps) {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          {title}
        </h2>
        <Button
          variant="ghost"
          className="gap-1 text-accent hover:text-accent/80"
          asChild
        >
          <a href={`/danh-muc/${slug}`}>
            Xem thêm
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Products - Horizontal scroll on mobile, grid on desktop */}
      <div className="relative">
        {/* Mobile: Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar md:hidden snap-x snap-mandatory">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[160px] snap-start">
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
