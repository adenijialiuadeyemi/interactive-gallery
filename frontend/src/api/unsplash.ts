import api from "./axios";

export const fetchUnsplashImages = async (page = 1, limit = 12) => {
  const res = await api.get(`/images/unsplash?page=${page}&limit=${limit}`);
  return res.data;
};
