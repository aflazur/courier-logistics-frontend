import { create } from 'zustand';
import type { SessionUser } from '@/lib/auth-shared';

interface AuthState {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
}

// Holds only the display-safe session shape ({id, name, email, role}) that Server Components
// already read from the readable session cookie - this store exists so deeply nested Client
// Components (sidebar, topbar, role-gated buttons) can read "who's logged in" without prop
// drilling, not to hold anything sensitive. The JWT never enters client-side JS at all.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
