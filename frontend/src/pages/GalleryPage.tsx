// src/pages/GalleryPage.tsx
import { useEffect, useState } from 'react';
import { Heart, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLikeStore } from '../store/useLikeStore';
import axios from '../api/axios';
import { useDeviceType } from '../hooks/useDeviceType';
import InfiniteScroll from 'react-infinite-scroll-component';

interface UnsplashImage {
  unsplashId: string;
  title: string;
  author: string;
  thumbnail: string;
  full: string;
  description: string;
  tags: string[];
  liked?: boolean;
}

export default function GalleryPage() {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const user = useAuthStore((state) => state.user);
  const toggleLike = useLikeStore((state) => state.toggleLike);
  const navigate = useNavigate();
  const deviceType = useDeviceType();

  const loadImages = async (pageToFetch = 1) => {
    try {
      const res = await axios.get(`/images/unsplash?page=${pageToFetch}&perPage=8`);
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
  }, []);

  const renderImageGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((img) => (
        <div
          key={img.unsplashId}
          className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img
            onClick={() => navigate(`/${img.unsplashId}`)}
            src={img.thumbnail}
            alt={img.title}
            className="w-full h-56 object-cover cursor-pointer"
          />
          <div className="p-4">
            <h2 className="text-md font-semibold text-gray-800 truncate">
              {img.title}
            </h2>
            <p className="text-xs text-gray-500">By {img.author}</p>

            <div className="mt-3 flex justify-between items-center">
              <button
                className="text-blue-600 flex items-center text-sm font-medium hover:underline"
                onClick={() => alert('✅ Image saved (feature coming soon)')}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>

              <button
                className={`flex items-center text-sm ${img.liked ? 'text-red-500' : 'text-gray-400'}`}
                onClick={async () => {
                  if (!user) return navigate('/login');

                  try {
                    await toggleLike(img.unsplashId);
                    setImages((prev) =>
                      prev.map((i) =>
                        i.unsplashId === img.unsplashId ? { ...i, liked: !i.liked } : i
                      )
                    );
                  } catch (err) {
                    console.error('Like toggle failed:', err);
                  }
                }}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${img.liked ? 'fill-red-500' : 'fill-transparent'}`}
                />
                {img.liked ? 'Liked' : 'Like'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🖼️ Explore Beautiful Images
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-white shadow rounded-xl animate-pulse overflow-hidden">
              <div className="h-56 bg-gray-300 w-full" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex justify-between mt-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : deviceType === 'mobile' ? (
        <InfiniteScroll
          dataLength={images.length}
          next={() => loadImages(page + 1)}
          hasMore={hasMore}
          loader={<h4 className="text-center mt-4">Loading more images...</h4>}
          endMessage={<p className="text-center text-gray-400 mt-4">No more images</p>}
        >
          {renderImageGrid()}
        </InfiniteScroll>
      ) : (
        <>
          {renderImageGrid()}
          <div className="flex justify-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => loadImages(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">{page}</span>
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
