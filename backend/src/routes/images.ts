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
    // Parse query params or fall back to defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const tag = (req.query.tag as string) || "";

    // Build Prisma 'where' filter object dynamically
    const where: any = { AND: [] };

    // Search filter across title, description, and author (case insensitive)
    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // Tag filter (match if tag exists in the tags[] array)
    if (tag) {
      where.AND.push({
        tags: {
          has: tag,
        },
      });
    }

    // Fetch paginated and filtered results + total count in parallel
    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where: where.AND.length ? where : undefined,
        include: {
          comments: {
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: { likes: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.image.count({
        where: where.AND.length ? where : undefined,
      }),
    ]);

    // Check if more pages are available
    const hasMore = skip + images.length < total;

    // Respond with pagination info and images
    res.json({
      page,
      limit,
      total,
      hasMore,
      images,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error filtering images" });
  }
});

// Like or Unlike an image
router.post("/like/:unsplashId", authenticate, async (req: any, res: any) => {
  const unsplashId = req.params.unsplashId;
  const userId = req.user.id;

  try {
    // Check if image is already saved
    let image = await prisma.image.findUnique({
      where: { unsplashId },
    });

    // If not, fetch from Unsplash and save it
    if (!image) {
      const unsplashRes = await axios.get(
        `https://api.unsplash.com/photos/${unsplashId}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      const data = unsplashRes.data;
      image = await prisma.image.create({
        data: {
          unsplashId: data.id,
          title: data.alt_description || "Untitled",
          author: data.user.name,
          description: data.description || "",
          tags: data.tags?.map((tag: any) => tag.title) || [],
          thumbnail: data.urls.thumb,
          full: data.urls.full,
        },
      });
    }

    // Toggle Like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_imageId: {
          userId,
          imageId: image.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ message: "Unliked" });
    } else {
      await prisma.like.create({
        data: {
          userId,
          imageId: image.id,
        },
      });
      return res.json({ message: "Liked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error toggling like" });
  }
});

router.get("/:unsplashId", async (req: any, res: any) => {
  const { unsplashId } = req.params;

  try {
    let image = await prisma.image.findUnique({
      where: { unsplashId },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
          include: { user: true },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!image) {
      // Fetch from Unsplash if not found in DB
      const response = await axios.get(
        `https://api.unsplash.com/photos/${unsplashId}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      const data = response.data;

      image = await prisma.image.create({
        data: {
          unsplashId: data.id,
          title: data.alt_description || "Untitled",
          author: data.user.name,
          description: data.description || "",
          thumbnail: data.urls.thumb,
          full: data.urls.full,
          tags: data.tags?.map((tag: any) => tag.title) || [],
        },
      });

      // Reload to include defaults (e.g., comments)
      image = await prisma.image.findUnique({
        where: { unsplashId },
        include: {
          comments: {
            orderBy: { createdAt: "desc" },
            include: { user: true },
          },
          _count: {
            select: { likes: true },
          },
        },
      });
    }

    res.json(image);
  } catch (err) {
    console.error("❌ Error fetching image details:", err);
    res.status(500).json({ error: "Failed to load image details" });
  }
});

export default router;
