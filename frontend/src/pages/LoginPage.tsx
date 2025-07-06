import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuthStore } from "../store/useAuthStore";
import loginImage from "/login.svg";
import { motion } from "framer-motion";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return (
    <div className="flex h-[calc(100vh-36px)] bg-gray-100">
      {/* Left image for desktop */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex items-center justify-center w-1/2 rounded bg-gradient-to-r from-blue-100 to-blue-200"
      >
        <img
          src={loginImage}
          alt="Login Illustration"
          className="max-w-md w-full h-auto object-contain"
        />
      </motion.div>

      {/* Right form section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="flex items-center justify-center w-full md:w-3/4 px-4 py-8"
      >
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
            🔐 Login to your account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Welcome back! Please enter your credentials to continue.
          </p>

          <AuthForm
            isLogin
            onSubmit={async ({ email, password }) => {
              await login(email, password);
              navigate("/");
            }}
          />

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>

    </div>
  );
}
