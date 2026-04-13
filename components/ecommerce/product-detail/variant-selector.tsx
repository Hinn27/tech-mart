'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { ProductVariant, ProductColor } from '@/lib/product-detail-data';

// ============================================
// Bộ chọn Dung lượng - Button Group
// Tuyệt đối KHÔNG dùng dropdown
// ============================================
interface StorageSelectorProps {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variant: ProductVariant) => void;
}

export function StorageSelector({
  variants,
  selectedId,
  onSelect,
}: StorageSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold text-foreground">
        Dung lượng
      </label>

      {/* Hiển thị dạng các nút bấm (Button Group) */}
      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = selectedId === variant.id;

          return (
            <button
              key={variant.id}
              onClick={() => variant.inStock && onSelect(variant)}
              disabled={!variant.inStock}
              className={cn(
                'relative px-5 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200',
                // Trạng thái Active: viền dày + đổ màu nền nhạt
                isSelected
                  ? 'border-[2.5px] border-accent bg-accent/10 text-accent shadow-sm'
                  : 'border-border hover:border-muted-foreground/60 text-foreground bg-card',
                !variant.inStock && 'opacity-40 cursor-not-allowed'
              )}
            >
              {variant.storage}

              {/* Badge hết hàng */}
              {!variant.inStock && (
                <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md border border-border">
                  Hết
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Bộ chọn Màu sắc - Color Swatches
// Các hình tròn có mã màu thực tế + dấu tick
// ============================================
interface ColorSelectorProps {
  colors: ProductColor[];
  selectedId: string;
  onSelect: (color: ProductColor) => void;
}

export function ColorSelector({
  colors,
  selectedId,
  onSelect,
}: ColorSelectorProps) {
  const selectedColor = colors.find((c) => c.id === selectedId);

  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold text-foreground">
        Màu sắc:{' '}
        <span className="text-muted-foreground font-normal">
          {selectedColor?.name}
        </span>
      </label>

      {/* Swatches - Các hình tròn có mã màu thực tế */}
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedId === color.id;
          const light = isLightColor(color.hex);

          return (
            <button
              key={color.id}
              onClick={() => onSelect(color)}
              className={cn(
                'group relative h-11 w-11 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                // Tròn được chọn: có dấu tick + viền accent + ring
                isSelected
                  ? 'border-accent ring-2 ring-accent/40 ring-offset-2 ring-offset-background scale-110'
                  : 'border-border hover:border-muted-foreground/60 hover:scale-105'
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Chọn màu ${color.name}`}
              aria-pressed={isSelected}
            >
              {/* Dấu tick ở giữa khi được chọn */}
              {isSelected && (
                <Check
                  className={cn(
                    'h-5 w-5 transition-all',
                    // Dùng tick trắng cho màu đậm, tick đen cho màu nhạt
                    light ? 'text-gray-800' : 'text-white'
                  )}
                  strokeWidth={3}
                />
              )}

              {/* Tooltip tên màu khi hover */}
              {!isSelected && (
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-popover text-[10px] font-medium text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                  {color.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// Helper: Xác định màu sáng hay tối để chọn màu tick phù hợp
// ============================================
function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  // Công thức độ sáng tương đối
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 160;
}
