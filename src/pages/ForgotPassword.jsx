import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import Logo from "../components/Logo";
import { FaEnvelope, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ForgotPassword = () => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  if (loading) return <Loader />;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return Swal.fire({ icon: "warning", title: "Email required" });
    }
    setSending(true);
    try {
      await resetPassword(email);
      Swal.fire({
        icon: "success",
        title: "Reset link sent!",
        text: "Check your email for the password reset link.",
        confirmButtonText: "Back to Login",
        confirmButtonColor: "#e85d04",
      }).then((r) => {
        if (r.isConfirmed) navigate("/login");
      });
      setEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to send",
        text: error?.message || "Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-base-100 rounded-3xl shadow-sm border border-base-300 p-8"
      >
        <div className="mb-8">
          <Logo size="sm" />
        </div>

        <h1 className="text-2xl font-extrabold text-base-content mb-2">
          Forgot your password?
        </h1>
        <p className="text-sm text-base-content/50 mb-8 leading-relaxed">
          Enter your registered email address and we'll send you a secure
          password reset link.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={sending}
            className="w-full h-11 bg-primary text-primary-content font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Reset Link"}
            {!sending && <FaArrowRight size={12} />}
          </motion.button>
        </form>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 mt-5 text-sm text-base-content/50 hover:text-primary transition-colors"
        >
          <FaArrowLeft size={11} />
          Back to Sign In
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
