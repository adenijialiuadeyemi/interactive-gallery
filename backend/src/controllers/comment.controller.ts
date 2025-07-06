// controllers/comment.controller.ts
import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * @desc Add a comment to a specific image
 * @route POST /api/comments/:unsplashId
 * @access Private
 */
export const addComment = async (req: Request, res: Response): Promise<any> => {
  // Extract unsplashId and content from request
  const { unsplashId } = req.params;
  const { content } = req.body;

  // Validate comment length
  if (!content || content.length < 3) {
    return res.status(400).json({
      error: "Comment must be at least 3 characters long",
    });
  }

  try {
    const userId = (req as any).user.id;

    // Check if image exists
    const image = await prisma.image.findUnique({ where: { unsplashId } });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Create comment in DB
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        imageId: image.id,
      },
      include: {
        user: true, // Include user data in the response
      },
    });

    // Return the created comment
    return res.status(201).json(comment);
  } catch (err: any) {
    // Log the error for debugging
    console.error("Error in addComment controller:", err.message);
    return res.status(500).json({ error: "Error posting comment" });
  }
};

/**
 * @desc Fetch comments for a specific image
 * @route GET /api/comments/:unsplashId
 * @access Public
 */
export const getComments = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { unsplashId } = req.params;

  try {
    // Check if image exists
    const image = await prisma.image.findUnique({ where: { unsplashId } });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Fetch comments from DB
    const comments = await prisma.comment.findMany({
      where: { imageId: image.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true }, // Only return the name of the user
        },
      },
    });

    return res.json(comments);
  } catch (err: any) {
    // Log the error for debugging
    console.error("Error in getComments controller:", err.message);
    return res.status(500).json({ error: "Error fetching comments" });
  }
};
