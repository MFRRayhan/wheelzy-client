import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Profile = () => {
  const { user, logout, loading, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  // 🔑 Sync Firebase user after reload
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "user name");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">You must be logged in to view your profile.</p>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);

    // Preview image
    const reader = new FileReader();
    reader.onload = () => setPhotoURL(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!displayName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Name",
        text: "Display name cannot be empty.",
      });
    }

    setUpdating(true);

    try {
      let finalPhotoURL = photoURL;

      // Upload image if changed
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_image_host_key
          }`,
          formData
        );

        finalPhotoURL = imgRes.data.data.url;
      }

      // 🔥 Update Firebase Profile
      await updateUserProfile({
        displayName,
        photoURL: finalPhotoURL,
      });

      // 🔥 Update Backend Profile
      const token = await user.getIdToken();
      await axiosSecure.patch(
        "/users/profile",
        { displayName, photoURL: finalPhotoURL },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-6 rounded-lg shadow-md space-y-5">
      <div className="flex flex-col items-center space-y-4">
        <img
          referrerPolicy="no-referrer"
          src={photoURL || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div className="form-control w-full">
          <label className="label font-medium">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Your full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="form-control w-full">
          <label className="label font-medium">Profile Photo</label>
          <input
            type="file"
            className="file-input w-full"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="btn btn-primary w-full"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>

        <button onClick={logout} className="btn btn-neutral text-white w-full">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
