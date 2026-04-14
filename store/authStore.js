import { create } from 'zustand';

// SSR-safe store - no localStorage needed for auth
const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isAuthModalOpen: false,
  isLoading: true, // Mặc định đang loading — chờ Supabase check session

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setIsLoading: (isLoading) => set({ isLoading }),

  signOut: () => set({ user: null, session: null, isLoading: false }),
}));

export default useAuthStore;
