import { create } from "zustand";

// Define the shape of our authentication state
interface AuthState {
  user: string | null; // Stores the username
  token: string | null; // Stores a fake token (in real apps, this would be JWT or similar)
  login: (user: string, token: string) => void;
  logout: () => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  // Initialize state from localStorage so it persists after page reload
  user: localStorage.getItem("user") || null,
  token: localStorage.getItem("token") || null,

  // Login method: saves user & token to state and localStorage
  login: (user, token) => {
    localStorage.setItem("user", user);
    localStorage.setItem("token", token);
    set({ user, token });
  },

  // Logout method: clears both state and localStorage
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
