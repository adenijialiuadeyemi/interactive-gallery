import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import imageRoutes from "./routes/images.route";

import authRouter from "./routes/auth.route";
import commentRouter from "./routes/comment.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("API is running...");
});

//end points
app.use("/api/images", imageRoutes);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
