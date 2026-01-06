import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { FaMapMarkerAlt, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { BsFuelPumpDiesel } from "react-icons/bs";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const CarDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const [isBooking, setIsBooking] = useState(false);
  const [carBooked, setCarBooked] = useState(false);

  const {
    data: car,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/cars/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setCarBooked(data.isBooked);
    },
  });

  console.log(car);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "success" && car?._id && user) {
      const finalizeBooking = async () => {
        setIsBooking(true);
        Swal.fire({
          title: "Confirming Payment...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        try {
          const token = await user.getIdToken();
          const config = { headers: { Authorization: `Bearer ${token}` } };

          // Save payment
          await axiosSecure.post(
            "/payments",
            {
              transactionId: `STRIPE_${Date.now()}`,
              amount: car.rentalFee,
              paymentType: "card",
              carId: car._id,
            },
            config
          );

          // Create rental
          await axiosSecure.post(
            "/rentals",
            {
              carId: car._id,
              carName: car.carName,
              rentalFee: car.rentalFee,
            },
            config
          );

          setCarBooked(true);
          Swal.fire("Success!", "Your car is booked.", "success");
          setSearchParams({});
          refetch();
        } catch (err) {
          Swal.fire("Error", "Booking failed.", "error");
          console.error(err);
        } finally {
          setIsBooking(false);
        }
      };

      finalizeBooking();
    }
  }, [searchParams, car, user, axiosSecure, setSearchParams, refetch]);

  const handlePayment = async () => {
    if (!car?._id) return;
    setIsBooking(true);
    try {
      const { data } = await axiosSecure.post("/create-rental-session", {
        carId: car._id,
      });
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Payment failed",
        "error"
      );
      setIsBooking(false);
    }
  };

  if (isLoading || authLoading) return <Loader />;
  if (!car) return <p className="text-center mt-10">Car not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="shadow rounded overflow-hidden">
        <img
          src={car.bannerImage}
          alt={car.carName}
          className="w-full h-120 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-primary">{car.carName}</h2>
            <span
              className={`px-4 py-1 rounded-full text-white font-bold ${
                car.isBooked ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {car.isBooked ? "Booked" : "Available"}
            </span>
          </div>
          <p className=" mb-6">{car.description}</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <BsFuelPumpDiesel className="text-primary" /> {car.carType}
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> {car.location}
            </div>
            <p className="flex items-center gap-1 font-medium">
              <FaBangladeshiTakaSign className="text-primary text-base" />
              {car.rentalFee ? (
                <>
                  <span>{car.rentalFee}</span>
                  <span className="text-gray-500 text-xs ml-1">/ day</span>
                </>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <FaUser className="text-primary" /> {car.riderName || "Owner"}
            </div>
          </div>
          <button
            onClick={handlePayment}
            disabled={car.isBooked}
            className={`btn w-full md:w-auto px-10 ${
              isBooking || carBooked
                ? "btn-disabled bg-gray-400 text-white "
                : "btn-primary"
            }`}
          >
            {car.isBooked
              ? "Already Booked"
              : isBooking
              ? "Processing..."
              : "Rent Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
