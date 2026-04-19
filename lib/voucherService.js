import { supabase } from '@/lib/supabase';

/**
 * Fetch tất cả Voucher đang active (is_active = true)
 */
export async function fetchActiveVouchers() {
  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active vouchers:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetch tất cả Voucher (bao gồm inactive) — chỉ dùng cho Admin
 */
export async function fetchAllVouchers() {
  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all vouchers:', error);
    return [];
  }
  return data || [];
}

/**
 * Tạo Voucher mới — mặc định is_active = true
 * @param {{ code: string, type: 'percentage' | 'fixed', value: number }} voucher
 */
export async function createVoucher({ code, type, value }) {
  const { data, error } = await supabase
    .from('vouchers')
    .insert([
      {
        code: code.toUpperCase().trim(),
        type,
        value: Number(value),
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating voucher:', error);
    throw error;
  }
  return data;
}

/**
 * Xóa Voucher theo ID
 */
export async function deleteVoucher(id) {
  const { error } = await supabase.from('vouchers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting voucher:', error);
    throw error;
  }
}

/**
 * Bật/tắt Voucher
 */
export async function toggleVoucher(id, isActive) {
  const { data, error } = await supabase
    .from('vouchers')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error toggling voucher:', error);
    throw error;
  }
  return data;
}
