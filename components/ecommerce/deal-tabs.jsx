'use client';

import { dealTabs } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Clock, Zap } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from './product-card';

export function DealTabs({ onAddToCart }) {
  const [activeTab, setActiveTab] = useState(dealTabs[0].id);

  const currentTab = dealTabs.find((tab) => tab.id === activeTab);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Ưu đãi hôm nay
            </h2>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Giảm giá sốc - Số lượng có hạn
            </p>
          </div>
        </div>

        {/* Countdown Timer Mockup */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-destructive" />
          <span className="text-muted-foreground">Kết thúc sau:</span>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded bg-destructive text-destructive-foreground font-bold">
              05
            </span>
            <span className="text-foreground font-bold">:</span>
            <span className="inline-flex items-center justify-center h-8 w-8 rounded bg-destructive text-destructive-foreground font-bold">
              23
            </span>
            <span className="text-foreground font-bold">:</span>
            <span className="inline-flex items-center justify-center h-8 w-8 rounded bg-destructive text-destructive-foreground font-bold">
              47
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border overflow-x-auto hide-scrollbar">
        <nav className="flex gap-1 min-w-max" role="tablist">
          {dealTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                activeTab === tab.id
                  ? "text-accent font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.name}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentTab?.products.slice(0, 5).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
