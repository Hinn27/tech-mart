'use client';

import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function DatHangThanhCongPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center max-w-md w-full text-center space-y-6">
        {/* Icon Checkmark */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-14 w-14 text-success" />
          </div>
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-success/20 animate-ping" />
        </div>

        {/* Tiêu đề H1 */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
          Đặt hàng thành công!
        </h1>

        {/* Mô tả */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
          Cảm ơn bạn đã mua sắm. Mã đơn hàng của bạn là{' '}
          <span className="font-bold text-foreground">#VN889900</span>.
          <br />
          Chúng tôi sẽ sớm liên hệ để giao hàng.
        </p>

        {/* Chi tiết đơn hàng (trang trí) */}
        <div className="w-full rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Trạng thái</span>
            <span className="font-semibold text-success">✓ Đã xác nhận</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Mã đơn hàng</span>
            <span className="font-mono font-bold text-foreground">#VN889900</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Dự kiến giao</span>
            <span className="font-semibold text-foreground">3-5 ngày</span>
          </div>
        </div>

        {/* Nút tiếp tục mua sắm */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-accent hover:bg-accent/90 transition-all active:scale-[0.98] shadow-lg"
        >
          <ShoppingBag className="h-5 w-5" />
          Tiếp tục mua sắm
          <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Liên kết phụ */}
        <p className="text-xs text-muted-foreground">
          Cần hỗ trợ?{' '}
          <a href="#" className="text-accent hover:underline font-medium">
            Liên hệ tổng đài 1900-xxxx
          </a>
        </p>
      </div>
    </div>
  );
}
