import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuthStore } from "../store/useAuthStore";
import registerImage from "/login.svg"; // Replace with /register.svg if different
import { motion } from "framer-motion";

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  return (
    <div className="flex h-[calc(100vh-36px)] bg-gray-100">
      {/* Left image section with animation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex items-center justify-center w-1/2 rounded bg-gradient-to-r from-blue-100 to-blue-200"
      >
        <img
          src={registerImage}
          alt="Register Illustration"
          className="max-w-md w-full h-auto object-contain"
        />
      </motion.div>

      {/* Right form section with animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="flex items-center justify-center w-full md:w-3/4 px-4 py-8"
      >
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
            📝 Create a new account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Get started with a few simple details below.
          </p>

          <AuthForm
            onSubmit={async ({ name, email, password }) => {
              await register(name!, email, password);
              navigate("/");
            }}
          />

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
