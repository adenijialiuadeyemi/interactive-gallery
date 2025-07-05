// src/pages/RegisterPage.tsx
import AuthForm from "../components/AuthForm";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthForm
        onSubmit={async ({ name, email, password }) => {
          await register(name!, email, password);
          navigate("/");
        }}
      />
    </div>
  );
}
