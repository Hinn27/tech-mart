import { formatPrice } from '@/lib/mock-data';

export function normalizeVoucherCode(code = '') {
  return code.toUpperCase().trim();
}

export function calculateVoucherDiscount(voucher, subtotal) {
  if (!voucher || !subtotal) return 0;

  if (voucher.type === 'percentage') {
    return Math.round(subtotal * (Number(voucher.value || 0) / 100));
  }

  return Math.min(Number(voucher.value || 0), subtotal);
}

export function formatVoucherValue(voucher) {
  if (!voucher) return '';
  if (voucher.type === 'percentage') {
    return `${Number(voucher.value || 0)}%`;
  }

  return formatPrice(Number(voucher.value || 0));
}

export function formatVoucherLabel(voucher) {
  if (!voucher) return '';
  return voucher.type === 'percentage'
    ? `Giảm ${formatVoucherValue(voucher)}`
    : `Giảm ${formatVoucherValue(voucher)}`;
}

export function validateVoucher(voucher) {
  if (!voucher || !voucher.is_active) {
    return 'Mã giảm giá không hợp lệ hoặc đã bị vô hiệu hóa';
  }

  if (voucher.expired_at && new Date(voucher.expired_at).getTime() < Date.now()) {
    return 'Mã giảm giá đã hết hạn';
  }

  return null;
}
