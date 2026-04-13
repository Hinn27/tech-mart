'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Star, ThumbsUp, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProductDetail, ProductSpecification, ProductReview } from '@/lib/product-detail-data';

interface ProductTabsProps {
  product: ProductDetail;
}

type TabId = 'highlights' | 'specs' | 'reviews';

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('highlights');

  const tabs: { id: TabId; label: string; icon?: React.ReactNode }[] = [
    { id: 'highlights', label: 'Đặc điểm nổi bật' },
    { id: 'specs', label: 'Thông số kỹ thuật' },
    {
      id: 'reviews',
      label: `Đánh giá (${product.reviewCount.toLocaleString('vi-VN')})`,
    },
  ];

  return (
    <div className="mt-10 lg:mt-14">
      {/* ======================== */}
      {/* Tab Headers - MUI-style */}
      {/* ======================== */}
      <div className="flex border-b border-border overflow-x-auto hide-scrollbar bg-card rounded-t-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 min-w-[140px] px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative',
              activeTab === tab.id
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
            {/* Gạch chân MUI-style cho tab active */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-accent rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ======================== */}
      {/* Tab Content */}
      {/* ======================== */}
      <div className="py-6 bg-card rounded-b-xl border border-t-0 border-border px-1">
        {activeTab === 'highlights' && (
          <HighlightsTab content={product.highlights} />
        )}
        {activeTab === 'specs' && (
          <SpecificationsTab specifications={product.specifications} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsTab
            reviews={product.reviews}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// Tab 1: Đặc điểm nổi bật - Bài viết kèm ảnh
// Button "Xem thêm" để thu gọn nếu quá dài
// ============================================
function HighlightsTab({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          'prose prose-sm md:prose-base max-w-none dark:prose-invert',
          'prose-headings:font-bold prose-headings:text-foreground',
          'prose-p:text-muted-foreground prose-p:leading-relaxed',
          'prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6',
          'prose-strong:text-foreground',
          'prose-li:text-muted-foreground',
          !expanded && 'max-h-[450px] overflow-hidden'
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Gradient fade khi chưa mở rộng */}
      {!expanded && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card via-card/90 to-transparent" />
      )}

      {/* Button Xem thêm / Thu gọn */}
      <div className="flex justify-center mt-5">
        <Button
          variant="outline"
          onClick={() => setExpanded(!expanded)}
          className="gap-2 font-medium"
        >
          {expanded ? (
            <>
              Thu gọn
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Xem thêm
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Tab 2: Thông số kỹ thuật - Table sọc ngựa vằn
// ============================================
function SpecificationsTab({
  specifications,
}: {
  specifications: ProductSpecification[];
}) {
  return (
    <div className="space-y-8">
      {specifications.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {/* Tiêu đề nhóm */}
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-accent" />
            {section.category}
          </h3>

          {/* Table sọc ngựa vằn - chi tiết CPU, RAM, Màn hình */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {section.specs.map((spec, specIndex) => (
                  <tr
                    key={specIndex}
                    className={cn(
                      // Sọc ngựa vằn: xen kẽ màu nền
                      specIndex % 2 === 0
                        ? 'bg-muted/60'
                        : 'bg-background',
                      'transition-colors hover:bg-accent/5'
                    )}
                  >
                    {/* Tên thông số */}
                    <td className="px-4 py-3.5 text-sm font-semibold text-muted-foreground w-2/5 border-r border-border align-top">
                      {spec.label}
                    </td>
                    {/* Giá trị */}
                    <td className="px-4 py-3.5 text-sm text-foreground font-medium">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Tab 3: Đánh giá của khách hàng
// ============================================
function ReviewsTab({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}) {
  // Mock distribution
  const distribution = [
    { stars: 5, pct: 78, count: Math.round(reviewCount * 0.78) },
    { stars: 4, pct: 15, count: Math.round(reviewCount * 0.15) },
    { stars: 3, pct: 4, count: Math.round(reviewCount * 0.04) },
    { stars: 2, pct: 2, count: Math.round(reviewCount * 0.02) },
    { stars: 1, pct: 1, count: Math.round(reviewCount * 0.01) },
  ];

  return (
    <div className="space-y-8">
      {/* ===== Tóm tắt đánh giá ===== */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-5 rounded-xl bg-muted/40 border border-border">
        {/* Điểm trung bình lớn */}
        <div className="text-center md:text-left shrink-0">
          <div className="text-5xl font-extrabold text-foreground">{rating}</div>
          <div className="flex items-center justify-center md:justify-start gap-0.5 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4.5 w-4.5',
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                )}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1.5">
            {reviewCount.toLocaleString('vi-VN')} đánh giá
          </div>
        </div>

        {/* Thanh tiến trình sao */}
        <div className="flex-1 w-full space-y-1.5">
          {distribution.map(({ stars, pct, count }) => (
            <div key={stars} className="flex items-center gap-2.5 text-sm">
              <span className="w-4 text-right font-medium text-foreground">
                {stars}
              </span>
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground text-xs">
                {count.toLocaleString('vi-VN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Danh sách đánh giá ===== */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-xl border border-border bg-card hover:border-border/80 transition-colors"
          >
            {/* Avatar + Tên + Ngày */}
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <ImageOff className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">
                    {review.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>

                {/* Sao đánh giá */}
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3.5 w-3.5',
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Nội dung đánh giá */}
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {review.content}
            </p>

            {/* Ảnh đánh giá */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2.5 mt-4">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Ảnh đánh giá ${idx + 1}`}
                    className="h-20 w-20 rounded-lg object-cover border border-border hover:scale-105 transition-transform cursor-pointer"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {/* Nút Hữu ích */}
            <div className="flex items-center gap-3 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Hữu ích ({review.helpful})
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Nút Xem thêm đánh giá */}
      <div className="flex justify-center pt-2">
        <Button variant="outline" className="gap-2">
          Xem thêm đánh giá
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
