import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import SocialLogin from "../components/SocialLogin";
import useAxiosSecure from "../hooks/useAxiosSecure";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const { registerUser, updateUserProfile, user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleRegistration = async (data) => {
    const from = location.state?.from?.pathname || "/";
    try {
      const profileImg = data.photo[0];
      if (!profileImg) throw new Error("Profile image is required");

      // Firebase Email/Password Registration
      const userCredential = await registerUser(data.email, data.password);

      // Upload image to imgbb
      const formData = new FormData();
      formData.append("image", profileImg);

      const img_API_URL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_host_key
      }`;
      const imgRes = await axios.post(img_API_URL, formData);
      const photoURL = imgRes.data.data.url;

      // Save user info in backend DB
      const userInfo = {
        email: data.email,
        displayName: data.name,
        photoURL,
      };
      const dbRes = await axiosSecure.post("/users", userInfo);

      if (dbRes.data.modifiedCount > 0) {
        console.log("User lastLoggedIn updated");
      } else if (dbRes.data.insertedId) {
        console.log("User inserted in DB");
      } else {
        console.warn("No changes in DB");
      }

      // Update Firebase profile
      await updateUserProfile({ displayName: data.name, photoURL });

      // Reset form and navigate
      reset();
      navigate(from, { replace: true });

      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created successfully!",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Registration error:", err);

      // SweetAlert error
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message || "Something went wrong. Please try again!",
      });
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        <h2 className="text-3xl font-bold text-primary mb-3 text-center">
          Create an Account
        </h2>
        <p className="text-gray-500 text-center mb-5">Register with wheelzy</p>

        <form onSubmit={handleSubmit(handleRegistration)}>
          <fieldset className="space-y-4">
            {/* Name */}
            <div className="form-control w-full">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Photo */}
            <div className="form-control w-full">
              <label className="label">Photo</label>
              <input
                type="file"
                className="file-input w-full"
                {...register("photo", { required: "Photo is required" })}
              />
              {errors.photo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photo.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Your Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label">Password</label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message:
                      "Password must have uppercase, lowercase, number & special character",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button className="btn btn-primary w-full mt-3">Register</button>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                state={location.state}
                className="text-primary font-semibold"
              >
                Login
              </Link>
            </p>
          </fieldset>
        </form>

        <div className="divider">OR</div>
        <SocialLogin type="register" />
      </div>
    </div>
  );
};

export default Register;
