'use client';

import { AddressBookManager } from '@/components/ecommerce/address-book-manager';
import { Button } from '@/components/ui/button';
import { formatFullAddress } from '@/lib/addressService';
import { MapPin, Pencil } from 'lucide-react';
import { useState } from 'react';

export function AddressForm() {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <MapPin className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Địa chỉ nhận hàng</h2>
            <p className="text-xs text-muted-foreground">Chọn địa chỉ có sẵn hoặc chỉnh sửa trực tiếp tại đây.</p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing((prev) => !prev)}>
          <Pencil className="h-4 w-4" />
          {isEditing ? 'Ẩn chỉnh sửa' : 'Chỉnh sửa'}
        </Button>
      </div>

      {selectedAddress && !isEditing && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span>{selectedAddress.label || 'Địa chỉ nhận hàng'}</span>
            {selectedAddress.is_default && (
              <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                Mặc định
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-foreground">{selectedAddress.recipient_name} • {selectedAddress.phone}</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatFullAddress(selectedAddress)}</p>
        </div>
      )}

      {(isEditing || !selectedAddress) && (
        <AddressBookManager
          selectionMode
          selectedAddressId={selectedAddress?.id}
          onSelectAddress={(_, address) => {
            setSelectedAddress(address || null);
            if (address) {
              setIsEditing(false);
            }
          }}
          showTitle={false}
          emptyMessage="Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ để tiếp tục thanh toán."
        />
      )}
    </div>
  );
}
