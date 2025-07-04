import { authenticate } from "./../middleware/auth";
import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/", authenticate, async (req: any, res: any) => {
  try {
    const { text, imageId } = req.body;

    if (!text || text.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Comment must be at least 3 characters" });
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        imageId,
      },
    });

    res.status(201).json(comment);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

export default router;
