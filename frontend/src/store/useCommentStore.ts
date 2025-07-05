// store/useCommentStore.ts
import { create } from "zustand";
import axios from "../api/axios";
import type { Comment } from "../types/comments";

interface CommentState {
  comments: Comment[];
  fetchComments: (unsplashId: string) => Promise<void>;
  postComment: (unsplashId: string, content: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],

  fetchComments: async (unsplashId) => {
    const res = await axios.get(`/comments/${unsplashId}`);
    set({ comments: res.data });
  },

  postComment: async (unsplashId, content) => {
    const res = await axios.post(`/comments/${unsplashId}`, { content });
    set((state) => ({ comments: [res.data, ...state.comments] }));
  },
}));
