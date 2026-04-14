'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { formatPrice } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { RotateCcw, X } from 'lucide-react';

const defaultBrands = ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Honor', 'Huawei', 'LG', 'Sony', 'TCL', 'Dell', 'ASUS', 'Lenovo', 'Philips', 'Dyson', 'Roborock'];
const ramOptions = ['8GB', '16GB', '32GB'];
const storageOptions = ['128GB', '256GB', '512GB', '1TB'];

export function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  minPrice = 0,
  maxPrice = 100000000,
  availableBrands = defaultBrands,
  className,
}) {
  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.ram.length > 0 ||
    filters.storage.length > 0 ||
    filters.priceRange[0] > minPrice ||
    filters.priceRange[1] < maxPrice;

  const handlePriceChange = (value) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleBrandChange = (brand, checked) => {
    onFilterChange({
      ...filters,
      brands: checked
        ? [...filters.brands, brand]
        : filters.brands.filter((b) => b !== brand),
    });
  };

  const handleRamChange = (ram, checked) => {
    onFilterChange({
      ...filters,
      ram: checked
        ? [...filters.ram, ram]
        : filters.ram.filter((r) => r !== ram),
    });
  };

  const handleStorageChange = (storage, checked) => {
    onFilterChange({
      ...filters,
      storage: checked
        ? [...filters.storage, storage]
        : filters.storage.filter((s) => s !== storage),
    });
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Header with Clear Button - Góc trên sidebar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <h3 className="font-bold text-lg text-foreground">Bộ lọc</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className={cn(
            'gap-1.5 text-xs font-medium transition-colors',
            hasActiveFilters
              ? 'text-destructive hover:text-destructive hover:bg-destructive/10'
              : 'text-muted-foreground/50 cursor-not-allowed'
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Xóa tất cả bộ lọc
        </Button>
      </div>

      {/* Accordion Filters - Mô hình Accordion MUI */}
      <Accordion
        type="multiple"
        defaultValue={['price', 'brand', 'ram', 'storage']}
        className="space-y-3"
      >
        {/* Lọc theo giá - Range Slider */}
        <AccordionItem
          value="price"
          className="border border-border rounded-xl bg-card overflow-hidden"
        >
          <AccordionTrigger className="text-sm font-semibold hover:no-underline px-4 py-3.5 text-foreground">
            <span className="flex items-center gap-2">
              Khoảng giá
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-5">
            <div className="space-y-4">
              <Slider
                value={[filters.priceRange[0], filters.priceRange[1]]}
                min={minPrice}
                max={maxPrice}
                step={1000000}
                onValueChange={handlePriceChange}
                className="mt-2"
              />
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-accent bg-accent/10 px-2.5 py-1 rounded-md">
                  {formatPrice(filters.priceRange[0])}
                </span>
                <span className="text-muted-foreground">—</span>
                <span className="text-accent bg-accent/10 px-2.5 py-1 rounded-md">
                  {formatPrice(filters.priceRange[1])}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lọc theo Hãng (Thương hiệu) - Checkbox */}
        <AccordionItem
          value="brand"
          className="border border-border rounded-xl bg-card overflow-hidden"
        >
          <AccordionTrigger className="text-sm font-semibold hover:no-underline px-4 py-3.5 text-foreground">
            <span className="flex items-center gap-2">
              Thương hiệu
              {filters.brands.length > 0 && (
                <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                  {filters.brands.length}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2.5">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer group py-1"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand, checked)
                    }
                    className="border-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors select-none">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lọc theo Cấu hình - RAM Checkbox */}
        <AccordionItem
          value="ram"
          className="border border-border rounded-xl bg-card overflow-hidden"
        >
          <AccordionTrigger className="text-sm font-semibold hover:no-underline px-4 py-3.5 text-foreground">
            <span className="flex items-center gap-2">
              RAM
              {filters.ram.length > 0 && (
                <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-success/10 text-success text-xs font-bold flex items-center justify-center">
                  {filters.ram.length}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2.5">
              {ramOptions.map((ram) => (
                <label
                  key={ram}
                  className="flex items-center gap-3 cursor-pointer group py-1"
                >
                  <Checkbox
                    checked={filters.ram.includes(ram)}
                    onCheckedChange={(checked) =>
                      handleRamChange(ram, checked)
                    }
                    className="border-2 data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors select-none">
                    {ram}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Lọc theo Cấu hình - Bộ nhớ trong Checkbox */}
        <AccordionItem
          value="storage"
          className="border border-border rounded-xl bg-card overflow-hidden"
        >
          <AccordionTrigger className="text-sm font-semibold hover:no-underline px-4 py-3.5 text-foreground">
            <span className="flex items-center gap-2">
              Bộ nhớ trong
              {filters.storage.length > 0 && (
                <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold flex items-center justify-center">
                  {filters.storage.length}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2.5">
              {storageOptions.map((storage) => (
                <label
                  key={storage}
                  className="flex items-center gap-3 cursor-pointer group py-1"
                >
                  <Checkbox
                    checked={filters.storage.includes(storage)}
                    onCheckedChange={(checked) =>
                      handleStorageChange(storage, checked)
                    }
                    className="border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors select-none">
                    {storage}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Active Filters Tags - Hiển thị bộ lọc đang chọn */}
      {hasActiveFilters && (
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Bộ lọc đang áp dụng
          </p>
          <div className="flex flex-wrap gap-2">
            {filters.brands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium"
              >
                {brand}
                <button
                  onClick={() => handleBrandChange(brand, false)}
                  className="hover:text-destructive transition-colors"
                  aria-label={`Xóa bộ lọc ${brand}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.ram.map((ram) => (
              <span
                key={ram}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-medium"
              >
                {ram}
                <button
                  onClick={() => handleRamChange(ram, false)}
                  className="hover:text-destructive transition-colors"
                  aria-label={`Xóa bộ lọc ${ram}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.storage.map((storage) => (
              <span
                key={storage}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium"
              >
                {storage}
                <button
                  onClick={() => handleStorageChange(storage, false)}
                  className="hover:text-destructive transition-colors"
                  aria-label={`Xóa bộ lọc ${storage}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {(filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-500 text-xs font-medium">
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                <button
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      priceRange: [minPrice, maxPrice],
                    })
                  }
                  className="hover:text-destructive transition-colors"
                  aria-label="Xóa bộ lọc giá"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
