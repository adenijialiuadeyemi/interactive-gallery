import { create } from "zustand";
import axios from "axios";

interface LikeState {
  toggleLike: (imageId: string, token: string) => Promise<void>;
}

export const useLikeStore = create<LikeState>((_) => ({
  toggleLike: async (imageId, token) => {
    try {
      await axios.post(
        `http://localhost:5000/api/images/like/${imageId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("❌ Error toggling like:", error);
      throw error;
    }
  },
}));
