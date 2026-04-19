'use client';

import { categories } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { fetchActiveVouchers } from '@/lib/voucherService';
import useAuthStore from '@/store/authStore';
import {
  Check,
  ChevronRight,
  ClipboardCopy,
  Home,
  Laptop,
  Smartphone,
  Tablet,
  Ticket,
  Tv,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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

// Right Sidebar - Vouchers
export function PromotionSidebar() {
  const user = useAuthStore((state) => state.user);
  const isStudent = user?.email?.toLowerCase().endsWith('.edu.vn');

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function getVouchers() {
      setLoading(true);
      const data = await fetchActiveVouchers();
      setVouchers(data);
      setLoading(false);
    }
    getVouchers();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCopy = useCallback(async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      showToast(`Đã copy mã "${code}"`, 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Không thể copy mã', 'error');
    }
  }, []);

  if (loading) {
    return (
      <aside className="hidden lg:block w-[220px] flex-shrink-0">
        <div className="sticky top-20 space-y-4">
          {[1, 2, 3].map((i) => (
             <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  const bgColors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];

  return (
    <aside className="hidden lg:block w-[220px] flex-shrink-0">
      {/* Toast inline */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[100] p-3 px-5 rounded-xl text-sm font-medium border-2 shadow-xl animate-in slide-in-from-bottom fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-card text-success border-success/30'
              : 'bg-card text-destructive border-destructive/30'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="sticky top-20 space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
           <Ticket className="h-5 w-5 text-accent" />
           <h3 className="font-bold text-foreground">Góc Ưu Đãi</h3>
        </div>
        
        {/* Student Voucher */}
        {isStudent && (
          <div className="block rounded-xl p-4 text-white overflow-hidden relative group bg-gradient-to-br from-emerald-500 to-teal-600">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20" />
              <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/20" />
            </div>
            <div className="relative z-10 flex flex-col items-start gap-1">
              <h4 className="font-bold text-base line-clamp-1">
                Giảm 10%
              </h4>
              <p className="text-xs opacity-90 font-medium">Sinh viên TechMart</p>
              <div className="mt-2 w-full flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-1.5 pl-3">
                 <code className="text-sm font-mono font-bold tracking-wider">SV-TECHMART</code>
                 <button
                   onClick={(e) => {
                     e.preventDefault();
                     handleCopy('SV-TECHMART', 'sv-voucher');
                   }}
                   className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                   title={`Copy mã SV-TECHMART`}
                 >
                   {copiedId === 'sv-voucher' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" />
                    )}
                 </button>
              </div>
            </div>
          </div>
        )}

        {!isStudent && vouchers.length === 0 ? (
           <p className="text-sm text-muted-foreground px-1">Hiện chưa có ưu đãi nào.</p>
        ) : vouchers.map((v, index) => {
          const bgColor = bgColors[index % bgColors.length];
          return (
            <div
              key={v.id}
              className={cn(
                "block rounded-xl p-4 text-white overflow-hidden relative group",
                bgColor
              )}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20" />
                <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/20" />
              </div>

              <div className="relative z-10 flex flex-col items-start gap-1">
                <h4 className="font-bold text-base line-clamp-1">
                  {v.type === 'percentage'
                      ? `Giảm ${v.value}%`
                      : `Giảm ${Number(v.value).toLocaleString('vi-VN')}đ`}
                </h4>
                <p className="text-xs opacity-90 font-medium">Tất cả sản phẩm</p>
                <div className="mt-2 w-full flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-1.5 pl-3">
                   <code className="text-sm font-mono font-bold tracking-wider">{v.code}</code>
                   <button
                     onClick={(e) => {
                       e.preventDefault();
                       handleCopy(v.code, v.id);
                     }}
                     className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
                     title={`Copy mã ${v.code}`}
                   >
                     {copiedId === v.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ClipboardCopy className="h-4 w-4" />
                      )}
                   </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  );
}
