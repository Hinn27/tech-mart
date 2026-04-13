'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// ============================================
// Header tối giản — Chỉ giữ Logo + nút Quay lại
// Loại bỏ Mega Menu, Thanh tìm kiếm, Giỏ hàng
// ============================================
export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Nút Quay lại — Bên trái */}
          <Link href="/" className="shrink-0">
            <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>

          {/* Logo — Chính giữa */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-sm">
              TE
            </div>
            <span className="font-bold text-lg text-foreground">
              TechElite
            </span>
          </Link>

          {/* Placeholder căn lề — Bên phải */}
          <div className="w-[80px]" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
