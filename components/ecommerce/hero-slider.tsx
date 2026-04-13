'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { bannerSlides } from '@/lib/mock-data';

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full flex-shrink-0 aspect-[2/1] md:aspect-[3/1]"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            {/* Glassmorphism overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 md:px-12 max-w-lg">
                <p className="text-sm md:text-base font-medium text-accent mb-2">
                  {slide.subtitle}
                </p>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 text-balance">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mb-6 hidden sm:block">
                  {slide.description}
                </p>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  size="lg"
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background shadow-md"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background shadow-md"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              currentSlide === index
                ? "w-8 bg-accent"
                : "w-2 bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
