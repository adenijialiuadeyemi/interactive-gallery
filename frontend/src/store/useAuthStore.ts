import { create } from "zustand";
import axios from "axios";

interface AuthState {
  user: { id: string; name: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),

  login: async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    set({ user: res.data.user, token: res.data.token });
    localStorage.setItem("token", res.data.token);
  },

  register: async (name, email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
    });
    set({ user: res.data.user, token: res.data.token });
    localStorage.setItem("token", res.data.token);
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
}));
