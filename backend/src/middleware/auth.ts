import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  const user = await prisma.user.findUnique({
    where: { token },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // @ts-ignore
  req.user = user;
  next();
};
