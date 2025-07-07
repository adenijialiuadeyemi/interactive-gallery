import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRouter from "./routes/auth.route";
import commentRouter from "./routes/comment.route";
import imageRouter from "./routes/image.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (_, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/images", imageRouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);

// Serve static frontend from dist
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
