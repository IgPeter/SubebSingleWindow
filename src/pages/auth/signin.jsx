import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../utility/BaseUrl";
import {
  LockClosedIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Normalize fullName if it's an object {first, last}
        const userData = result.user;
        if (userData.fullName && typeof userData.fullName === "object") {
          const { first = "", last = "" } = userData.fullName;
          userData.fullName = `${first} ${last}`.trim();
        }

        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", result.token);

        // Dispatch a storage event so other components (like MainLayout) can update immediately
        window.dispatchEvent(new Event("storage"));

        // Redirect based on role or to home
        if (result.user.role === "state_admin") {
          navigate("/sports/admin");
        } else {
          navigate("/home");
        }
      } else {
        setError(result.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div>
          <div className="flex justify-center">
            <div className="p-3 bg-blue-50 rounded-2xl text-[#0c4a6e]">
              <LockClosedIcon className="h-10 w-10" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the BBEMIS Portal
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-gray-700 mb-1 ml-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ?
                    <EyeSlashIcon className="h-5 w-5" />
                  : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2 border border-red-100">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-[#0c4a6e] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-100 disabled:bg-blue-400 active:scale-[0.98]"
            >
              {loading ?
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              : "Sign in to Portal"}
            </button>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/home"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
