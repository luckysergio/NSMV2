import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Building,
  Shield,
  ArrowRight,
  Globe,
  TrendingUp,
  Users,
  Briefcase,
} from "lucide-react";
import Swal from "sweetalert2";
import { login } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainCardHovered, setMainCardHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      
      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang di Niaga Solusi Mandiri!",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f1f5f9",
      });

      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: err.response?.data?.message || "Email atau password salah",
        background: "#0f172a",
        color: "#f1f5f9",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-950 to-gray-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, #64748b 1px, transparent 1px),
                               linear-gradient(180deg, #64748b 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Animated Orbs */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const icons = [
              <TrendingUp key="trending" className="w-6 h-6 text-emerald-400/10" />,
              <Users key="users" className="w-6 h-6 text-blue-400/10" />,
              <Briefcase key="briefcase" className="w-6 h-6 text-cyan-400/10" />,
              <Globe key="globe" className="w-6 h-6 text-teal-400/10" />,
            ];
            const Icon = icons[i % 4];

            return (
              <div
                key={i}
                className="absolute animate-float-slow"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: "20s",
                }}
              >
                {Icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Login Card */}
      <div
        className="relative z-10 w-full max-w-md"
        onMouseEnter={() => setMainCardHovered(true)}
        onMouseLeave={() => setMainCardHovered(false)}
      >
        {/* Glow Effect */}
        <div
          className={`absolute -inset-0.5 bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 rounded-2xl blur opacity-60 transition-all duration-500 ${mainCardHovered ? "opacity-80" : ""}`}
        />

        {/* Main Card */}
        <div className="relative bg-linear-to-br from-slate-800/90 via-slate-900/90 to-gray-900/90 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl backdrop-blur-sm">
          {/* Subtle Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-blue-500/10"></div>
          </div>

          {/* Header */}
          <div className="relative px-8 pt-10 pb-8 text-center">
            {/* Logo Container */}
            <div className="relative inline-flex mb-4">
              {/* Outer Ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-emerald-500/20 animate-pulse-slow" />

              {/* Logo Circle */}
              <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-lg">
                {/* Inner Circle */}
                <div className="absolute w-20 h-20 rounded-full border border-teal-500/20" />

                {/* Logo Icon */}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 shadow-lg" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-blue-500 shadow-lg" />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                NIAGA SOLUSI MANDIRI
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 tracking-wider">
              Enterprise Business Solution Platform
            </p>
          </div>

          {/* Form */}
          <div className="relative px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type="email"
                    className="relative w-full bg-slate-900/70 border-2 border-slate-700 rounded-xl px-4 py-3.5 pl-11 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-slate-200 placeholder-slate-500 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="admin@niagasu.com"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="relative w-full bg-slate-900/70 border-2 border-slate-700 rounded-xl px-4 py-3.5 pl-11 pr-11 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-slate-200 placeholder-slate-500 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full relative overflow-hidden group mt-8 ${
                  loading ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {/* Button Background */}
                <div className="absolute inset-0 bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Shine Effect */}
                <div className="absolute top-0 left-0 w-8 h-full bg-white/20 skew-x-12 -translate-x-16 group-hover:translate-x-[200%] transition-transform duration-700" />

                {/* Button Content */}
                <div className="relative py-3.5 rounded-xl flex items-center justify-center">
                  {loading ? (
                    <span className="flex items-center text-white font-semibold tracking-wider">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      AUTHENTICATING...
                    </span>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-3 text-white" />
                      <span className="text-white font-semibold tracking-wider">
                        ACCESS ENTERPRISE PLATFORM
                      </span>
                      <ArrowRight className="w-5 h-5 ml-3 text-white" />
                    </>
                  )}
                </div>
              </button>

              {/* Separator */}
              <div className="flex items-center justify-center pt-6">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-700 to-transparent" />
                <span className="px-4 text-sm text-slate-500">ENTERPRISE ACCESS</span>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-700 to-transparent" />
              </div>

              {/* Info Note */}
              <div className="text-center pt-4">
                <p className="text-xs text-slate-500">
                  Secure access to enterprise management system
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  © {new Date().getFullYear()} Niaga Solusi Mandiri • v2.1.0
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.3;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;