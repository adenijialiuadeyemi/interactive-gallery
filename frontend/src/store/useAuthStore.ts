import { create } from "zustand";
import axios from "../api/axios";

interface AuthState {
  user: { id: string; name: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,

    login: async (email, password) => {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data.user, token: res.data.token });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    },

    register: async (name, email, password) => {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      set({ user: res.data.user, token: res.data.token });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    },

    logout: () => {
      set({ user: null, token: null });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  };
});
