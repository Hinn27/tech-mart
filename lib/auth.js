import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/authStore';
import { useEffect } from 'react';

function getOAuthRedirectUrl() {
  if (typeof window === 'undefined') return undefined;
  return window.location.origin;
}

/**
 * Hook lắng nghe sự thay đổi trạng thái auth từ Supabase
 * và đồng bộ với Zustand store.
 * Gọi hook này ở root component hoặc layout.
 */
export function useAuthSync() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);
}

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

export function useSignOut() {
  const signOutStore = useAuthStore((state) => state.signOut);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    signOutStore();
  };

  return signOut;
}

export function useSocialAuth() {
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getOAuthRedirectUrl(),
      },
    });

    if (error) throw error;
    return data;
  };

  return { signInWithGoogle };
}

export function usePhoneAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);

  const signInWithPhone = async (phone) => {
    // Phone should be in format +84... or 0...
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+84' + formattedPhone.slice(1);
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) throw error;
    return data;
  };

  const verifyPhoneOtp = async (phone, token) => {
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+84' + formattedPhone.slice(1);
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    });

    if (error) throw error;

    if (data.session) {
      setSession(data.session);
      setUser(data.user);
    }

    return data;
  };

  return { signInWithPhone, verifyPhoneOtp };
}
