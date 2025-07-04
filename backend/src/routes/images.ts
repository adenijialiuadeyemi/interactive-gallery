import { Router } from "express";
import axios from "axios";
import prisma from "../lib/prisma";
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

router.post("/save", async (req: any, res: any) => {
  try {
    const { unsplashId, title, author, description, tags } = req.body;

    // Check for duplicate
    const existing = await prisma.image.findUnique({
      where: { unsplashId },
    });

    if (existing) {
      return res.status(409).json({ message: "Image already saved" });
    }

    const image = await prisma.image.create({
      data: {
        unsplashId,
        title,
        author,
        description,
        tags,
      },
    });

    res.status(201).json(image);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error saving image" });
  }
});

router.get("/saved", async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(images);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch saved images" });
  }
});

export default router;
