'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Star,
  ThumbsUp,
  ImageOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductDetail, ProductSpecification, ProductReview } from '@/lib/product-detail-data';

interface ProductAccordionProps {
  product: ProductDetail;
}

export function ProductAccordion({ product }: ProductAccordionProps) {
  // Giá trị mặc định: mở accordion đầu tiên
  const [openItems, setOpenItems] = useState<string[]>(['highlights']);

  return (
    <div className="mt-10 lg:mt-14">
      {/* ===== Tiêu đề section ===== */}
      <h2 className="text-xl font-extrabold text-foreground mb-5">
        Thông tin sản phẩm
      </h2>

      {/* ===== Accordion — MUI-style khối thả xuống ===== */}
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-3"
      >
        {/* ===== Accordion 1: Đặc điểm nổi bật ===== */}
        <AccordionItem
          value="highlights"
          className="border border-border rounded-xl bg-card overflow-hidden"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline group" hideChevron>
            <span className="flex items-center gap-3">
              {/* Icon */}
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                Đặc điểm nổi bật
              </span>
            </span>

            {/* Nhãn "Xem thêm" / "Thu gọn" kèm icon mũi tên */}
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-accent transition-colors">
              {openItems.includes('highlights') ? (
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
            </span>
          </AccordionTrigger>

          <AccordionContent className="px-0 pb-4">
            <div className="px-5">
              <HighlightsContent content={product.highlights} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ===== Accordion 2: Thông số kỹ thuật ===== */}
        <AccordionItem
          value="specs"
          className="border border-border rounded-xl bg-card overflow-hidden"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline group" hideChevron>
            <span className="flex items-center gap-3">
              {/* Icon */}
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.174 1.401-6.072L2.72 7.818l6.198-.522L11.42 1.5l2.502 5.796 6.198.522-4.717 4.354 1.401 6.072-5.384-3.174z" />
                </svg>
              </span>
              <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                Thông số kỹ thuật
              </span>
            </span>

            {/* Nhãn "Xem cấu hình chi tiết" / "Thu gọn" */}
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-accent transition-colors">
              {openItems.includes('specs') ? (
                <>
                  Thu gọn
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Xem cấu hình chi tiết
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </span>
          </AccordionTrigger>

          <AccordionContent className="px-0 pb-4">
            <div className="px-5">
              <SpecificationsContent specifications={product.specifications} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ===== Accordion 3: Đánh giá của khách hàng ===== */}
        <AccordionItem
          value="reviews"
          className="border border-border rounded-xl bg-card overflow-hidden"
        >
          <AccordionTrigger className="px-5 py-4 hover:no-underline group" hideChevron>
            <span className="flex items-center gap-3">
              {/* Icon */}
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </span>
              <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                Đánh giá của khách hàng
              </span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount.toLocaleString('vi-VN')})
              </span>
            </span>

            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-accent transition-colors">
              {openItems.includes('reviews') ? (
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
            </span>
          </AccordionTrigger>

          <AccordionContent className="px-0 pb-4">
            <div className="px-5">
              <ReviewsContent
                reviews={product.reviews}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// ============================================
// Nội dung Accordion 1: Đặc điểm nổi bật
// Bài viết (Article) chi tiết kèm hình ảnh
// ============================================
function HighlightsContent({ content }: { content: string }) {
  return (
    <div
      className={cn(
        'prose prose-sm md:prose-base max-w-none dark:prose-invert',
        'prose-headings:font-bold prose-headings:text-foreground',
        'prose-p:text-muted-foreground prose-p:leading-relaxed',
        'prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6',
        'prose-strong:text-foreground',
        'prose-li:text-muted-foreground'
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// ============================================
// Nội dung Accordion 2: Thông số kỹ thuật
// Bảng Table sọc ngựa vằn
// ============================================
function SpecificationsContent({
  specifications,
}: {
  specifications: ProductSpecification[];
}) {
  return (
    <div className="space-y-6">
      {specifications.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {/* Tiêu đề nhóm */}
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-accent" />
            {section.category}
          </h3>

          {/* Table sọc ngựa vằn — chi tiết CPU, RAM, Màn hình */}
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
                    <td className="px-4 py-3 text-sm font-semibold text-muted-foreground w-2/5 border-r border-border align-top">
                      {spec.label}
                    </td>
                    {/* Giá trị */}
                    <td className="px-4 py-3 text-sm text-foreground font-medium">
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
// Nội dung Accordion 3: Đánh giá của khách hàng
// ============================================
function ReviewsContent({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}) {
  const distribution = [
    { stars: 5, pct: 78, count: Math.round(reviewCount * 0.78) },
    { stars: 4, pct: 15, count: Math.round(reviewCount * 0.15) },
    { stars: 3, pct: 4, count: Math.round(reviewCount * 0.04) },
    { stars: 2, pct: 2, count: Math.round(reviewCount * 0.02) },
    { stars: 1, pct: 1, count: Math.round(reviewCount * 0.01) },
  ];

  return (
    <div className="space-y-6">
      {/* ===== Tóm tắt đánh giá ===== */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-5 rounded-xl bg-muted/40 border border-border">
        {/* Điểm trung bình */}
        <div className="text-center md:text-left shrink-0">
          <div className="text-4xl font-extrabold text-foreground">{rating}</div>
          <div className="flex items-center justify-center md:justify-start gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                )}
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {reviewCount.toLocaleString('vi-VN')} đánh giá
          </div>
        </div>

        {/* Thanh tiến trình sao */}
        <div className="flex-1 w-full space-y-1.5">
          {distribution.map(({ stars, pct, count }) => (
            <div key={stars} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-right font-medium text-foreground">
                {stars}
              </span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground">
                {count.toLocaleString('vi-VN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Danh sách review ===== */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-xl border border-border bg-card hover:border-border/80 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
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
                  <span className="font-semibold text-sm text-foreground">
                    {review.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {review.date}
                  </span>
                </div>

                {/* Sao đánh giá */}
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {review.content}
            </p>

            {/* Ảnh đánh giá */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Ảnh đánh giá ${idx + 1}`}
                    className="h-16 w-16 rounded-lg object-cover border border-border hover:scale-105 transition-transform cursor-pointer"
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            {/* Nút Hữu ích */}
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs h-7 text-muted-foreground hover:text-foreground"
              >
                <ThumbsUp className="h-3 w-3" />
                Hữu ích ({review.helpful})
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Nút Xem thêm đánh giá */}
      <div className="flex justify-center">
        <Button variant="outline" className="gap-1.5 text-sm">
          Xem thêm đánh giá
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
