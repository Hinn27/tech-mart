"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}) {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Khởi tạo theme từ localStorage khi mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const resolvedTheme = stored || defaultTheme;
    applyTheme(resolvedTheme, attribute, disableTransitionOnChange);
    setThemeState(resolvedTheme);
  }, [attribute, defaultTheme, disableTransitionOnChange]);

  // Hàm chuyển theme
  const setTheme = (newTheme) => {
    applyTheme(newTheme, attribute, disableTransitionOnChange);
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Tránh hydration mismatch — chỉ render children sau khi mount
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook sử dụng theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Áp dụng theme vào DOM
function applyTheme(theme, attribute, disableTransitionOnChange) {
  const root = document.documentElement;

  if (disableTransitionOnChange) {
    root.classList.add("[&_*]:!transition-none");
    requestAnimationFrame(() => {
      root.classList.remove("[&_*]:!transition-none");
    });
  }

  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}
