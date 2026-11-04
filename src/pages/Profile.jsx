import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

import { FaCamera, FaUser, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";

const DEFAULT_AVATAR = "https://i.ibb.co.com/TM9j0Rqd/icon-7797704-640.png";

const Profile = () => {
  const { user, logout, loading, updateUserProfile, refreshUser } = useAuth();

  const axiosSecure = useAxiosSecure();

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Load user information
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-base-content/50">
          You must be logged in to view your profile.
        </p>
      </div>
    );
  }

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Invalid image",
        text: "Please select a valid image file.",
      });

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Image too large",
        text: "Please select an image smaller than 5MB.",
      });

      e.target.value = "";
      return;
    }

    setPhotoFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoURL(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Update profile
  const handleUpdate = async () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      return Swal.fire({
        icon: "warning",
        title: "Name cannot be empty",
      });
    }

    setUpdating(true);

    try {
      let finalPhotoURL = user.photoURL || DEFAULT_AVATAR;

      // Upload new image to ImgBB
      if (photoFile) {
        const formData = new FormData();

        formData.append("image", photoFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          formData,
        );

        finalPhotoURL = imgRes.data.data.url;
      }

      // Update Firebase profile
      await updateUserProfile({
        displayName: trimmedName,
        photoURL: finalPhotoURL,
      });

      // Refresh Firebase user and Context
      await refreshUser();

      // Update MongoDB profile
      await axiosSecure.patch("/users/profile", {
        displayName: trimmedName,
        photoURL: finalPhotoURL,
      });

      // Update local component state
      setDisplayName(trimmedName);
      setPhotoURL(finalPhotoURL);
      setPhotoFile(null);

      Swal.fire({
        icon: "success",
        title: "Profile updated!",
        text: "Your profile information has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Profile update error:", error);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error.response?.data?.message || error.message || "Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-neutral px-8 pt-8 pb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

          <h1 className="text-white font-bold text-xl relative z-10">
            Profile
          </h1>

          <p className="text-neutral-content/50 text-sm relative z-10 mt-0.5">
            Manage your account information
          </p>
        </div>

        {/* Profile Avatar */}
        <div className="flex justify-center -mt-10 mb-4 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-base-100 shadow-lg">
              <img
                referrerPolicy="no-referrer"
                src={photoURL || DEFAULT_AVATAR}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-all shadow-sm">
              <FaCamera size={11} className="text-white" />

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Profile Form */}
        <div className="px-8 pb-8 space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1.5">
              Display Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm" />

              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="Your display name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1.5">
              Email
            </label>

            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full h-11 px-4 bg-base-200 border border-base-300 rounded-xl text-sm text-base-content/50 cursor-not-allowed"
            />

            <p className="text-xs text-base-content/40 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Save Changes */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleUpdate}
            disabled={updating}
            className="w-full h-11 bg-primary text-primary-content font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm disabled:opacity-60 mt-2"
          >
            {updating ? (
              "Updating..."
            ) : (
              <>
                <FaCheckCircle size={13} />
                Save Changes
              </>
            )}
          </motion.button>

          {/* Sign Out */}
          <button
            onClick={logout}
            className="w-full h-11 flex items-center justify-center gap-2 bg-base-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-base-content/60 rounded-xl text-sm font-medium transition-all"
          >
            <FaSignOutAlt size={13} />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
