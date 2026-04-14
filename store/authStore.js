import { create } from 'zustand';

// SSR-safe store - no localStorage needed for auth
const useAuthStore = create((set) => ({
  user: null,
  session: null,
  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),

  signOut: () => set({ user: null, session: null }),
}));

export default useAuthStore;
