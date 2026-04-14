import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Custom storage an toàn cho SSR
const safeLocalStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(name, value);
      } catch {
        // Ignore quota errors
      }
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(name);
      } catch {
        // Ignore errors
      }
    }
  },
};

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updatedCart = state.cart.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            return { cart: updatedCart };
          }

          return {
            cart: [
              ...state.cart,
              {
                product,
                quantity,
                category: product.category || 'dien-thoai',
              },
            ],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getTotalItems: () => {
        const state = get();
        if (!state || !state.cart) return 0;
        return state.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      },

      getSubtotal: () => {
        const state = get();
        if (!state || !state.cart) return 0;
        return state.cart.reduce(
          (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
          0
        );
      },
    }),
    {
      name: 'techelite-cart-storage',
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

export default useCartStore;
