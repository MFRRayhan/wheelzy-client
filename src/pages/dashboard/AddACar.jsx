import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { imgUpload } from "../../utils";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddACar = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [carStatus, setCarStatus] = useState("pending");

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
        status: carStatus,
        isBooked: false,
        riderEmail: user?.email,
        riderName: user?.displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/cars", carInfo);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Car Submitted!",
          text: "Your car is awaiting admin approval.",
          icon: "success",
          confirmButtonText: "OK",
        });
        reset();
        setCarStatus("pending");
      } else {
        Swal.fire({
          title: "Submission Failed!",
          text: "Please try again.",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Error creating car:", err);
      Swal.fire({
        title: "Something went wrong!",
        text: "Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex">
      {/* Fullscreen Image */}
      <div className="absolute inset-0">
        <img
          src="https://i.ibb.co/VYqrpmGn/pexels-photo-17507722.jpg"
          alt="Car Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Form */}
      <div className="relative z-10 flex-1 flex justify-center items-center p-6">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-8">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Add a New Car
          </h2>

          <form onSubmit={handleSubmit(handleCarForm)} className="space-y-4">
            {/* Car Name */}
            <div>
              <label className="label">Car Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Enter car name"
                {...register("carName", { required: true })}
              />
              {errors.carName && (
                <p className="text-red-500 text-sm mt-1">
                  Car name is required.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                className="textarea w-full"
                placeholder="Write a short description"
                {...register("description", { required: true })}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  Description is required.
                </p>
              )}
            </div>

            {/* Car Type */}
            <div>
              <label className="label">Car Type</label>
              <select
                className="select w-full"
                defaultValue="Pick a Type"
                {...register("carType", { required: true })}
              >
                <option disabled>Pick a Type</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Hatchback</option>
                <option>Luxury</option>
                <option>Electric</option>
                <option>Other</option>
              </select>
              {errors.carType && (
                <p className="text-red-500 text-sm mt-1">
                  Car type is required.
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                className="input w-full"
                placeholder="City/Area"
                {...register("location", { required: true })}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  Location is required.
                </p>
              )}
            </div>

            {/* Rental Fee */}
            <div>
              <label className="label">Rental Fee (BDT)</label>
              <input
                type="number"
                className="input w-full"
                placeholder="Enter rental fee"
                {...register("rentalFee", { required: true })}
              />
              {errors.rentalFee && (
                <p className="text-red-500 text-sm mt-1">
                  Rental fee is required.
                </p>
              )}
            </div>

            {/* Banner Image */}
            <div>
              <label className="label">Car Banner</label>
              <input
                type="file"
                className="file-input w-full"
                {...register("bannerImage", { required: true })}
              />
              {errors.bannerImage && (
                <p className="text-red-500 text-sm mt-1">
                  Banner image is required.
                </p>
              )}
            </div>

            <button className="btn btn-primary mt-4 w-full" disabled={loading}>
              {loading ? "Adding Car..." : "Add Car"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddACar;
