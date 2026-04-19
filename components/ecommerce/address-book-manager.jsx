'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createUserAddress,
  deleteUserAddress,
  fetchUserAddresses,
  formatFullAddress,
  setDefaultUserAddress,
  updateUserAddress,
} from '@/lib/addressService';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import {
  Building2,
  Home,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const emptyForm = {
  label: '',
  recipient_name: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  address_line: '',
  is_default: false,
};

function validatePhone(value) {
  return /^(0[3|5|7|8|9])[0-9]{8}$/.test(value || '');
}

export function AddressBookManager({
  selectionMode = false,
  selectedAddressId,
  onSelectAddress,
  showTitle = true,
  title = 'Sổ địa chỉ',
  emptyMessage = 'Bạn chưa có địa chỉ nào.',
  showAddButton = true,
  externalAddTrigger = 0,
}) {
  const user = useAuthStore((state) => state.user);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (externalAddTrigger > 0) {
      setEditingAddressId(null);
      setFormData(emptyForm);
      setFormError('');
      setShowForm(true);
    }
  }, [externalAddTrigger]);

  const effectiveSelectedId = useMemo(() => {
    if (selectedAddressId) return selectedAddressId;
    const defaultAddress = addresses.find((address) => address.is_default);
    return defaultAddress?.id || addresses[0]?.id || null;
  }, [addresses, selectedAddressId]);

  const loadAddresses = useCallback(async () => {
    if (!user?.id) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUserAddresses(user.id);
      setAddresses(data);
      if (data.length > 0 && !selectedAddressId) {
        const fallbackId = data.find((address) => address.is_default)?.id || data[0].id;
        onSelectAddress?.(fallbackId, data.find((address) => address.id === fallbackId) || data[0]);
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Không thể tải sổ địa chỉ.' });
    } finally {
      setLoading(false);
    }
  }, [onSelectAddress, selectedAddressId, user?.id]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    if (!effectiveSelectedId || !onSelectAddress) return;
    const selected = addresses.find((address) => address.id === effectiveSelectedId);
    if (selected) {
      onSelectAddress(effectiveSelectedId, selected);
    }
  }, [addresses, effectiveSelectedId, onSelectAddress]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const resetForm = () => {
    setEditingAddressId(null);
    setFormData(emptyForm);
    setFormError('');
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setEditingAddressId(address.id);
    setFormData({
      label: address.label || '',
      recipient_name: address.recipient_name || '',
      phone: address.phone || '',
      province: address.province || '',
      district: address.district || '',
      ward: address.ward || '',
      address_line: address.address_line || '',
      is_default: Boolean(address.is_default),
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setFormError('Bạn cần đăng nhập để lưu địa chỉ.');
      return;
    }

    if (!formData.recipient_name.trim() || !formData.phone.trim() || !formData.province.trim() || !formData.district.trim() || !formData.ward.trim() || !formData.address_line.trim()) {
      setFormError('Vui lòng nhập đầy đủ thông tin địa chỉ.');
      return;
    }

    if (!validatePhone(formData.phone.trim())) {
      setFormError('Số điện thoại không hợp lệ.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      let savedAddress;
      const payload = { ...formData, user_id: user.id };

      if (editingAddressId) {
        savedAddress = await updateUserAddress(editingAddressId, payload);
        setToast({ type: 'success', message: 'Đã cập nhật địa chỉ.' });
      } else {
        savedAddress = await createUserAddress(payload);
        setToast({ type: 'success', message: 'Đã thêm địa chỉ mới.' });
      }

      await loadAddresses();
      onSelectAddress?.(savedAddress.id, savedAddress);
      resetForm();
    } catch (error) {
      setFormError(error.message || 'Không thể lưu địa chỉ.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Bạn chắc chắn muốn xoá địa chỉ này?')) return;

    try {
      await deleteUserAddress(addressId);
      const nextAddresses = addresses.filter((address) => address.id !== addressId);
      setAddresses(nextAddresses);
      const fallbackAddress = nextAddresses.find((address) => address.is_default) || nextAddresses[0] || null;
      onSelectAddress?.(fallbackAddress?.id || null, fallbackAddress);
      setToast({ type: 'success', message: 'Đã xoá địa chỉ.' });
      if (editingAddressId === addressId) {
        resetForm();
      }
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Không thể xoá địa chỉ.' });
    }
  };

  const handleSetDefault = async (addressId) => {
    if (!user?.id) return;

    try {
      const defaultAddress = await setDefaultUserAddress(addressId, user.id);
      setAddresses((prev) =>
        prev
          .map((address) => ({ ...address, is_default: address.id === defaultAddress.id }))
          .sort((a, b) => Number(b.is_default) - Number(a.is_default))
      );
      onSelectAddress?.(defaultAddress.id, defaultAddress);
      setToast({ type: 'success', message: 'Đã cập nhật địa chỉ mặc định.' });
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Không thể cập nhật địa chỉ mặc định.' });
    }
  };

  return (
    <div className="space-y-5">
      {(showTitle || showAddButton) && (
        <div className={cn("flex items-center gap-3", showTitle ? "justify-between" : "justify-end mb-2")}>
          {showTitle && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <MapPin className="h-4 w-4 text-accent" />
              </div>
              <h2 className="text-base font-bold text-foreground">{title}</h2>
            </div>
          )}
          {showAddButton && !showForm && (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              Thêm địa chỉ
            </Button>
          )}
        </div>
      )}

      {toast && (
        <div className={cn(
          'rounded-xl border px-4 py-3 text-sm font-medium',
          toast.type === 'success'
            ? 'border-success/30 bg-success/10 text-success'
            : 'border-destructive/30 bg-destructive/10 text-destructive'
        )}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => {
            const isSelected = effectiveSelectedId === address.id;
            return (
              <div
                key={address.id}
                className={cn(
                  'relative rounded-xl border-2 p-4 transition-all',
                  selectionMode && isSelected
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
                    : 'border-border bg-card'
                )}
              >
                {selectionMode && (
                  <button
                    type="button"
                    onClick={() => onSelectAddress?.(address.id, address)}
                    className="absolute inset-0 rounded-xl"
                    aria-label={`Chọn địa chỉ ${address.label}`}
                  />
                )}

                <div className="relative flex items-start gap-3">
                  <div className={cn(
                    'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    address.label.toLowerCase().includes('công') ? 'bg-sky-100 text-sky-700' : 'bg-muted text-muted-foreground'
                  )}>
                    {address.label.toLowerCase().includes('công') ? <Building2 className="h-5 w-5" /> : <Home className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{address.label || 'Địa chỉ'}</span>
                      {address.is_default && (
                        <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                          Mặc định
                        </span>
                      )}
                      {selectionMode && isSelected && (
                        <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                          Đang chọn
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{address.recipient_name}</p>
                    <p className="text-xs text-muted-foreground">{address.phone}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{formatFullAddress(address)}</p>
                  </div>
                </div>

                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  {!address.is_default && (
                    <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => handleSetDefault(address.id)}>
                      <Star className="h-3.5 w-3.5" />
                      Đặt mặc định
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="ghost" className="h-8 gap-1.5" onClick={() => handleEdit(address)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Chỉnh sửa
                  </Button>
                  <Button type="button" size="sm" variant="ghost" className="h-8 gap-1.5 text-destructive hover:text-destructive" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Xóa
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(showForm || editingAddressId) && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-foreground">
              {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h3>
            <Button type="button" variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {formError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {formError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nhãn địa chỉ">
              <Input value={formData.label} onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))} placeholder="Nhà riêng / Công ty" />
            </Field>
            <Field label="Người nhận *">
              <Input value={formData.recipient_name} onChange={(e) => setFormData((prev) => ({ ...prev, recipient_name: e.target.value }))} placeholder="Nguyễn Văn A" />
            </Field>
            <Field label="Số điện thoại *">
              <Input value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} placeholder="0901234567" />
            </Field>
            <Field label="Tỉnh / Thành *">
              <Input value={formData.province} onChange={(e) => setFormData((prev) => ({ ...prev, province: e.target.value }))} placeholder="TP. Hồ Chí Minh" />
            </Field>
            <Field label="Quận / Huyện *">
              <Input value={formData.district} onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))} placeholder="Quận 1" />
            </Field>
            <Field label="Phường / Xã *">
              <Input value={formData.ward} onChange={(e) => setFormData((prev) => ({ ...prev, ward: e.target.value }))} placeholder="Phường Bến Nghé" />
            </Field>
            <Field label="Địa chỉ chi tiết *" className="sm:col-span-2">
              <Input value={formData.address_line} onChange={(e) => setFormData((prev) => ({ ...prev, address_line: e.target.value }))} placeholder="123 Nguyễn Huệ, tầng 10" />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_default: e.target.checked }))}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            Đặt làm địa chỉ mặc định
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={resetForm}>
              Hủy
            </Button>
            <Button type="submit" disabled={saving} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingAddressId ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, className, children }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}
