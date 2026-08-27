import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userEmail = (email || "admin@shoesmu.com").trim().toLowerCase();

    // Save newly registered email to localStorage
    const savedRegistered = JSON.parse(localStorage.getItem("shoesmu_registered_users") || "[]");
    if (!savedRegistered.includes(userEmail)) {
      savedRegistered.push(userEmail);
      localStorage.setItem("shoesmu_registered_users", JSON.stringify(savedRegistered));
    }

    const fullName = `${firstName} ${lastName}`.trim() || "Admin User";
    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "AU";
    login({
      id: "u-" + Date.now(),
      name: fullName,
      email: userEmail,
      role: "super_admin",
      roleLabel: "Super Admin",
      avatar: null,
      initials: initials,
    });
    navigate("/dashboard");
  };

  const handleSocialSignUp = (provider) => {
    login("super_admin");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans selection:bg-ink selection:text-white bg-[#0D0D11]">
      {/* ========================================================================= */}
      {/* LEFT COLUMN — Clean Minimal Editorial Brand Hero                          */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 bg-black text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[420px] lg:min-h-screen relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Top Header / Brand Logo */}
        <Link to="/" className="flex items-center gap-2 z-10 group w-fit">
          <span className="font-extrabold text-2xl tracking-tight text-white font-sans lowercase">
            shoesmu<span className="text-black">.</span>
          </span>
          <span className="text-[10px] font-semibold text-gray-400 tracking-[0.25em] uppercase ml-1 group-hover:text-white transition-colors">
            ADMIN
          </span>
        </Link>

        {/* Center Headline & Subtitle */}
        <div className="max-w-md my-auto py-12 lg:py-0 z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.18] tracking-tight font-sans">
            Pilih Sepatu Favoritmu<br />
            dengan Berbagai Macam.
          </h1>
          <p className="mt-4 text-text2 sm:text-[15px] text-gray-400 font-normal leading-relaxed">
            Siap merima semua jenis sepatu yang anda perlukan.
          </p>
        </div>

        {/* Bottom Version Tag */}
        <div className="text-[11px] font-medium tracking-[0.2em] text-gray-500 uppercase font-mono z-10">
          V1.0 · SINGLE WAREHOUSE
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN — Sign Up Form with Modern Inputs & Social Grid */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-[440px] mx-auto py-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-[11px] font-bold tracking-wider uppercase mb-3">
              <Shield className="w-3.5 h-3.5 text-gray-700" />
              <span>JOIN SHOESMU ADMIN</span>
            </div>
            <h2 className="text-3xl sm:text-[34px] font-extrabold text-[#111111] tracking-tight mb-2">
              Create Admin Account
            </h2>
            <p className="text-[14px] text-gray-500">
              Get started with your footwear store console in minutes.
            </p>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialSignUp("Google")}
              className="w-full h-11 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-[13px] font-bold rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Apple Button */}
            <button
              type="button"
              onClick={() => handleSocialSignUp("Apple")}
              className="w-full h-11 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-[13px] font-bold rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.01-.48 2.63-1.23" />
              </svg>
              <span>Apple ID</span>
            </button>
          </div>

          {/* OR Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest absolute">
              OR REGISTER WITH EMAIL
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name (2 Column Row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                  First Name <span className="text-[#D92D21] font-semibold">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full h-11 pl-10 pr-4 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                  Last Name <span className="text-[#D92D21] font-semibold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Rivera"
                  className="w-full h-11 px-4 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                Work Email <span className="text-[#D92D21] font-semibold">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@shoesmu.com"
                  className="w-full h-11 pl-10 pr-4 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
              </div>
            </div>

            {/* Password Field with Eye toggle */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                Create Password <span className="text-[#D92D21] font-semibold">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full h-11 pl-10 pr-10 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign Up Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#111111] hover:bg-black text-white text-[15px] font-bold rounded-xl shadow-lg shadow-black/10 hover:shadow-black/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 select-none group"
              >
                <span>Create Admin Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Already have an account? Log In Link */}
          <div className="mt-8 text-center text-[14px] text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-gray-900 underline hover:text-black transition-colors"
            >
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
