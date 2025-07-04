import { Router } from "express";
import prisma from "../lib/prisma";
import { v4 as uuid } from "uuid";

const router = Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Name must be at least 2 characters" });
    }

    const trimmedName = name.trim();

    // Check if user exists
    let user = await prisma.user.findFirst({ where: { name: trimmedName } });

    // If not, create a new one
    if (!user) {
      const token = uuid();
      user = await prisma.user.create({
        data: {
          name: trimmedName,
          token,
        },
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      token: user.token,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Auth failed" });
  }
});

export default router;
