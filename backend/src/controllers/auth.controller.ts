import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "";

// ✅ Correct typing and export
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validate request body
    const { name, email, password } = req.body;

    // Ensure all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // Check password strength
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if name is too short
    if (name.length < 3) {
      return res.status(400).json({
        error: "Name must be at least 3 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Generate JWT token
    // Use jsonwebtoken to sign a token with the user's ID
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user info and token
    return res
      .status(201)
      .json({ user: { id: user.id, name: user.name }, token });
  } catch (err: any) {
    console.log("Error in register controller:", err.messaeg);
    return res.status(400).json({ error: err.message || "Registration error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validate request body
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user info and token
    return res.json({ user: { id: user.id, name: user.name }, token });
  } catch (err: any) {
    // Log the error for debugging
    console.log("Error in login controller:", err.message);
    return res.status(400).json({ error: err.message || "Login error" });
  }
};
