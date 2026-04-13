import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, {
        business_name: businessName,
        username: email.split("@")[0],
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f9fafb] to-[#eff6ff] flex items-center justify-center p-4">
      <div
        className="w-full max-w-4xl flex bg-white rounded-2xl shadow-xl overflow-hidden"
        style={{ minHeight: "580px" }}
      >
        {/* Left side */}
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
              Start managing invoices
              <br />
              like a pro.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join businesses who use our system to stay on top of their
              supplier invoices and cash flow.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "500+", desc: "Businesses" },
                { label: "₹2Cr+", desc: "Invoices tracked" },
                { label: "99%", desc: "Uptime" },
                { label: "< 1 min", desc: "Setup time" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-lg p-3">
                  <div className="text-white font-semibold">{stat.label}</div>
                  <div className="text-gray-500 text-xs">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-gray-600 text-xs">© 2026 Dealers Invoice</div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-10">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-5 md:hidden">
              <div className="w-7 h-7 bg-[#3b82f6] rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-gray-900 font-semibold">
                Dealers Invoice
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1f2937] mb-1">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              Get started in under a minute
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Pvt Ltd"
                className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Work email
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
                  placeholder="Min. 8 characters"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 pr-10 border border-[#e5e7eb] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#3b82f6] border-gray-300 rounded"
                required
                disabled={loading}
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-[#3b82f6] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#3b82f6] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#3b82f6] hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
