import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import SocialLogin from "../components/SocialLogin";
import useAxiosSecure from "../hooks/useAxiosSecure";
import axios from "axios";
import Swal from "sweetalert2";
import Logo from "../components/Logo";

import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaArrowRight,
  FaCamera,
  FaUserShield,
  FaCar,
  FaSun,
  FaMoon,
} from "react-icons/fa";

// ─── Demo Roles ───────────────────────────────────────────────────────────
const DEMO_ROLES = [
  {
    role: "Admin",
    icon: <FaUserShield size={14} />,
    desc: "Manage users, cars and payments",
  },
  {
    role: "Rider",
    icon: <FaCar size={14} />,
    desc: "List cars and track earnings",
  },
  {
    role: "User",
    icon: <FaUser size={14} />,
    desc: "Browse cars and book rentals",
  },
];

// ─── Theme Toggle ─────────────────────────────────────────────────────────
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="
        absolute top-5 right-5 z-30
        flex h-11 w-11 items-center justify-center
        rounded-xl border border-base-300
        bg-base-100 text-base-content/70
        shadow-md transition-all duration-200
        hover:border-primary/50 hover:text-primary
        hover:bg-primary/5 active:scale-95
      "
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "light" ? <FaMoon size={15} /> : <FaSun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

// ─── Register Page ────────────────────────────────────────────────────────
const Register = () => {
  const { registerUser, updateUserProfile, user } = useAuth();

  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // ─── Registration Handler ─────────────────────────────────────────────
  const handleRegistration = async (data) => {
    const from = location.state?.from?.pathname || "/";

    try {
      const profileImg = data.photo?.[0];

      if (!profileImg) {
        throw new Error("Profile image is required");
      }

      // Firebase registration
      await registerUser(data.email, data.password);

      // Upload profile image to ImgBB
      const formData = new FormData();
      formData.append("image", profileImg);

      const img_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

      const imgRes = await axios.post(img_API_URL, formData);

      const photoURL = imgRes.data.data.url;

      // Save user information to MongoDB
      const userInfo = {
        email: data.email,
        displayName: data.name,
        photoURL,
      };

      await axiosSecure.post("/users", userInfo);

      // Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      reset();

      navigate(from, { replace: true });

      Swal.fire({
        icon: "success",
        title: "Account created!",
        text: "Welcome to Wheelzy.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Registration error:", err);

      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: err.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-200">
      <div className="relative min-h-screen w-full">
        {/* Theme Toggle */}
        <ThemeToggle />

        <div
          className="
            grid min-h-screen w-full
            grid-cols-1 lg:grid-cols-2
            bg-base-100 overflow-hidden
          "
        >
          {/* ─── Left Brand Panel ───────────────────────────────────── */}
          <div
            className="
              hidden lg:flex flex-col justify-between
              bg-neutral px-12 xl:px-20 py-12
              relative overflow-hidden
            "
          >
            {/* Background Decorations */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/10 rounded-full" />

            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-primary/5 rounded-full" />

            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

            {/* Logo */}
            <div className="relative z-10">
              <Logo
                size="md"
                showText
                className="[&_span]:text-white [&_span_span]:text-primary"
              />
            </div>

            {/* Brand Content */}
            <div className="relative z-10 max-w-xl space-y-8">
              <div>
                <span
                  className="
                    inline-flex items-center gap-2
                    rounded-full border border-primary/30
                    bg-primary/10 px-4 py-2
                    text-xs font-bold uppercase tracking-widest
                    text-primary mb-6
                  "
                >
                  Welcome to Wheelzy
                </span>

                <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-5">
                  Join Wheelzy.
                  <br />
                  <span className="text-primary">Start your journey.</span>
                </h2>

                <p className="text-neutral-content/75 text-base xl:text-lg leading-relaxed max-w-lg">
                  Create your account and discover a smarter way to rent and
                  manage premium vehicles across Bangladesh.
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-5">
                {[
                  "Browse verified cars from trusted riders",
                  "Book vehicles with secure payments",
                  "Manage all your rentals in one place",
                ].map((item) => (
                  <li
                    key={item}
                    className="
                      flex items-center gap-3
                      text-sm xl:text-base text-neutral-content/80
                    "
                  >
                    <div
                      className="
                        w-6 h-6 bg-primary/20
                        rounded-full flex items-center
                        justify-center shrink-0
                      "
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>

                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Copyright */}
            <p className="relative z-10 text-xs text-neutral-content/50">
              &copy; {new Date().getFullYear()} Wheelzy. All rights reserved.
            </p>
          </div>

          {/* ─── Right Registration Panel ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="
              flex flex-col justify-center
              px-6 py-12 sm:px-10 lg:px-12
              xl:px-20 overflow-y-auto
            "
          >
            <div className="w-full max-w-2xl mx-auto">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-8">
                <Logo size="md" />
              </div>

              {/* Heading */}
              <div className="max-w-md mx-auto mb-6">
                <h1 className="text-3xl font-extrabold text-base-content mb-2">
                  Create account
                </h1>

                <p className="text-sm text-base-content/70">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    state={location.state}
                    className="text-primary font-bold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* ─── Registration Form ─────────────────────────────── */}
              <form
                onSubmit={handleSubmit(handleRegistration)}
                className="max-w-md mx-auto space-y-3"
              >
                {/* Full Name */}
                <div>
                  <label
                    className="
                    block text-xs font-semibold
                    text-base-content/80 mb-1.5
                    uppercase tracking-wide
                  "
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <FaUser
                      className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-base-content/45 text-sm
                    "
                    />

                    <input
                      type="text"
                      placeholder="Your full name"
                      className={`
                        w-full h-10 pl-10 pr-4
                        bg-base-200 border rounded-lg
                        text-sm text-base-content
                        placeholder:text-base-content/40
                        focus:outline-none focus:ring-2
                        focus:ring-primary/30
                        focus:border-primary transition-all
                        ${errors.name ? "border-red-400" : "border-base-300"}
                      `}
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                  </div>

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Profile Photo */}
                <div>
                  <label
                    className="
                    block text-xs font-semibold
                    text-base-content/80 mb-1.5
                    uppercase tracking-wide
                  "
                  >
                    Profile Photo
                  </label>

                  <div className="relative">
                    <FaCamera
                      className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-base-content/45 text-sm
                      pointer-events-none
                    "
                    />

                    <input
                      type="file"
                      accept="image/*"
                      className={`
                        w-full h-10 pl-10 pr-3
                        bg-base-200 border rounded-lg
                        text-xs text-base-content
                        file:border-0 file:bg-transparent
                        file:text-xs file:font-semibold
                        file:text-primary file:cursor-pointer
                        focus:outline-none focus:ring-2
                        focus:ring-primary/30
                        focus:border-primary transition-all
                        ${errors.photo ? "border-red-400" : "border-base-300"}
                      `}
                      {...register("photo", {
                        required: "Photo is required",
                      })}
                    />
                  </div>

                  {errors.photo && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.photo.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className="
                    block text-xs font-semibold
                    text-base-content/80 mb-1.5
                    uppercase tracking-wide
                  "
                  >
                    Email
                  </label>

                  <div className="relative">
                    <FaEnvelope
                      className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-base-content/45 text-sm
                    "
                    />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`
                        w-full h-10 pl-10 pr-4
                        bg-base-200 border rounded-lg
                        text-sm text-base-content
                        placeholder:text-base-content/40
                        focus:outline-none focus:ring-2
                        focus:ring-primary/30
                        focus:border-primary transition-all
                        ${errors.email ? "border-red-400" : "border-base-300"}
                      `}
                      {...register("email", {
                        required: "Email is required",
                      })}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    className="
                    block text-xs font-semibold
                    text-base-content/80 mb-1.5
                    uppercase tracking-wide
                  "
                  >
                    Password
                  </label>

                  <div className="relative">
                    <FaLock
                      className="
                      absolute left-3.5 top-1/2
                      -translate-y-1/2
                      text-base-content/45 text-sm
                    "
                    />

                    <input
                      type="password"
                      placeholder="Min. 6 characters"
                      className={`
                        w-full h-10 pl-10 pr-4
                        bg-base-200 border rounded-lg
                        text-sm text-base-content
                        placeholder:text-base-content/40
                        focus:outline-none focus:ring-2
                        focus:ring-primary/30
                        focus:border-primary transition-all
                        ${errors.password ? "border-red-400" : "border-base-300"}
                      `}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Minimum 6 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                          message:
                            "Must have uppercase, lowercase, number & special character",
                        },
                      })}
                    />
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    w-full h-10 bg-primary
                    text-primary-content font-bold
                    rounded-lg text-sm
                    flex items-center justify-center gap-2
                    hover:brightness-95 transition-all
                    shadow-sm hover:shadow-md
                    disabled:opacity-60 mt-2
                  "
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}

                  {!isSubmitting && <FaArrowRight size={12} />}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="max-w-md mx-auto flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-base-300" />

                <span className="text-xs text-base-content/60 font-medium">
                  or
                </span>

                <div className="flex-1 h-px bg-base-300" />
              </div>

              {/* Social Login */}
              <div className="max-w-md mx-auto">
                <SocialLogin type="register" />
              </div>

              {/* ─── Explore Before Registering ─────────────────────── */}
              <div className="mt-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-base-300" />

                  <span
                    className="
                    text-[11px] font-bold uppercase
                    tracking-widest text-base-content/65
                    whitespace-nowrap
                  "
                  >
                    Explore Wheelzy First
                  </span>

                  <div className="flex-1 h-px bg-base-300" />
                </div>

                <p
                  className="
                  text-sm text-base-content/70
                  text-center mb-4 leading-relaxed
                "
                >
                  Not ready to register? Explore Wheelzy using a demo account.
                </p>

                {/* Demo Role Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DEMO_ROLES.map((role) => (
                    <motion.div
                      key={role.role}
                      whileHover={{ y: -2 }}
                      className="
                        flex flex-col items-center text-center gap-2
                        rounded-xl border border-base-300
                        bg-base-100 p-3
                        transition-all duration-200
                        hover:border-primary/50 hover:shadow-sm
                      "
                    >
                      <div
                        className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg bg-primary/10 text-primary
                      "
                      >
                        {role.icon}
                      </div>

                      <h3 className="text-xs font-bold text-base-content">
                        {role.role}
                      </h3>

                      <p className="text-[10px] leading-relaxed text-base-content/65">
                        {role.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Login Link */}
                <Link
                  to="/login"
                  className="
                    flex items-center justify-center gap-2
                    w-full h-10 mt-4
                    rounded-xl border border-base-300
                    bg-base-200
                    text-xs font-bold text-base-content
                    hover:border-primary/50
                    hover:text-primary
                    transition-all duration-200
                  "
                >
                  Go to Login & Use Demo Account
                  <FaArrowRight size={11} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
