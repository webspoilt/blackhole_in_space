import { create } from 'zustand';

export interface User {
  deviceId: string;
  identityKey: string;
  email: string;
  token: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Load persisted state from localStorage
const loadPersistedAuth = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const stored = localStorage.getItem('vault-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user || null,
        isAuthenticated: parsed.isAuthenticated || false
      };
    }
  } catch (e) {
    console.error('Failed to load auth state:', e);
  }
  return { user: null, isAuthenticated: false };
};

const persisted = loadPersistedAuth();

export const useAuthStore = create<AuthStore>((set) => ({
  user: persisted.user,
  isAuthenticated: persisted.isAuthenticated,
  isLoading: false,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
    localStorage.setItem('vault-auth', JSON.stringify({ user, isAuthenticated: true }));
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('vault-auth');
    // Clear IndexedDB
    import('./database').then(({ db }) => {
      db.delete().then(() => {
        window.location.href = '/';
      });
    });
  },
  
  setLoading: (loading) => set({ isLoading: loading })
}));
