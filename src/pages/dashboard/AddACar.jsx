import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { imgUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";

import {
  FaCarAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaArrowRight,
  FaCheckCircle,
  FaImage,
  FaInfoCircle,
  FaCloudUploadAlt,
  FaShieldAlt,
  FaClock,
  FaTimes,
} from "react-icons/fa";

import { FaBangladeshiTakaSign } from "react-icons/fa6";

const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Electric", "Other"];

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-base-content/70 uppercase tracking-wider mb-2">
    {children}
    {required && <span className="text-primary ml-1">*</span>}
  </label>
);

const inputClass = (hasError) =>
  `w-full h-12 px-4 bg-base-200 border rounded-xl text-sm text-base-content placeholder:text-base-content/35 outline-none transition-all focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
    hasError ? "border-primary" : "border-base-300"
  }`;

const AddACar = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      carName: "",
      description: "",
      carType: "",
      location: "",
      rentalFee: "",
      bannerImage: null,
    },
  });

  // Watch selected image for preview
  const bannerFile = useWatch({
    control,
    name: "bannerImage",
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const file = bannerFile?.[0];

    if (!file) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [bannerFile]);

  const handleCarForm = async (data) => {
    try {
      setLoading(true);

      const bannerFile = data.bannerImage?.[0];

      if (!bannerFile) {
        throw new Error("Please select a car photo.");
      }

      const imgUrl = await imgUpload(bannerFile);

      const currentTime = new Date().toISOString();

      const carInfo = {
        carName: data.carName.trim(),
        description: data.description.trim(),
        carType: data.carType,
        location: data.location.trim(),
        rentalFee: Number(data.rentalFee),
        bannerImage: imgUrl,
        status: "pending",
        isBooked: false,
        riderEmail: user?.email,
        riderName: user?.displayName,
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      const res = await axiosSecure.post("/cars", carInfo);

      if (res.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Listing submitted!",
          text: "Your vehicle is now waiting for admin approval.",
          confirmButtonText: "Great!",
          confirmButtonColor: "#0F766E",
        });

        reset();
      } else {
        throw new Error("Car submission failed.");
      }
    } catch (err) {
      console.error("Car submission error:", err);

      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: err.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#0F766E",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7 pb-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="w-7 h-[2px] bg-primary rounded-full" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Vehicle Management
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
            List Your Car
          </h1>

          <p className="text-sm text-base-content/50 mt-2 max-w-lg">
            Add your vehicle details and make it available for people looking
            for their next ride.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/15">
          <FaShieldAlt className="text-primary" size={14} />
          <span className="text-xs font-semibold text-primary">
            Admin Verified Listing
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6 items-start">
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="relative overflow-hidden bg-neutral px-5 sm:px-7 py-6">
            <div className="absolute -right-12 -top-20 w-52 h-52 rounded-full border-[30px] border-primary/10" />
            <div className="absolute right-16 -bottom-20 w-36 h-36 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-primary/20 flex items-center justify-center">
                <FaCarAlt className="text-primary" size={21} />
              </div>

              <div>
                <h2 className="text-white font-bold text-lg">
                  New Car Listing
                </h2>
                <p className="text-neutral-content/55 text-xs mt-1">
                  Complete the information below to submit your vehicle.
                </p>
              </div>
            </div>

            <div className="relative flex items-center gap-2 mt-5">
              <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold">
                <FaCheckCircle />
                Listing information
              </div>

              <div className="h-px flex-1 bg-white/10" />

              <span className="text-[11px] text-neutral-content/45">
                Step 01 / 01
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleCarForm)}
            className="p-5 sm:p-7 space-y-7"
          >
            {/* Basic Information */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FaCarAlt className="text-primary" size={14} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-base-content">
                    Vehicle Information
                  </h3>
                  <p className="text-xs text-base-content/45 mt-0.5">
                    Tell us about your vehicle
                  </p>
                </div>
              </div>

              {/* Car Name */}
              <div>
                <FieldLabel required>Car Name</FieldLabel>

                <input
                  type="text"
                  placeholder="e.g. Toyota Corolla 2022"
                  className={inputClass(!!errors.carName)}
                  {...register("carName", {
                    required: "Car name is required",
                    minLength: {
                      value: 3,
                      message: "Car name must be at least 3 characters",
                    },
                  })}
                />

                {errors.carName && (
                  <p className="text-primary text-xs mt-2">
                    {errors.carName.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <FieldLabel required>Description</FieldLabel>

                <textarea
                  rows={4}
                  placeholder="Describe your car's condition, features, model year and other important details..."
                  className={`w-full px-4 py-3 bg-base-200 border rounded-xl text-sm text-base-content placeholder:text-base-content/35 outline-none transition-all focus:bg-base-100 focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none ${
                    errors.description ? "border-primary" : "border-base-300"
                  }`}
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Please write at least 20 characters",
                    },
                  })}
                />

                <div className="flex items-center justify-between mt-2">
                  {errors.description ? (
                    <p className="text-primary text-xs">
                      {errors.description.message}
                    </p>
                  ) : (
                    <p className="text-xs text-base-content/40">
                      Provide accurate information about your vehicle.
                    </p>
                  )}
                </div>
              </div>

              {/* Type + Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Car Type</FieldLabel>

                  <select
                    className={`${inputClass(!!errors.carType)} appearance-none cursor-pointer`}
                    {...register("carType", {
                      required: "Please select a car type",
                    })}
                  >
                    <option value="" disabled>
                      Select vehicle type
                    </option>

                    {carTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {errors.carType && (
                    <p className="text-primary text-xs mt-2">
                      {errors.carType.message}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel required>Location</FieldLabel>

                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/70 text-sm pointer-events-none" />

                    <input
                      type="text"
                      placeholder="City / Area"
                      className={`${inputClass(!!errors.location)} pl-10`}
                      {...register("location", {
                        required: "Location is required",
                      })}
                    />
                  </div>

                  {errors.location && (
                    <p className="text-primary text-xs mt-2">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="h-px bg-base-300" />

            {/* Rental Information */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FaBangladeshiTakaSign className="text-primary" size={15} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-base-content">
                    Rental Pricing
                  </h3>
                  <p className="text-xs text-base-content/45 mt-0.5">
                    Set your daily rental price
                  </p>
                </div>
              </div>

              <div>
                <FieldLabel required>Rental Fee (BDT per day)</FieldLabel>

                <div className="relative">
                  <FaBangladeshiTakaSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-sm pointer-events-none" />

                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    min="0"
                    step="1"
                    className={`${inputClass(!!errors.rentalFee)} pl-10 pr-20`}
                    {...register("rentalFee", {
                      required: "Rental fee is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Rental fee cannot be negative",
                      },
                      validate: (value) =>
                        Number.isFinite(value) ||
                        "Please enter a valid rental fee",
                    })}
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-base-content/40">
                    / DAY
                  </span>
                </div>

                {errors.rentalFee && (
                  <p className="text-primary text-xs mt-2">
                    {errors.rentalFee.message}
                  </p>
                )}

                <p className="text-xs text-base-content/40 mt-2">
                  Set a competitive price to attract more bookings.
                </p>
              </div>
            </section>

            <div className="h-px bg-base-300" />

            {/* Image Upload */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FaImage className="text-primary" size={15} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-base-content">
                    Vehicle Photo
                  </h3>
                  <p className="text-xs text-base-content/45 mt-0.5">
                    Upload a clear photo of your vehicle
                  </p>
                </div>
              </div>

              <label
                className={`relative block border-2 border-dashed rounded-2xl overflow-hidden transition-all cursor-pointer group ${
                  errors.bannerImage
                    ? "border-primary"
                    : "border-base-300 hover:border-primary/60"
                }`}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Car preview"
                      className="w-full h-56 sm:h-72 object-cover"
                    />

                    <div className="absolute inset-0 bg-neutral/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-100 text-base-content text-sm font-semibold">
                        <FaCamera className="text-primary" />
                        Change Photo
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-base-100 flex items-center justify-center shadow-sm">
                      <FaCheckCircle className="text-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <FaCloudUploadAlt className="text-primary" size={25} />
                    </div>

                    <p className="text-sm font-bold text-base-content">
                      Click to upload your car photo
                    </p>

                    <p className="text-xs text-base-content/45 mt-2">
                      Choose a clear, high-quality vehicle image
                    </p>

                    <span className="mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      Browse Files
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  {...register("bannerImage", {
                    required: "Please upload a car photo",
                    validate: {
                      fileType: (files) =>
                        !files?.[0] ||
                        ["image/jpeg", "image/png", "image/webp"].includes(
                          files[0].type,
                        ) ||
                        "Only JPG, PNG and WEBP images are allowed",

                      fileSize: (files) =>
                        !files?.[0] ||
                        files[0].size <= 5 * 1024 * 1024 ||
                        "Image size must be less than 5MB",
                    },
                  })}
                />
              </label>

              {errors.bannerImage && (
                <p className="text-primary text-xs">
                  {errors.bannerImage.message}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-base-content/45">
                <span className="flex items-center gap-1.5">
                  <FaInfoCircle className="text-primary" />
                  JPG, PNG or WEBP
                </span>

                <span>Maximum file size: 5MB</span>
              </div>
            </section>

            {/* Submission Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <FaShieldAlt className="text-primary mt-0.5 shrink-0" />

              <div>
                <p className="text-xs font-bold text-base-content">
                  Admin approval required
                </p>

                <p className="text-xs text-base-content/55 mt-1 leading-relaxed">
                  Your listing will remain pending until an administrator
                  reviews and approves your vehicle.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={!loading ? { y: -2 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              type="submit"
              disabled={loading}
              className="w-full min-h-12 px-5 bg-primary text-primary-content rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Uploading & Submitting...
                </>
              ) : (
                <>
                  Submit for Review
                  <FaArrowRight size={13} />
                </>
              )}
            </motion.button>

            <p className="text-center text-[11px] text-base-content/40">
              By submitting, you confirm that the provided vehicle information
              is accurate.
            </p>
          </form>
        </motion.div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Preview Information */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <FaInfoCircle className="text-primary" />
              </div>

              <h3 className="font-bold text-sm text-base-content">
                Listing Guidelines
              </h3>
            </div>

            <div className="space-y-4">
              {[
                "Use the correct vehicle name and model year.",
                "Write an honest and detailed description.",
                "Provide the actual vehicle location.",
                "Upload a clear photo of your car.",
                "Set a reasonable daily rental fee.",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FaCheckCircle className="text-primary" size={10} />
                  </div>

                  <p className="text-xs text-base-content/65 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Approval Process */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <FaClock className="text-primary" />
              </div>

              <h3 className="font-bold text-sm text-base-content">
                Approval Process
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="w-px h-9 bg-base-300" />
                </div>

                <div className="pt-1">
                  <p className="text-xs font-bold text-base-content">
                    Submit Listing
                  </p>
                  <p className="text-[11px] text-base-content/45 mt-1">
                    Provide your vehicle information.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full border border-primary/30 bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="w-px h-9 bg-base-300" />
                </div>

                <div className="pt-1">
                  <p className="text-xs font-bold text-base-content">
                    Admin Review
                  </p>
                  <p className="text-[11px] text-base-content/45 mt-1">
                    Your listing is reviewed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full border border-primary/30 bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>

                <div className="pt-1">
                  <p className="text-xs font-bold text-base-content">Go Live</p>
                  <p className="text-[11px] text-base-content/45 mt-1">
                    Approved cars become available for booking.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Support Note */}
          <div className="rounded-2xl bg-primary/5 border border-primary/15 p-5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <FaInfoCircle size={14} />
              <p className="text-xs font-bold">Need Help?</p>
            </div>

            <p className="text-xs text-base-content/55 leading-relaxed">
              Make sure all vehicle details are accurate before submitting.
              Complete information helps speed up the review process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddACar;
