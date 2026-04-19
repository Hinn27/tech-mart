import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  calculateVoucherDiscount,
  normalizeVoucherCode,
  validateVoucher,
} from '@/lib/voucherUtils';

const safeLocalStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(name, value);
      } catch {
        // Ignore storage errors.
      }
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(name);
      } catch {
        // Ignore storage errors.
      }
    }
  },
};

const useVoucherStore = create(
  persist(
    (set, get) => ({
      appliedVoucher: null,
      voucherError: '',

      applyVoucher: (code, availableVouchers, subtotal) => {
        const normalizedCode = normalizeVoucherCode(code);
        if (!normalizedCode) {
          set({ voucherError: 'Vui lòng nhập mã giảm giá' });
          return { success: false, error: 'Vui lòng nhập mã giảm giá' };
        }

        const foundVoucher = (availableVouchers || []).find(
          (voucher) => normalizeVoucherCode(voucher.code) === normalizedCode
        );

        const validationError = validateVoucher(foundVoucher);
        if (validationError) {
          set({ voucherError: validationError });
          return { success: false, error: validationError };
        }

        const discountAmount = calculateVoucherDiscount(foundVoucher, subtotal);
        set({ appliedVoucher: foundVoucher, voucherError: '' });
        return { success: true, voucher: foundVoucher, discountAmount };
      },

      removeVoucher: () => {
        set({ appliedVoucher: null, voucherError: '' });
      },

      clearVoucherError: () => set({ voucherError: '' }),

      getDiscountAmount: (subtotal) => {
        const voucher = get().appliedVoucher;
        return calculateVoucherDiscount(voucher, subtotal);
      },
    }),
    {
      name: 'techelite-voucher-storage',
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

export default useVoucherStore;
