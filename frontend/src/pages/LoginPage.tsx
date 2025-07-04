// src/pages/LoginPage.tsx
import AuthForm from "../components/AuthForm";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm
        isLogin
        onSubmit={async ({ email, password }) => {
          await login(email, password);
          navigate("/"); // redirect to gallery
        }}
      />
    </div>
  );
}
