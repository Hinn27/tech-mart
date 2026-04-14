'use client';

import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function ToastNotification({ toasts, onRemove }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Toast Notification hiện ở góc dưới phải
  return createPortal(
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Thông báo"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
}

// ============================================
// Toast Item - Snackbar/Toast nhỏ
// ============================================
function ToastItem({
  toast,
  onRemove,
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => {
        onRemove(toast.id);
      }, 300);
    }, 4000); // Tự động ẩn sau 4 giây

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  // Icon theo loại toast
  const iconMap = {
    success: <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />,
    info: <Info className="h-5 w-5 text-accent flex-shrink-0" />,
  };

  // Màu viền theo loại - Success: viền xanh lá
  const borderMap = {
    success: 'border-success/60',
    error: 'border-destructive/60',
    info: 'border-accent/60',
  };

  // Màu nền icon
  const iconBgMap = {
    success: 'bg-success/10',
    error: 'bg-destructive/10',
    info: 'bg-accent/10',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 shadow-2xl',
        'bg-card backdrop-blur-sm',
        'max-w-sm min-w-[320px]',
        'animate-in slide-in-from-right-full fade-in duration-300',
        isLeaving && 'animate-out slide-out-to-right-full fade-out duration-300',
        borderMap[toast.type]
      )}
      role="alert"
    >
      {/* Icon nền */}
      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0', iconBgMap[toast.type])}>
        {iconMap[toast.type]}
      </div>

      {/* Nội dung thông báo */}
      <div className="flex-1 min-w-0">
        {toast.type === 'success' && (
          <p className="text-sm font-semibold text-success mb-0.5">
            ✓ Thành công!
          </p>
        )}
        <p className="text-sm font-medium text-foreground leading-snug">
          {toast.message}
        </p>
      </div>

      {/* Nút đóng */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        aria-label="Đóng thông báo"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Thanh tiến trình tự động ẩn */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-xl overflow-hidden">
        <div
          className={cn(
            'h-full rounded-b-xl animate-[shrink_4s_linear_forwards]',
            toast.type === 'success' ? 'bg-success/60' : toast.type === 'error' ? 'bg-destructive/60' : 'bg-accent/60'
          )}
          style={{
            animation: 'shrink 4s linear forwards',
          }}
        />
      </div>
    </div>
  );
}

// ============================================
// Hook for managing toasts
// ============================================
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
