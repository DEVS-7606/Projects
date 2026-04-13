import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#eff6ff] flex items-center justify-center p-4">
      <div
        className="w-full max-w-4xl flex bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{ minHeight: "560px" }}
      >
        {/* Left side - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-[#1f2937] flex-col justify-between p-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">
              Dealers Invoice
            </span>
          </div>

          <div>
            <h2 className="text-white text-2xl font-semibold leading-snug mb-4">
              Manage invoices smarter,
              <br />
              not harder.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Forward your supplier emails and let our system automatically
              extract invoice data, track payments, and keep your books
              organized.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              {[
                "Auto-extract invoice data via email",
                "Track payment status in real-time",
                "Get overdue alerts automatically",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#3b82f6]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#3b82f6] rounded-full" />
                  </div>
                  <span className="text-gray-300 text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-gray-600 text-xs">© 2026 Dealers Invoice</div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 md:hidden">
              <div className="w-7 h-7 bg-[#3b82f6] rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-gray-900 font-semibold">
                Dealers Invoice
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1f2937] mb-1">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pr-10 border border-[#e5e7eb] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#3b82f6] border-gray-300 rounded"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#3b82f6] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#3b82f6] hover:underline font-medium"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
