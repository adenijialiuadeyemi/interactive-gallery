import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // grab the authorization header
  const authHeader = req.headers.authorization;

  // check if the header is present and starts with "Bearer "
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // verify the token
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    // decode the token to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // check if the decoded token has a userId
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // find the user in the database using the userId from the token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    // if the user is not found, return an error
    if (!user) return res.status(401).json({ error: "User not found" });

    // @ts-ignore
    req.user = user;
    next();
  } catch (error: any) {
    // if there's an error during verification, return an error
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
