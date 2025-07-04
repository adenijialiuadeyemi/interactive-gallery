import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import imageRoutes from "./routes/images";
import commentRoutes from "./routes/comments";
import authRoutes from "./routes/auth";

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
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
