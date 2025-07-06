import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, LogIn, UserPlus, Image } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
        <Image className="w-6 h-6" />
        <span>Gallery</span>
      </Link>

      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
