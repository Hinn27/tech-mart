import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/authStore';
import { useEffect } from 'react';

/**
 * Hook lắng nghe sự thay đổi trạng thái auth từ Supabase
 * và đồng bộ với Zustand store.
 * Gọi hook này ở root component hoặc layout.
 */
export function useAuthSync() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    // Lấy session hiện tại khi mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
    });

    // Lắng nghe sự thay đổi auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);
}

/**
 * Hook đăng nhập với email & password
 */
export function useSignIn() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    setSession(data.session);
    setUser(data.user);
    return data;
  };

  return signIn;
}

/**
 * Hook đăng ký với email & password
 */
export function useSignUp() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (error) throw error;

    setSession(data.session);
    setUser(data.user);
    return data;
  };

  return signUp;
}

/**
 * Hook đăng xuất
 */
export function useSignOut() {
  const signOutStore = useAuthStore((state) => state.signOut);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    signOutStore();
  };

  return signOut;
}
