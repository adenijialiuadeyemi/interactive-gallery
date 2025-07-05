import { create } from "zustand";
import axios from "../api/axios";

interface LikeState {
  toggleLike: (imageId: string) => Promise<void>;
}

export const useLikeStore = create<LikeState>(() => ({
  toggleLike: async (imageId) => {
    try {
      await axios.post(`/images/like/${imageId}`);
    } catch (error) {
      console.error("❌ Error toggling like:", error);
      throw error;
    }
  },
}));
