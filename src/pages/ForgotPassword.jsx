import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";

const ForgotPassword = () => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  if (loading) return <Loader />;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your registered email address.",
      });
    }

    setSending(true);

    try {
      await resetPassword(email);

      Swal.fire({
        icon: "success",
        title: "Reset Link Sent",
        text: "A password reset link has been sent to your email address.",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });

      setEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text:
          error?.message ||
          "Unable to send reset email. Please try again later.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email address and we will send you a password
          reset link.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="form-control">
            <label className="label font-medium">Email Address</label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="btn btn-primary w-full"
          >
            {sending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
