'use client';

import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/authStore';
import { useEffect } from 'react';

/**
 * AuthProvider — Component không render UI, chỉ làm nhiệm vụ
 * đồng bộ trạng thái đăng nhập từ Supabase vào Zustand authStore.
 * Phải đặt ở level cao nhất (trong layout.jsx).
 */
export function AuthProvider() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    let unsubscribed = false;

    // Bước 1: Lấy session hiện tại ngay khi mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (unsubscribed) return;
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Bước 2: Lắng nghe mọi thay đổi auth (đăng nhập, đăng xuất, refresh token)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (unsubscribed) return;
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Dọn dẹp khi unmount
    return () => {
      unsubscribed = true;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsLoading]);

  // Component này không render gì cả
  return null;
}
