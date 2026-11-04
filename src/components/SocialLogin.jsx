import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";

const SocialLogin = ({ type = "register" }) => {
  const { signInWithGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const userInfo = {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      await axiosSecure.post("/users", userInfo);
      navigate(location?.state || "/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google sign-in failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignInWithGoogle}
      disabled={loading}
      className="w-full h-11 flex items-center justify-center gap-3 bg-base-200 border border-base-300 rounded-xl text-sm font-semibold text-base-content hover:bg-base-300 transition-all duration-200 disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="#4285f4"
          d="M386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
        />
        <path
          fill="#34a853"
          d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
        />
        <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
        <path
          fill="#ea4335"
          d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
        />
      </svg>
      {loading
        ? "Signing in..."
        : type === "register"
          ? "Continue with Google"
          : "Sign in with Google"}
    </button>
  );
};

export default SocialLogin;
