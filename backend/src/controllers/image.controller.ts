// controllers/image.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import prisma from "../lib/prisma";

/**
 * @desc Fetch images from Unsplash API
 * @route GET /api/images
 * @access Public
 * @returns {Object} - Contains page, perPage, totalPages, and images array
 */
export const fetchUnsplashImages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Get query parameters with defaults
    // page: current page number, perPage: number of images per page, query: search term
    // Default query is "nature" if not provided
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 9;
    const query = (req.query.query as string) || "nature";

    // Validate page and perPage
    if (page < 1 || perPage < 1) {
      return res.status(400).json({ error: "Invalid page or perPage value" });
    }

    // Fetch images from Unsplash API
    // Using axios to make a GET request to the Unsplash search endpoint
    // Authorization header with Unsplash Access Key
    // Params include query, page, and per_page
    // Note: Ensure you have set the UNSPLASH_ACCESS_KEY in your environment variables
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return res.status(500).json({ error: "Unsplash access key not found" });
    }

    // Make the API request to Unsplash
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      params: { query, page, per_page: perPage },
    });

    // Extract total pages and map results to desired format
    // Each image object will contain unsplashId, title, author, thumbnail, full image, description, and tags
    // total_pages is the total number of pages available for the search
    if (!response.data || !response.data.results) {
      return res.status(404).json({ error: "No images found" });
    }
    const totalPages = response.data.total_pages;
    // Map the results to a more usable format
    // Each image will have properties like unsplashId, title, author, thumbnail, full, description, and tags
    // tags are optional, so we handle that with a fallback to an empty array
    // If alt_description or description is not available, we use "Untitled" or an empty string
    // The thumbnail is a smaller version of the image, while full is the high-resolution version
    const images = response.data.results.map((img: any) => ({
      unsplashId: img.id,
      title: img.alt_description || "Untitled",
      author: img.user.name,
      thumbnail: img.urls.thumb,
      full: img.urls.full,
      description: img.description || "",
      tags: img.tags?.map((tag: any) => tag.title) || [],
    }));

    // Return the response with pagination details and images
    // The response will include the current page, number of images per page, total pages, and the images array
    return res.json({ page, perPage, totalPages, images });
  } catch (error: any) {
    // Log the error for debugging
    console.error("Unsplash API error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch from Unsplash" });
  }
};

/**
 * @desc Toggle like status for an image
 * @route POST /api/images/:unsplashId
 * @access Private
 * @param {Object} req - Express request object containing unsplashId in params and userId in req.user
 * @returns {Object} - { message: "Liked" } or { message: "Unliked" }
 */
export const toggleLikeImage = async (
  req: any,
  res: Response
): Promise<any> => {
  // Extract unsplashId from request parameters and userId from request object
  // unsplashId is the unique identifier for the image on Unsplash
  // userId is the ID of the user performing the like/unlike action
  const { unsplashId } = req.params;
  const userId = req.user.id;
  try {
    // Validate unsplashId and userId
    if (!unsplashId || !userId) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Check if the image already exists in the database
    // If it does, we will toggle the like status
    // If it doesn't, we will create a new image and toggle the like status
    let image = await prisma.image.findUnique({ where: { unsplashId } });
    if (!image) {
      const unsplashRes = await axios.get(
        `https://api.unsplash.com/photos/${unsplashId}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      // If the image does not exist, we fetch it from Unsplash API
      // We use the unsplashId to get the image details
      const data = unsplashRes.data;

      // Create a new image in the database with the fetched details
      // We store the unsplashId, title, author, description, tags, thumbnail, and full image
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

    // Check if the user has already liked this image
    // We look for an existing like by the user for this image
    const existingLike = await prisma.like.findUnique({
      where: { userId_imageId: { userId, imageId: image.id } },
    });

    // If the user has already liked the image, we delete the like
    // If the user has not liked the image, we create a new like
    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ message: "Unliked" });
    } else {
      await prisma.like.create({ data: { userId, imageId: image.id } });
      return res.json({ message: "Liked" });
    }
  } catch (err: any) {
    // Log the error for debugging
    console.error("Error toggling like:", err.message);
    return res
      .status(500)
      .json({ error: err.message || "Error toggling like" });
  }
};

// GET Image Details by ID

export const getImageDetails = async (
  req: any,
  res: Response
): Promise<any> => {
  // Extract unsplashId from request parameters and userId from request object
  // unsplashId is the unique identifier for the image on Unsplash
  const { unsplashId } = req.params;
  const userId = req.user?.id;

  try {
    // Validate unsplashId
    if (!unsplashId) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    // Check if the image already exists in the database
    // If it does, we will return the image details
    // If it doesn't, we will fetch it from Unsplash API and save it to the database
    // We also include comments and likes count in the response
    // We use the unsplashId to find the image in our database
    // If the user is authenticated, we will also check if the user has liked the image
    // We include comments ordered by creation date and user details in the response
    // _count is used to get the number of likes for the image
    // If the image is not found in the database, we fetch it from Unsplash API
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return res.status(500).json({ error: "Unsplash access key not found" });
    }
    // Fetch the image from the database
    // If the image is found, we return it with comments and likes count
    let image = await prisma.image.findUnique({
      where: { unsplashId },
      include: {
        comments: { orderBy: { createdAt: "desc" }, include: { user: true } },
        _count: { select: { likes: true } },
      },
    });

    // If the image is not found in the database, we fetch it from Unsplash API
    // We use axios to make a GET request to the Unsplash API with the unsplashId
    // We include the Authorization header with the Unsplash Access Key
    // If the image is found, we create a new image in the database with the fetched details
    // We then return the image details with comments and likes count
    // If the image is not found in the database, we fetch it from Unsplash API
    // We use axios to make a GET request to the Unsplash API with the unsplashId
    // We include the Authorization header with the Unsplash Access Key
    if (!image) {
      const response = await axios.get(
        `https://api.unsplash.com/photos/${unsplashId}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      const data = response.data;

      // If the image is not found in the database, we create a new image in the database
      // We store the unsplashId, title, author, description, tags, thumbnail, and full in the database
      await prisma.image.create({
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

      // After creating the image, we fetch it again from the database
      // We include comments ordered by creation date and user details in the response
      // We also include the count of likes for the image
      image = await prisma.image.findUnique({
        where: { unsplashId },
        include: {
          comments: { orderBy: { createdAt: "desc" }, include: { user: true } },
          _count: { select: { likes: true } },
        },
      });

      if (!image)
        return res.status(404).json({ error: "Image could not be loaded" });
    }

    // If the image is found, we check if the user has liked this image
    let liked = false;
    // If the userId is provided, we check if there is a like entry for this user and image
    // We use the userId and imageId to find the like entry in the database
    if (userId) {
      const like = await prisma.like.findUnique({
        where: { userId_imageId: { userId, imageId: image.id } },
      });
      // If a like entry is found, we set liked to true
      // This indicates that the user has liked this image
      liked = !!like;
    }

    // Return the image details along with comments, likes count, and whether the user has liked it
    // The response will include the image details, comments, likes count, and liked status
    return res.json({ ...image, liked });
  } catch (err: any) {
    // Log the error for debugging
    console.error("Error fetching image details:", err.message);
    return res.status(500).json({ error: err });
  }
};
