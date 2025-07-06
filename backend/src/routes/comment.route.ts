// routes/comment.route.ts
import { Router } from "express";
import { addComment, getComments } from "../controllers/comment.controller";
import { authenticate } from "../middleware/auth.middleware";

const commentRouter = Router();

/**
 * POST /api/comments/:unsplashId
 * Add a comment to a specific image (auth required)
 * This endpoint expects a JSON body with content.
 * It will create a new comment in the database and return the comment data.
 */
commentRouter.post("/:unsplashId", authenticate, addComment);

/**
 * GET /api/comments/:unsplashId
 * Fetch comments for a specific image (public)
 * This endpoint retrieves all comments for the given Unsplash image ID.
 * It returns an array of comments with user details.
 */
commentRouter.get("/:unsplashId", getComments);

export default commentRouter;
