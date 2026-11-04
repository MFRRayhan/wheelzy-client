import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { imgUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FaCarAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaArrowRight,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const carTypes = ["Sedan", "SUV", "Hatchback", "Luxury", "Electric", "Other"];

const FieldLabel = ({ children }) => (
  <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1.5">
    {children}
  </label>
);

const AddACar = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCarForm = async (data) => {
    try {
      setLoading(true);
      const bannerFile = data.bannerImage[0];
      const imgUrl = await imgUpload(bannerFile);

      const carInfo = {
        carName: data.carName,
        description: data.description,
        carType: data.carType,
        location: data.location,
        rentalFee: Number(data.rentalFee),
        bannerImage: imgUrl,
        status: "pending",
        isBooked: false,
        riderEmail: user?.email,
        riderName: user?.displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/cars", carInfo);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Car submitted!",
          text: "Your listing is awaiting admin approval.",
          timer: 2500,
          showConfirmButton: false,
        });
        reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission failed",
          text: "Please try again.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-base-content">List a Car</h2>
        <p className="text-sm text-base-content/50 mt-0.5">
          Submit your vehicle for admin review and start earning.
        </p>
      </div>

      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden"
        >
          <div className="bg-neutral px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <FaCarAlt className="text-primary" size={18} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">New Car Listing</p>
                <p className="text-neutral-content/50 text-xs">
                  Your listing will be reviewed within 24 hours
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleCarForm)}
            className="p-6 space-y-5"
          >
            {/* Car Name */}
            <div>
              <FieldLabel>Car Name</FieldLabel>
              <input
                type="text"
                placeholder="e.g. Toyota Corolla 2022"
                className={`w-full h-11 px-4 bg-base-200 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.carName ? "border-red-400" : "border-base-300"}`}
                {...register("carName", { required: "Car name is required" })}
              />
              {errors.carName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.carName.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                placeholder="Describe your car — condition, features, any special notes..."
                rows={4}
                className={`w-full px-4 py-3 bg-base-200 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none ${errors.description ? "border-red-400" : "border-base-300"}`}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Car Type + Location row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Car Type</FieldLabel>
                <select
                  defaultValue=""
                  className={`w-full h-11 px-4 bg-base-200 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none ${errors.carType ? "border-red-400" : "border-base-300"}`}
                  {...register("carType", { required: "Car type is required" })}
                >
                  <option value="" disabled>
                    Select type...
                  </option>
                  {carTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                {errors.carType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.carType.message}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel>Location</FieldLabel>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                  <input
                    type="text"
                    placeholder="City / Area"
                    className={`w-full h-11 pl-10 pr-4 bg-base-200 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.location ? "border-red-400" : "border-base-300"}`}
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Rental Fee */}
            <div>
              <FieldLabel>Rental Fee (BDT per day)</FieldLabel>
              <div className="relative">
                <FaBangladeshiTakaSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  min={0}
                  className={`w-full h-11 pl-10 pr-4 bg-base-200 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.rentalFee ? "border-red-400" : "border-base-300"}`}
                  {...register("rentalFee", {
                    required: "Rental fee is required",
                  })}
                />
              </div>
              {errors.rentalFee && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rentalFee.message}
                </p>
              )}
            </div>

            {/* Banner Image */}
            <div>
              <FieldLabel>Car Photo</FieldLabel>
              <div className="relative">
                <FaCamera className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
                <input
                  type="file"
                  accept="image/*"
                  className={`w-full h-11 pl-10 pr-4 bg-base-200 border rounded-xl text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.bannerImage ? "border-red-400" : "border-base-300"}`}
                  {...register("bannerImage", {
                    required: "Car photo is required",
                  })}
                />
              </div>
              {errors.bannerImage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bannerImage.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-primary-content font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm disabled:opacity-60 mt-2"
            >
              {loading ? "Submitting..." : "Submit for Review"}
              {!loading && <FaArrowRight size={12} />}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddACar;
