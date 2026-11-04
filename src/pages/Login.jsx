import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import SocialLogin from "../components/SocialLogin";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Logo from "../components/Logo";

import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUserShield,
  FaCar,
  FaUser,
  FaSun,
  FaMoon,
} from "react-icons/fa";

// ─── Demo Accounts ────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    email: import.meta.env.VITE_DEMO_ADMIN_EMAIL,
    password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD,
    icon: <FaUserShield size={17} />,
    description: "Manage users, cars, payments and platform approvals.",
  },
  {
    role: "Rider",
    email: import.meta.env.VITE_DEMO_RIDER_EMAIL,
    password: import.meta.env.VITE_DEMO_RIDER_PASSWORD,
    icon: <FaCar size={17} />,
    description: "Manage car listings, rentals, earnings and ride requests.",
  },
  {
    role: "User",
    email: import.meta.env.VITE_DEMO_USER_EMAIL,
    password: import.meta.env.VITE_DEMO_USER_PASSWORD,
    icon: <FaUser size={17} />,
    description: "Explore vehicles, book rentals and manage your activity.",
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

// ─── Demo Card ────────────────────────────────────────────────────────────
const DemoCard = ({ account, onLogin, loadingRole }) => {
  const isLoading = loadingRole === account.role;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="
        group flex flex-col gap-4
        rounded-2xl border border-base-300
        bg-base-100 p-4
        shadow-sm hover:shadow-md
        hover:border-primary/50
        transition-all duration-200
      "
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl bg-primary/10 text-primary
            ring-1 ring-primary/15
          "
        >
          {account.icon}
        </div>

        <span
          className="
            rounded-lg border border-primary/25
            bg-primary/10 px-3 py-1
            text-[10px] font-bold uppercase tracking-wider
            text-base-content
          "
        >
          {account.role}
        </span>
      </div>

      {/* Description */}
      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-bold text-base-content">
          {account.role} Access
        </h3>

        <p className="text-xs leading-relaxed text-base-content/75">
          {account.description}
        </p>
      </div>

      {/* Email */}
      <div
        className="
          rounded-lg border border-base-300
          bg-base-200 px-3 py-2
        "
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-base-content/60">
          Demo Email
        </p>

        <p className="truncate text-xs font-medium text-base-content">
          {account.email || "Not configured"}
        </p>
      </div>

      {/* Login Button */}
      <button
        type="button"
        onClick={() => onLogin(account)}
        disabled={!!loadingRole}
        className="
          flex h-10 w-full items-center justify-center gap-2
          rounded-xl bg-primary
          text-xs font-bold text-primary-content
          shadow-sm transition-all duration-200
          hover:brightness-95 hover:shadow-md
          active:scale-[0.98]
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
                h-3.5 w-3.5 rounded-full
                border-2 border-primary-content/40
                border-t-primary-content
              "
            />
            Signing in...
          </>
        ) : (
          <>
            Continue as {account.role}
            <FaArrowRight size={10} />
          </>
        )}
      </button>
    </motion.div>
  );
};

