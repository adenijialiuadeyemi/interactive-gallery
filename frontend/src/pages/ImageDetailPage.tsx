import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Heart, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useLikeStore } from "../store/useLikeStore";
import { useCommentStore } from "../store/useCommentStore";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface Image {
  id: string;
  unsplashId: string;
  title: string;
  author: string;
  description: string;
  tags: string[];
  full: string;
  liked?: boolean;
}

export default function ImageDetailPage() {
  const { unsplashId } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const user = useAuthStore((state) => state.user);
  const fetchComments = useCommentStore((state) => state.fetchComments);
  const postComment = useCommentStore((state) => state.postComment);
  const comments = useCommentStore((state) => state.comments);
  const toggleLike = useLikeStore((state) => state.toggleLike);

  useEffect(() => {
    const loadData = async () => {
      try {
        const imgRes = await axios.get(`/images/${unsplashId}`);
        setImage(imgRes.data);
        await fetchComments(unsplashId!);
      } catch (err) {
        console.error("Error loading image or comments:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [unsplashId]);

  const handleLike = async () => {
    if (!user) return navigate("/login");

    try {
      await toggleLike(unsplashId!);
      setImage((prev) =>
        prev ? { ...prev, liked: !prev.liked } : prev
      );

      if (!image?.liked) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  const handleSubmit = async () => {
    if (!user) return navigate("/login");
    if (!newComment || newComment.trim().length < 3) return;

    try {
      await postComment(unsplashId!, newComment.trim());
      setNewComment("");
      await fetchComments(unsplashId!);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  if (loading || !image) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen mt-[10px] bg-gray-50 px-4 py-6 max-w-4xl mx-auto"
    >
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 flex items-center mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-md rounded-xl overflow-hidden"
      >
        <img
          src={image.full}
          alt={image.title}
          className="w-full h-[500px] object-cover"
        />

        <div className="p-6 space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">{image.title}</h1>
          <p className="text-sm text-gray-500">By {image.author}</p>
          {image.description && (
            <p className="text-gray-700 mt-2">{image.description}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {image.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              className={`flex items-center text-sm ${image.liked ? "text-red-500" : "text-gray-400"}`}
              onClick={handleLike}
            >
              <Heart
                className={`w-4 h-4 mr-1 ${image.liked ? "fill-red-500" : "fill-transparent"}`}
              />
              {image.liked ? "Liked" : "Like"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Comments</h2>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>

        <div className="space-y-3 mb-20">
          {comments.length === 0 && (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-700">{c.user.name}</p>
              <p className="text-gray-600 text-sm mt-1">{c.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
