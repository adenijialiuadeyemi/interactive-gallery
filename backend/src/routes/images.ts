import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/unsplash", async (req, res) => {
  try {
    const { page = 1, perPage = 9, query = "nature" } = req.query;

    const response = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        query,
        page,
        per_page: perPage,
      },
    });

    const formatted = response.data.results.map((img: any) => ({
      unsplashId: img.id,
      title: img.alt_description || "Untitled",
      author: img.user.name,
      thumbnail: img.urls.thumb,
      full: img.urls.full,
      description: img.description || "",
      tags: img.tags?.map((tag: any) => tag.title) || [],
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch from Unsplash" });
  }
});

export default router;
