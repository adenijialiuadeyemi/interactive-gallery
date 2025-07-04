import { Router } from "express";
import axios from "axios";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";
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
        _count: {
          select: { likes: true },
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

// Like or Unlike an image
router.post("/like/:id", authenticate, async (req: any, res: any) => {
  try {
    const imageId = req.params.id;
    // @ts-ignore
    const user = req.user;

    // Check if image exists
    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Check if user already liked this image
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_imageId: {
          userId: user.id,
          imageId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return res.json({ message: "Unliked" });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: user.id,
          imageId,
        },
      });
      return res.json({ message: "Liked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error toggling like" });
  }
});

export default router;