// ─── Login Page ───────────────────────────────────────────────────────────
const Login = () => {
  const { signInUser, user } = useAuth();

  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  const [loadingRole, setLoadingRole] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate(location.state?.from?.pathname || "/", {
        replace: true,
      });
    }
  }, [user, navigate, location]);

  // ─── Normal Login ─────────────────────────────────────────────────────
  const handleSignIn = async (data) => {
    try {
      await signInUser(data.email, data.password);

      await axiosSecure.post("/users", {
        email: data.email,
      });

      reset();

      navigate(location?.state || "/");

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Login error:", error);

      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Invalid email or password. Please try again.",
      });
    }
  };

  // ─── Demo Login ──────────────────────────────────────────────────────
  const handleDemoLogin = async (account) => {
    if (!account.email || !account.password) {
      Swal.fire({
        icon: "warning",
        title: "Demo not configured",
        text: "Demo credentials are missing from the environment. Contact the site owner.",
      });

      return;
    }

    setLoadingRole(account.role);

    try {
      // Firebase authentication
      await signInUser(account.email, account.password);

      // MongoDB login synchronization
      await axiosSecure.post("/users", {
        email: account.email,
      });

      // Dashboard navigation
      navigate("/dashboard");
    } catch (err) {
      console.error(`${account.role} demo login error:`, err);

      const code = err?.code || "";

      let title = `${account.role} demo unavailable`;
      let text = "An unexpected error occurred. Please try again.";

      if (
        code === "auth/user-not-found" ||
        code === "auth/invalid-credential" ||
        code === "auth/invalid-email"
      ) {
        text =
          `The ${account.role} demo account (${account.email}) doesn't exist ` +
          "in Firebase yet. Run POST /provision-demo-accounts on the server to set it up.";
      } else if (code === "auth/wrong-password") {
        text =
          `The ${account.role} demo account exists but the password is incorrect. ` +
          "Check your demo account configuration.";
      } else if (code === "auth/too-many-requests") {
        title = "Too many attempts";
        text =
          "This demo account is temporarily locked due to repeated failures. Try again in a few minutes.";
      } else if (code === "auth/network-request-failed") {
        title = "Network error";
        text =
          "Could not reach Firebase. Check your internet connection and try again.";
      } else if (err?.response?.status >= 500) {
        title = "Server error";
        text = "The backend is unavailable. Please try again later.";
      }

      Swal.fire({
        icon: "error",
        title,
        text,
      });
    } finally {
      setLoadingRole(null);
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
                  Your journey
                  <br />
                  starts here.
                </h2>

                <p className="text-neutral-content/75 text-base xl:text-lg leading-relaxed max-w-lg">
                  Sign in to access your dashboard, manage bookings, and explore
                  premium vehicles across Bangladesh.
                </p>
              </div>

              <ul className="space-y-5">
                {[
                  "Verified cars & trusted riders",
                  "Secure, transparent payments",
                  "Flexible rental durations",
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

          {/* ─── Right Login Panel ──────────────────────────────────── */}
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
              <div className="max-w-md mx-auto">
                <div className="mb-7">
                  <h1 className="text-3xl font-extrabold text-base-content mb-2">
                    Sign in
                  </h1>

                  <p className="text-sm text-base-content/70">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      state={location.state}
                      className="text-primary font-bold hover:underline"
                    >
                      Create one free
                    </Link>
                  </p>
                </div>

                {/* ─── Normal Login Form ───────────────────────────────── */}
                <form
                  onSubmit={handleSubmit(handleSignIn)}
                  className="space-y-4"
                >
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
                        w-full h-12 pl-10 pr-4
                        bg-base-200 border rounded-xl
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
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        className="
                        block text-xs font-semibold
                        text-base-content/80 uppercase tracking-wide
                      "
                      >
                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

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
                        placeholder="Enter your password"
                        className={`
                        w-full h-12 pl-10 pr-4
                        bg-base-200 border rounded-xl
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
                    disabled={isSubmitting || !!loadingRole}
                    className="
                    w-full h-12 bg-primary
                    text-primary-content font-bold
                    rounded-xl text-sm
                    flex items-center justify-center gap-2
                    hover:brightness-95 transition-all
                    shadow-sm hover:shadow-md
                    disabled:opacity-60 mt-2
                  "
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}

                    {!isSubmitting && <FaArrowRight size={12} />}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-base-300" />

                  <span className="text-xs text-base-content/60 font-medium">
                    or
                  </span>

                  <div className="flex-1 h-px bg-base-300" />
                </div>

                {/* Social Login */}
                <SocialLogin type="login" />
              </div>

              {/* ─── Demo Accounts Section ───────────────────────────── */}
              <div className="mt-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-base-300" />

                  <span
                    className="
                      text-[11px] font-bold uppercase
                      tracking-widest text-base-content/65
                      whitespace-nowrap
                    "
                  >
                    Explore with Demo Accounts
                  </span>

                  <div className="flex-1 h-px bg-base-300" />
                </div>

                <p
                  className="
                    text-sm text-base-content/70
                    text-center mb-5 leading-relaxed
                  "
                >
                  Explore Wheelzy with different account roles without creating
                  an account.
                </p>

                {/* Demo Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DEMO_ACCOUNTS.map((account) => (
                    <DemoCard
                      key={account.role}
                      account={account}
                      onLogin={handleDemoLogin}
                      loadingRole={loadingRole}
                    />
                  ))}
                </div>

                {/* Disclaimer */}
                <p
                  className="
                    text-[11px] text-base-content/60
                    text-center mt-4 leading-relaxed
                  "
                >
                  Demo accounts are for testing purposes. Changes may be reset
                  periodically.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
