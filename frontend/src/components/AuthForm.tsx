// src/components/AuthForm.tsx
import { useState } from "react";
import { Loader } from "lucide-react";

interface AuthFormProps {
  isLogin?: boolean;
  onSubmit: (values: { name?: string; email: string; password: string }) => Promise<void>;
}

export default function AuthForm({ isLogin = false, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          value={formData.name}
          required
          className="w-full p-2 border rounded"
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        value={formData.password}
        required
        className="w-full p-2 border rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 flex justify-center items-center"
      >
        {loading ? <Loader className="animate-spin w-5 h-5" /> : isLogin ? "Login" : "Register"}
      </button>
    </form>
  );
}
