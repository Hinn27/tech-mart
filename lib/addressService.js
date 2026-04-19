import { supabase } from '@/lib/supabase';

function normalizeAddress(address) {
  if (!address) return null;

  return {
    id: address.id,
    user_id: address.user_id,
    label: address.label || '',
    recipient_name: address.recipient_name || address.full_name || '',
    phone: address.phone || '',
    province: address.province || '',
    district: address.district || '',
    ward: address.ward || '',
    address_line: address.address_line || '',
    is_default: Boolean(address.is_default),
    created_at: address.created_at,
    updated_at: address.updated_at,
  };
}

export function formatFullAddress(address) {
  if (!address) return '';
  return [address.address_line, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(', ');
}

export async function fetchUserAddresses(userId) {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[AddressService] Lỗi lấy địa chỉ:', error);
    throw error;
  }

  return (data || []).map(normalizeAddress);
}

async function clearDefaultAddress(userId, excludeId = null) {
  let query = supabase
    .from('user_addresses')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { error } = await query;
  if (error) {
    console.error('[AddressService] Lỗi reset địa chỉ mặc định:', error);
    throw error;
  }
}

export async function createUserAddress(address) {
  if (address.is_default) {
    await clearDefaultAddress(address.user_id);
  }

  const { data, error } = await supabase
    .from('user_addresses')
    .insert({
      user_id: address.user_id,
      label: address.label?.trim() || 'Địa chỉ mới',
      full_name: address.recipient_name?.trim() || '',
      phone: address.phone?.trim() || '',
      province: address.province?.trim() || '',
      district: address.district?.trim() || '',
      ward: address.ward?.trim() || '',
      address_line: address.address_line?.trim() || '',
      is_default: Boolean(address.is_default),
    })
    .select('*')
    .single();

  if (error) {
    console.error('[AddressService] Lỗi tạo địa chỉ:', error);
    throw error;
  }

  return normalizeAddress(data);
}

export async function updateUserAddress(id, address) {
  if (address.is_default) {
    await clearDefaultAddress(address.user_id, id);
  }

  const { data, error } = await supabase
    .from('user_addresses')
    .update({
      label: address.label?.trim() || 'Địa chỉ mới',
      full_name: address.recipient_name?.trim() || '',
      phone: address.phone?.trim() || '',
      province: address.province?.trim() || '',
      district: address.district?.trim() || '',
      ward: address.ward?.trim() || '',
      address_line: address.address_line?.trim() || '',
      is_default: Boolean(address.is_default),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[AddressService] Lỗi cập nhật địa chỉ:', error);
    throw error;
  }

  return normalizeAddress(data);
}

export async function deleteUserAddress(id) {
  const { error } = await supabase.from('user_addresses').delete().eq('id', id);

  if (error) {
    console.error('[AddressService] Lỗi xóa địa chỉ:', error);
    throw error;
  }
}

export async function setDefaultUserAddress(id, userId) {
  await clearDefaultAddress(userId, id);

  const { data, error } = await supabase
    .from('user_addresses')
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    console.error('[AddressService] Lỗi chọn địa chỉ mặc định:', error);
    throw error;
  }

  return normalizeAddress(data);
}
