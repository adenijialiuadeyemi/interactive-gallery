// src/pages/GalleryPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useDeviceType } from "../hooks/useDeviceType";
import InfiniteScroll from "react-infinite-scroll-component";
import { Eye, Search } from "lucide-react";
import { motion } from "framer-motion";

interface UnsplashImage {
  unsplashId: string;
  title: string;
  author: string;
  thumbnail: string;
  full: string;
  description: string;
  tags: string[];
}

export default function GalleryPage() {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("nature");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const deviceType = useDeviceType();

  const loadImages = async (pageToFetch = 1) => {
    try {
      const res = await axios.get(
        `/images/unsplash?page=${pageToFetch}&perPage=8&query=${searchQuery}`
      );
      const { images: newImages, totalPages } = res.data;

      if (pageToFetch === 1) {
        setImages(newImages);
      } else {
        setImages((prev) => [...prev, ...newImages]);
      }

      setHasMore(pageToFetch < totalPages);
      setPage(pageToFetch);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages(1);
  }, [searchQuery]);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const renderImageGrid = () => (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {images.map((img) => (
        <motion.div
          key={img.unsplashId}
          variants={cardVariants}
          className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
        >
          <img
            onClick={() => navigate(`/${img.unsplashId}`)}
            src={img.thumbnail}
            alt={img.title}
            className="w-full h-56 object-cover cursor-pointer"
          />
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-md font-semibold text-gray-800 truncate">{img.title}</h2>
            <p className="text-xs text-gray-500 mb-4">By {img.author}</p>
            <button
              className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              onClick={() => navigate(`/${img.unsplashId}`)}
            >
              <Eye className="w-4 h-4" />
              View Detail
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>

  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.0, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight leading-tight">
          🌟 Explore <span className="text-blue-600">Beautiful Images</span>
        </h1>
        <p className="text-md text-gray-500 mt-2 max-w-xl mx-auto">
          Discover stunning visuals from around the world — search by topic or browse categories you love.
        </p>
      </motion.div>


      {/* Search + Category Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10 justify-center items-center">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadImages(1)}
            className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            setSearchQuery(value);
          }}
          className="w-full max-w-xs border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose Category</option>
          <option value="nature">Nature</option>
          <option value="technology">Technology</option>
          <option value="animals">Animals</option>
          <option value="food">Food</option>
          <option value="people">People</option>
          <option value="travel">Travel</option>
        </select>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-white shadow rounded-xl animate-pulse overflow-hidden"
            >
              <div className="h-56 bg-gray-300 w-full" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : deviceType === "mobile" ? (
        <InfiniteScroll
          dataLength={images.length}
          next={() => loadImages(page + 1)}
          hasMore={hasMore}
          loader={<h4 className="text-center mt-4 text-gray-500">Loading more images...</h4>}
          endMessage={
            <p className="text-center text-gray-400 mt-4">No more images available.</p>
          }
        >
          {renderImageGrid()}
        </InfiniteScroll>
      ) : (
        <>
          {renderImageGrid()}
          <div className="flex justify-center gap-4 mt-10">
            <button
              disabled={page === 1}
              onClick={() => loadImages(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">{page}</span>
            <button
              disabled={!hasMore}
              onClick={() => loadImages(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
