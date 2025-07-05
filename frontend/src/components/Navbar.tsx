import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, LogIn, GalleryVertical } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Logo or App name */}
      <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
        <GalleryVertical className="w-6 h-6" />
        <span>The Gallery</span>
      </Link>

      {/* Right: Auth Controls */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700 text-sm">
              👋 Hello, <span className="font-medium">{user}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
