import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * 📥 POST /api/comments/:unsplashId
 * Add a comment to a specific image
 */
router.post("/:unsplashId", authenticate, async (req: any, res: any) => {
  const { unsplashId } = req.params;
  const { content } = req.body;

  if (!content || content.length < 3) {
    return res
      .status(400)
      .json({ error: "Comment must be at least 3 characters long" });
  }

  try {
    const userId = req.user.id;

    // Check if image exists
    const image = await prisma.image.findUnique({ where: { unsplashId } });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        imageId: image.id,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error posting comment" });
  }
});

/**
 * 📤 GET /api/comments/:unsplashId
 * Fetch comments for a specific image
 */
router.get("/:unsplashId", async (req: any, res: any) => {
  const { unsplashId } = req.params;

  try {
    const image = await prisma.image.findUnique({ where: { unsplashId } });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const comments = await prisma.comment.findMany({
      where: { imageId: image.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

export default router;
