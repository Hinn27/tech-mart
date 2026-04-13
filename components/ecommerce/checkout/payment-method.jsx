'use client';

import { Banknote, Wallet, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const paymentOptions = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: <Banknote className="h-5 w-5" />,
    iconBg: 'bg-emerald-500',
  },
  {
    id: 'zalopay',
    name: 'Thanh toán qua ZaloPay',
    description: 'Ví điện tử ZaloPay — Giảm thêm 50.000₫',
    icon: (
      <div className="flex h-5 w-5 items-center justify-center font-bold text-[8px] text-white">
        ZP
      </div>
    ),
    iconBg: 'bg-[#0068FF]',
    badge: { text: '-50K', color: 'bg-success/10 text-success' },
  },
  {
    id: 'bank',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản qua Internet Banking / QR Code',
    icon: <Building2 className="h-5 w-5" />,
    iconBg: 'bg-blue-600',
  },
];

export function PaymentMethod({ selectedMethod, onMethodChange }) {
  return (
    <div className="space-y-5">
      {/* ===== Tiêu đề ===== */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-foreground">Phương thức thanh toán</h2>
      </div>

      {/* ===== Các khối hộp chọn — Card với icon/logo ===== */}
      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onMethodChange(option.id)}
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

              {/* Icon / Logo phương thức */}
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white',
                  option.iconBg || 'bg-muted'
                )}
              >
                {option.icon}
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <span className="font-semibold text-sm text-foreground">
                    {option.name}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>

                {/* Badge (VD: -50K cho ZaloPay) */}
                {option.badge && (
                  <span
                    className={cn(
                      'shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold',
                      option.badge.color
                    )}
                  >
                    {option.badge.text}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
