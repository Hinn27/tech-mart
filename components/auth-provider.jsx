'use client';

import { upsertProfileFromUser } from '@/lib/profileService';
import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/authStore';
import { useEffect, useRef } from 'react';

/**
 * AuthProvider — Component không render UI, chỉ làm nhiệm vụ
 * đồng bộ trạng thái đăng nhập từ Supabase vào Zustand authStore.
 * Phải đặt ở level cao nhất (trong layout.jsx).
 */
export function AuthProvider() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const bootstrappedUsersRef = useRef(new Set());

  useEffect(() => {
    let unsubscribed = false;

    const syncSession = async (session) => {
      if (unsubscribed) return;

      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);

      const currentUser = session?.user;
      if (!currentUser?.id || bootstrappedUsersRef.current.has(currentUser.id)) {
        return;
      }

      bootstrappedUsersRef.current.add(currentUser.id);
      try {
        await upsertProfileFromUser(currentUser);
      } catch (error) {
        console.error('[AuthProvider] Lỗi đồng bộ profile:', error);
        bootstrappedUsersRef.current.delete(currentUser.id);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
    });

    return () => {
      unsubscribed = true;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setIsLoading]);

  return null;
}
