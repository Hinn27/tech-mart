'use client';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import useCartStore from '@/store/cartStore';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  Home,
  Laptop,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Smartphone,
  Sun,
  Tablet,
  Tv,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const categoryIcons = {
  smartphone: <Smartphone className="h-5 w-5" />,
  tablet: <Tablet className="h-5 w-5" />,
  laptop: <Laptop className="h-5 w-5" />,
  tv: <Tv className="h-5 w-5" />,
  home: <Home className="h-5 w-5" />,
};

export function Header({ onOpenMobileMenu, user, openAuthModal, onSignOut, isLoading: authLoading }) {
  const { theme, setTheme } = useTheme();
  const cartCount = useCartStore((state) => state.getTotalItems());
  const clearCartStore = useCartStore((state) => state.clearCart);
  const [notificationCount, setNotificationCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);
  const megaMenuRef = useRef(null);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setShowSearchResults(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        // Mock search results
        setSearchResults([
          `iPhone 16 Pro Max - ${query}`,
          `Samsung Galaxy - ${query}`,
          `MacBook Pro - ${query}`,
          `Laptop Gaming - ${query}`,
        ]);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold">
              TE
            </div>
            <span className="hidden sm:block font-bold text-xl text-foreground">
              TechElite
            </span>
          </a>

          {/* Category Button - Desktop */}
          <div className="relative hidden lg:block" ref={megaMenuRef}>
            <Button
              variant="ghost"
              className="gap-2 font-medium"
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            >
              <Menu className="h-4 w-4" />
              Danh mục sản phẩm
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isMegaMenuOpen && "rotate-180"
              )} />
            </Button>

            {/* Mega Menu */}
            {isMegaMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-[800px] rounded-xl bg-card border border-border p-6 shadow-lg card-shadow">
                <div className="grid grid-cols-5 gap-6">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <a
                        href={`/${category.slug}`}
                        className="flex items-center gap-2 font-semibold text-foreground hover:text-accent transition-colors mb-3"
                      >
                        {categoryIcons[category.icon]}
                        {category.name}
                      </a>
                      <ul className="space-y-2">
                        {category.subcategories?.map((sub) => (
                          <li key={sub.slug}>
                            <a
                              href={`/${category.slug}`}
                              className="text-sm text-muted-foreground hover:text-accent transition-colors"
                            >
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl" ref={searchContainerRef}>
            <div className="relative">
              <label htmlFor="search" className="sr-only">
                Tìm kiếm sản phẩm
              </label>
              <input
                id="search"
                type="text"
                placeholder="Bạn cần tìm gì hôm nay?"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-lg overflow-hidden card-shadow">
                {isSearching ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-muted rounded w-3/4" />
                          <div className="h-2 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul>
                    {searchResults.map((result, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                        >
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{result}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={mounted ? (theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối') : 'Chuyển đổi chế độ'}
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Auth Button */}
            {authLoading ? (
              <div className="hidden sm:block w-20 h-9 rounded-lg bg-muted/50 animate-pulse" />
            ) : user ? (
              <div className="hidden sm:flex items-center gap-2">
                {/* User Avatar */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                  <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-foreground max-w-[120px] truncate hidden lg:inline">
                    {user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                {/* Sign Out */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-sm text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    onSignOut?.();
                    clearCartStore();
                    setNotificationCount(0);
                  }}
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="hidden sm:flex gap-2"
                onClick={openAuthModal}
              >
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Đăng nhập</span>
              </Button>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {mounted && user && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* Cart */}
            <Link href="/gio-hang">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                title={mounted && user ? `Giỏ hàng của bạn đang có ${cartCount} sản phẩm` : 'Giỏ hàng'}
              >
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {mounted && user && cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 1.2, backgroundColor: '#fbbf24' }}
                      animate={{ scale: 1, backgroundColor: 'transparent' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile Drawer Menu
export function MobileMenu({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-[280px] bg-card border-r border-border shadow-xl animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold text-lg">Danh mục</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={`/${category.slug}`}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors"
                  onClick={onClose}
                >
                  {categoryIcons[category.icon]}
                  <span className="font-medium">{category.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
