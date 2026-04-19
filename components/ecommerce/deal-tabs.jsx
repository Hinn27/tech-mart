'use client';

import { getFlashSaleEndAt, subscribeToSettingUpdates } from '@/lib/settingsService';
import { cn } from '@/lib/utils';
import { Clock, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from './product-card';

function getRemainingTime(targetTime) {
  if (!targetTime) return { hours: '00', minutes: '00', seconds: '00' };

  const diff = Math.max(0, new Date(targetTime).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return { hours, minutes, seconds };
}

export function DealTabs({ dealTabs, onAddToCart }) {
  const [activeTab, setActiveTab] = useState(dealTabs?.[0]?.id || 'phone');
  const [flashSaleEndAt, setFlashSaleEndAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(null));

  const currentTab = useMemo(
    () => dealTabs?.find((tab) => tab.id === activeTab),
    [activeTab, dealTabs]
  );

  useEffect(() => {
    async function loadFlashSaleTime() {
      const value = await getFlashSaleEndAt();
      setFlashSaleEndAt(value);
      setTimeLeft(getRemainingTime(value));
    }

    loadFlashSaleTime();

    const unsubscribe = subscribeToSettingUpdates((key, value) => {
      if (key !== 'flash_sale_end_at') return;
      const nextValue = typeof value === 'string' ? value : null;
      setFlashSaleEndAt(nextValue);
      setTimeLeft(getRemainingTime(nextValue));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!flashSaleEndAt) return undefined;

    const timer = setInterval(() => {
      setTimeLeft(getRemainingTime(flashSaleEndAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSaleEndAt]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Ưu đãi hôm nay</h2>
            <p className="text-sm text-muted-foreground hidden sm:block">Giảm giá sốc - Số lượng có hạn</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-destructive" />
          <span className="text-muted-foreground">Kết thúc sau:</span>
          <div className="flex items-center gap-1">
            {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((segment, index) => (
              <div key={`${segment}-${index}`} className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center h-8 min-w-8 px-2 rounded bg-destructive text-destructive-foreground font-bold">
                  {segment}
                </span>
                {index < 2 && <span className="text-foreground font-bold">:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-border overflow-x-auto hide-scrollbar">
        <nav className="flex gap-1 min-w-max" role="tablist">
          {dealTabs?.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap',
                activeTab === tab.id ? 'text-accent font-semibold' : 'text-muted-foreground hover:text-foreground'
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentTab?.products?.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}
