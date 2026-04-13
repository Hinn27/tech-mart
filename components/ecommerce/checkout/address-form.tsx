'use client';

import { useState } from 'react';
import { Home, Building2, MapPin, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ============================================
// Sổ địa chỉ đã lưu
// ============================================
interface SavedAddress {
  id: string;
  type: 'home' | 'office';
  label: string;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}

const savedAddresses: SavedAddress[] = [
  {
    id: '1',
    type: 'home',
    label: 'Nhà riêng',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: '2',
    type: 'office',
    label: 'Công ty',
    name: 'Nguyễn Văn A',
    phone: '0907654321',
    address: 'Tòa nhà Bitexco, 456 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  },
];

interface FormData {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
}

interface FormErrors {
  phone?: string;
  fullName?: string;
  [key: string]: string | undefined;
}

export function AddressForm() {
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '0123abc', // Dữ liệu không hợp lệ để mô phỏng inline validation
    province: '',
    district: '',
    ward: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    phone: 'Vui lòng nhập số điện thoại hợp lệ',
  });

  // Validate phone inline
  const validatePhone = (value: string): string | undefined => {
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!value.trim()) return 'Vui lòng nhập số điện thoại';
    if (!phoneRegex.test(value)) return 'Vui lòng nhập số điện thoại hợp lệ';
    return undefined;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'phone') {
      const err = validatePhone(value);
      setErrors((prev) => ({ ...prev, phone: err }));
    }
    if (field === 'fullName' && value.trim()) {
      setErrors((prev) => ({ ...prev, fullName: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Tiêu đề ===== */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <MapPin className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-base font-bold text-foreground">Địa chỉ nhận hàng</h2>
      </div>

      {/* ===== Sổ địa chỉ — Component Tabs nhỏ ===== */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Chọn từ sổ địa chỉ:</p>

        {/* Tabs — 2 thẻ Card địa chỉ đã lưu */}
        <div className="grid gap-3 sm:grid-cols-2">
          {savedAddresses.map((addr) => {
            const isSelected = selectedAddress === addr.id && !showNewForm;

            return (
              <button
                key={addr.id}
                onClick={() => {
                  setSelectedAddress(addr.id);
                  setShowNewForm(false);
                }}
                className={cn(
                  'relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200',
                  // Thẻ đang chọn có viền màu chủ đạo (accent)
                  isSelected
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/30'
                    : 'border-border hover:border-accent/40 hover:bg-muted/40'
                )}
                aria-pressed={isSelected}
              >
                {/* Check mark khi được chọn */}
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    isSelected
                      ? 'bg-accent text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {addr.type === 'home' ? (
                    <Home className="h-5 w-5" />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{addr.name}</p>
                  <p className="text-xs text-muted-foreground">{addr.phone}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{addr.address}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Nút thêm địa chỉ mới ===== */}
      <Button
        variant="outline"
        className={cn(
          'w-full gap-2 text-sm font-medium',
          showNewForm && 'border-accent bg-accent/5 text-accent'
        )}
        onClick={() => {
          setShowNewForm(!showNewForm);
          if (showNewForm) setSelectedAddress('1');
        }}
      >
        {showNewForm ? (
          <>
            <X className="h-4 w-4" />
            Đóng form
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Thêm địa chỉ mới
          </>
        )}
      </Button>

      {/* ===== Form điền địa chỉ mới — Label nằm phía trên Input ===== */}
      {showNewForm && (
        <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-bold text-foreground">Địa chỉ mới</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Họ và tên */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Nhập họ và tên người nhận"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={cn(
                  'h-11',
                  errors.fullName && 'border-destructive focus-visible:ring-destructive'
                )}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive font-medium" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Số điện thoại — Inline Validation: viền đỏ + cảnh báo đỏ */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="VD: 0901234567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn(
                  'h-11',
                  // Viền đỏ khi lỗi
                  errors.phone && 'border-2 border-destructive focus-visible:ring-destructive'
                )}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {/* Dòng chữ đỏ cảnh báo dưới input */}
              {errors.phone && (
                <p
                  id="phone-error"
                  className="flex items-center gap-1.5 text-xs text-destructive font-medium"
                  role="alert"
                >
                  <svg className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Tỉnh/Thành phố */}
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-medium text-foreground">
                Tỉnh/Thành phố <span className="text-destructive">*</span>
              </Label>
              <select
                id="province"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="hn">Hà Nội</option>
                <option value="dn">Đà Nẵng</option>
                <option value="hp">Hải Phòng</option>
                <option value="ct">Cần Thơ</option>
              </select>
            </div>

            {/* Quận/Huyện */}
            <div className="space-y-2">
              <Label htmlFor="district" className="text-sm font-medium text-foreground">
                Quận/Huyện <span className="text-destructive">*</span>
              </Label>
              <select
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Chọn Quận/Huyện</option>
                <option value="q1">Quận 1</option>
                <option value="q2">Quận 2</option>
                <option value="q3">Quận 3</option>
                <option value="q4">Quận 4</option>
                <option value="q5">Quận 5</option>
              </select>
            </div>

            {/* Phường/Xã */}
            <div className="space-y-2">
              <Label htmlFor="ward" className="text-sm font-medium text-foreground">
                Phường/Xã <span className="text-destructive">*</span>
              </Label>
              <select
                id="ward"
                value={formData.ward}
                onChange={(e) => handleInputChange('ward', e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Chọn Phường/Xã</option>
                <option value="bn">Phường Bến Nghé</option>
                <option value="bt">Phường Bến Thành</option>
                <option value="ng">Phường Nguyễn Thái Bình</option>
                <option value="co">Phường Cô Giang</option>
              </select>
            </div>

            {/* Địa chỉ cụ thể */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-foreground">
                Địa chỉ cụ thể <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="Số nhà, tên đường, hẻm..."
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
