// src/pages/LoginPage.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Recycle } from "lucide-react";
import { api } from "../../lib/api";
import { setAuthToken, setAuthUser } from "../../lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/login", { email, password });
      setAuthToken(data?.token || "");
      setAuthUser({
        name: data?.name || "",
        email: data?.email || email,
        role: data?.role || "",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-md">
            <Recycle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Scrap Collector Admin
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to your admin dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email / Username
            </label>
            <input
              type="text"
              placeholder="admin@scrapcollector.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error ? (
            <p className="text-center text-sm text-red-600">{error}</p>
          ) : null}

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              className="text-green-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
