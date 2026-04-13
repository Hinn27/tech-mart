'use client';

import { Truck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/mock-data';

const shippingOptions = [
  {
    id: 'standard',
    name: 'Giao Hàng Tiêu Chuẩn',
    description: 'Dự kiến giao trong 3-5 ngày làm việc',
    price: 0,
    estimatedDays: '3-5 ngày',
    icon: <Truck className="h-5 w-5" />,
    tag: 'Miễn phí',
  },
  {
    id: 'express',
    name: 'Giao Tên Lửa 2h',
    description: 'Giao hàng siêu tốc trong vòng 2 giờ',
    price: 50000,
    estimatedDays: '2 giờ',
    icon: <Zap className="h-5 w-5" />,
    tag: 'Nhanh nhất',
  },
];

export function ShippingMethod({ selectedMethod, onMethodChange }) {
  return (
    <div className="space-y-5">
      {/* ===== Tiêu đề ===== */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Truck className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-base font-bold text-foreground">Phương thức vận chuyển</h2>
      </div>

      {/* ===== Radio buttons dạng khối hộp (Card) ===== */}
      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const isSelected = selectedMethod === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onMethodChange(option.id, option.price)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200',
                isSelected
                  ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                  : 'border-border hover:border-accent/40 hover:bg-muted/30'
              )}
              role="radio"
              aria-checked={isSelected}
            >
              {/* Radio Circle */}
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  isSelected
                    ? 'border-accent'
                    : 'border-muted-foreground/50'
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-accent animate-in zoom-in-50 duration-200" />
                )}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                  isSelected
                    ? 'bg-accent text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {option.icon}
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {option.name}
                    </span>
                    {option.tag && (
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                          option.price === 0
                            ? 'bg-success/10 text-success'
                            : 'bg-accent/10 text-accent'
                        )}
                      >
                        {option.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>

                {/* Giá */}
                <span
                  className={cn(
                    'shrink-0 font-bold text-sm whitespace-nowrap',
                    option.price === 0 ? 'text-success' : 'text-accent'
                  )}
                >
                  {option.price === 0 ? 'Miễn phí' : `+${formatPrice(option.price)}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
