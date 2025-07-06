// routes/auth.router.ts
import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

const authRouter = Router();

/**
 * POST /api/auth/register
 * Register a new user
 * This endpoint expects a JSON body with name, email, and password.
 * It will create a new user in the database and return the user info along with a JWT
 */
authRouter.post("/register", register);

/**
 * POST /api/auth/login
 * Login an existing user
 * This endpoint expects a JSON body with email and password.
 * It will authenticate the user and return the user info along with a JWT
 */
authRouter.post("/login", login);

export default authRouter;
