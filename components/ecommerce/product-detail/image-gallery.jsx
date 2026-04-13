'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageGallery({
  images,
  productName,
  onWishlist,
  isWishlisted = false,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* ======================== */}
      {/* Ảnh chính 1:1 — KHÔNG zoom/kính lúp */}
      {/* ======================== */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border">
        <img
          src={images[selectedIndex]}
          alt={`${productName} - Hình ${selectedIndex + 1}`}
          className="h-full w-full object-cover select-none"
          draggable={false}
        />

        {/* Badge số ảnh */}
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-muted-foreground">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* ======================== */}
      {/* Thumbnails — 5 ảnh nhỏ ngang */}
      {/* ======================== */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'relative h-[72px] w-[72px] flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200',
              selectedIndex === index
                ? 'border-accent ring-2 ring-accent/30 scale-[1.05]'
                : 'border-border hover:border-muted-foreground/50 hover:scale-[1.02]'
            )}
            aria-label={`Xem ảnh ${index + 1}`}
          >
            <img
              src={image}
              alt={`${productName} - Ảnh ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* ======================== */}
      {/* Nút duy nhất: Thêm vào Yêu thích (bám toàn chiều rộng) */}
      {/* KHÔNG có nút "So sánh cấu hình" */}
      {/* ======================== */}
      <Button
        variant="outline"
        className={cn(
          'w-full gap-2.5 h-12 text-sm font-semibold transition-all duration-200 rounded-xl',
          isWishlisted
            ? 'text-destructive border-destructive/50 bg-destructive/5 hover:bg-destructive/10'
            : 'hover:text-destructive hover:border-destructive/30'
        )}
        onClick={onWishlist}
      >
        <Heart className={cn('h-4.5 w-4.5 transition-all', isWishlisted && 'fill-current')} />
        {isWishlisted ? 'Đã yêu thích' : 'Thêm vào Yêu thích'}
      </Button>
    </div>
  );
}
