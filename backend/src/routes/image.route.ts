// routes/image.route.ts
import { Router } from "express";
import {
  fetchUnsplashImages,
  toggleLikeImage,
  getImageDetails,
} from "../controllers/image.controller";
import { authenticate } from "../middleware/auth.middleware";

const imageRouter = Router();

/**
 * GET /api/images/unsplash
 * Fetch images from Unsplash with pagination and search
 */
imageRouter.get("/unsplash", fetchUnsplashImages);

/**
 * POST /api/images/like/:unsplashId
 * Like or Unlike an image
 */
imageRouter.post("/like/:unsplashId", authenticate, toggleLikeImage);

/**
 * GET /api/images/:unsplashId
 * Get image details (with comments and like info)
 */
imageRouter.get("/:unsplashId", authenticate, getImageDetails);

export default imageRouter;
