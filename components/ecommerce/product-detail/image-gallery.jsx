'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export function ImageGallery({
  images = [],
  productName,
  onWishlist,
  isWishlisted = false,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Đảm bảo images là mảng và có ít nhất 1 ảnh
  const safeImages = Array.isArray(images) ? images : [];
  const displayImages = safeImages.length > 0 ? safeImages : ['/placeholder.jpg'];
  const currentIndex = selectedIndex < displayImages.length ? selectedIndex : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ======================== */}
      {/* Ảnh chính 1:1 — KHÔNG zoom/kính lúp */}
      {/* ======================== */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border flex items-center justify-center p-2">
        <img
          src={displayImages[currentIndex]}
          alt={`${productName} - Hình ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain select-none"
          draggable={false}
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />

        {/* Badge số ảnh */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-muted-foreground">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* ======================== */}
      {/* Thumbnails — 5 ảnh nhỏ ngang */}
      {/* ======================== */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
          {displayImages.slice(0, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-[72px] w-[72px] flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200',
                currentIndex === index
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
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}

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
