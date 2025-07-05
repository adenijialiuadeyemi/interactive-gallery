import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Handles the login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim().length < 3) {
      alert('Username must be at least 3 characters long.');
      return;
    }

    // Simulate a fake token for now
    const fakeToken = 'mock-token-123';

    // Save to Zustand + localStorage
    login(username, fakeToken);

    // Navigate to the gallery after login
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-purple-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl px-8 py-10 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          <LogIn className="inline-block w-6 h-6 mr-2 text-blue-500" />
          Login to Continue
        </h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-300"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
