'use client';

import { categories, promotions } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  GraduationCap,
  Home,
  Laptop,
  Smartphone,
  Tablet,
  Ticket,
  Tv,
  Zap,
} from 'lucide-react';

const categoryIcons = {
  smartphone: <Smartphone className="h-5 w-5" />,
  tablet: <Tablet className="h-5 w-5" />,
  laptop: <Laptop className="h-5 w-5" />,
  tv: <Tv className="h-5 w-5" />,
  home: <Home className="h-5 w-5" />,
};

// Left Sidebar - Categories
export function CategorySidebar() {
  return (
    <aside className="hidden lg:block w-[220px] flex-shrink-0">
      <div className="sticky top-20">
        <div className="rounded-xl bg-card border border-border overflow-hidden card-shadow">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Danh mục sản phẩm</h3>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`/${category.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted hover:text-accent transition-colors group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-muted-foreground group-hover:text-accent transition-colors">
                        {categoryIcons[category.icon]}
                      </span>
                      {category.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}

// Right Sidebar - Promotions
export function PromotionSidebar() {
  const promoIcons = [
    <Ticket className="h-6 w-6" key="ticket" />,
    <GraduationCap className="h-6 w-6" key="grad" />,
    <Zap className="h-6 w-6" key="zap" />,
  ];

  return (
    <aside className="hidden lg:block w-[220px] flex-shrink-0">
      <div className="sticky top-20 space-y-4">
        {promotions.map((promo, index) => (
          <a
            key={promo.id}
            href="#"
            className={cn(
              "block rounded-xl p-5 text-white overflow-hidden relative group",
              promo.bgColor
            )}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20" />
              <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/20" />
            </div>

            <div className="relative z-10">
              <div className="mb-3 opacity-80">
                {promoIcons[index]}
              </div>
              <h4 className="font-bold text-lg mb-1">{promo.title}</h4>
              <p className="text-sm opacity-90 font-medium">{promo.subtitle}</p>
              {promo.code && (
                <div className="mt-3 inline-block px-3 py-1 rounded bg-white/20 backdrop-blur-sm text-xs font-mono font-bold">
                  {promo.code}
                </div>
              )}
              {promo.description && (
                <p className="mt-2 text-xs opacity-75">{promo.description}</p>
              )}
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </aside>
  );
}
