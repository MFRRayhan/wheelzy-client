import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

import {
  FaMapMarkerAlt,
  FaUser,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaExpand,
  FaTimes,
  FaCarSide,
  FaRegCalendarAlt,
} from "react-icons/fa";

import { BsFuelPumpDiesel } from "react-icons/bs";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

// Reusable specification item
const InfoItem = ({ icon, label, value }) => (
  <div className="group flex items-center gap-3 p-4 rounded-2xl bg-base-200/60 border border-base-300/60 hover:border-primary/40 hover:bg-base-200 transition-all duration-300">
    <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg group-hover:bg-primary group-hover:text-primary-content transition-all duration-300">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-[10px] sm:text-xs uppercase tracking-[0.12em] font-semibold text-base-content/45 mb-1">
        {label}
      </p>

      <p className="text-sm font-bold text-base-content truncate">
        {value || "Not specified"}
      </p>
    </div>
  </div>
);

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const CarDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth();

  const [isBooking, setIsBooking] = useState(false);
  const [carBooked, setCarBooked] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

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

  // Handle successful Stripe payment
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

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          await axiosSecure.post(
            "/payments",
            {
              transactionId: `STRIPE_${Date.now()}`,
              amount: car.rentalFee,
              paymentType: "card",
              carId: car._id,
            },
            config,
          );

          await axiosSecure.post(
            "/rentals",
            {
              carId: car._id,
              carName: car.carName,
              rentalFee: car.rentalFee,
            },
            config,
          );

          setCarBooked(true);

          Swal.fire("Success!", "Your car is booked.", "success");

          setSearchParams({});
          refetch();
        } catch (err) {
          Swal.fire("Error", "Booking failed.", "error");
        } finally {
          setIsBooking(false);
        }
      };

      finalizeBooking();
    }
  }, [searchParams, car, user, axiosSecure, setSearchParams, refetch]);

  // Existing Stripe checkout functionality
  const handlePayment = async () => {
    if (!car?._id) return;

    setIsBooking(true);

    try {
      const { data } = await axiosSecure.post("/create-rental-session", {
        carId: car._id,
      });

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Payment failed",
        "error",
      );

      setIsBooking(false);
    }
  };

  if (isLoading || authLoading) {
    return <Loader />;
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 text-3xl">
            <FaCarSide />
          </div>

          <h2 className="text-xl font-bold text-base-content mb-2">
            Car Not Found
          </h2>

          <p className="text-sm text-base-content/50 mb-6">
            The vehicle you are looking for may no longer be available.
          </p>

          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-content text-sm font-semibold hover:opacity-90 transition-all"
          >
            <FaArrowLeft size={12} />
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = !car.isBooked && !carBooked;

  const formattedPrice = Number(car.rentalFee || 0).toLocaleString("en-US");

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Breadcrumb / Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7"
        >
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 text-sm font-medium text-base-content/50 hover:text-primary transition-colors group"
          >
            <FaArrowLeft
              size={12}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Cars
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="space-y-8"
        >
          {/* Vehicle Hero */}
          <motion.section
            variants={sectionVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
          >
            {/* Image Showcase */}
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-3xl bg-base-200 border border-base-300 group">
                {/* Main Image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden">
                  {car.bannerImage ? (
                    <motion.img
                      src={car.bannerImage}
                      alt={car.carName || "Car"}
                      initial={{ scale: 1.04 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-base-content/30">
                      <FaCarSide size={56} />
                      <span className="text-sm font-medium">
                        Image unavailable
                      </span>
                    </div>
                  )}

                  {/* Image Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                  {/* Availability */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold shadow-lg ${
                        isAvailable
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {isAvailable ? (
                        <FaCheckCircle size={12} />
                      ) : (
                        <FaTimesCircle size={12} />
                      )}

                      {isAvailable ? "Available for Rent" : "Already Booked"}
                    </span>
                  </div>

                  {/* Fullscreen Image Button */}
                  {car.bannerImage && (
                    <button
                      type="button"
                      onClick={() => setIsImageOpen(true)}
                      aria-label="View full size image"
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-xl bg-black/35 text-white backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300"
                    >
                      <FaExpand size={14} />
                    </button>
                  )}

                  {/* Image Bottom Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 pointer-events-none">
                    <p className="text-white/70 text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">
                      Wheelzy Collection
                    </p>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                      {car.carName}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Image Caption */}
              <div className="flex items-center justify-between gap-3 mt-3 px-1">
                <p className="text-xs text-base-content/40">Vehicle overview</p>

                <p className="text-xs text-base-content/40 flex items-center gap-1.5">
                  <FaCheckCircle className="text-primary" />
                  Verified listing status
                </p>
              </div>
            </div>

            {/* Vehicle Summary / Booking Panel */}
            <div className="lg:col-span-4">
              <div className="h-full rounded-3xl border border-base-300 bg-base-100 p-5 sm:p-6 lg:p-7 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-base-content/45">
                    Vehicle Overview
                  </span>

                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content leading-tight tracking-tight">
                  {car.carName}
                </h2>

                <div className="flex items-center gap-2 mt-3 text-sm text-base-content/50">
                  <FaMapMarkerAlt className="text-primary" />
                  <span>{car.location || "Location not specified"}</span>
                </div>

                <div className="my-7 border-t border-base-200" />

                {/* Price */}
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-base-content/45 mb-2">
                    Rental Price
                  </p>

                  <div className="flex items-baseline flex-wrap gap-1.5">
                    {Number(car.rentalFee) > 0 ? (
                      <>
                        <FaBangladeshiTakaSign className="text-primary text-xl" />

                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
                          {formattedPrice}
                        </span>

                        <span className="text-sm text-base-content/45 font-medium">
                          / day
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-primary">
                        Free
                      </span>
                    )}
                  </div>
                </div>

                <div className="my-7 border-t border-base-200" />

                {/* Quick Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-base-content/55">
                      <BsFuelPumpDiesel className="text-primary" />
                      Vehicle Type
                    </span>

                    <span className="text-sm font-semibold text-base-content">
                      {car.carType || "General"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-base-content/55">
                      <FaUser className="text-primary" />
                      Listed By
                    </span>

                    <span className="text-sm font-semibold text-base-content truncate max-w-[130px]">
                      {car.riderName || "Owner"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-base-content/55">
                      <FaMapMarkerAlt className="text-primary" />
                      Location
                    </span>

                    <span className="text-sm font-semibold text-base-content truncate max-w-[130px]">
                      {car.location || "Not specified"}
                    </span>
                  </div>
                </div>

                {/* Booking CTA */}
                <div className="mt-8">
                  <motion.button
                    whileHover={isAvailable && !isBooking ? { y: -2 } : {}}
                    whileTap={isAvailable && !isBooking ? { scale: 0.98 } : {}}
                    onClick={handlePayment}
                    disabled={!isAvailable || isBooking}
                    className={`w-full flex items-center justify-center gap-3 py-4 px-5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                      isAvailable && !isBooking
                        ? "bg-primary text-primary-content shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                        : "bg-base-300 text-base-content/40 cursor-not-allowed"
                    }`}
                  >
                    {isBooking
                      ? "Processing..."
                      : isAvailable
                        ? "Rent This Car"
                        : "Already Booked"}

                    {isAvailable && !isBooking && <FaArrowRight size={13} />}
                  </motion.button>

                  <p className="text-center text-[11px] text-base-content/40 mt-3">
                    Secure checkout via Stripe
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Vehicle Description */}
          {car.description && (
            <motion.section
              variants={sectionVariants}
              className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 lg:p-9"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FaCarSide size={17} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-base-content/40 font-bold">
                    Discover the Vehicle
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                    About This Car
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-base-content/65 leading-8 max-w-4xl whitespace-pre-line">
                {car.description}
              </p>
            </motion.section>
          )}

          {/* Specifications */}
          <motion.section variants={sectionVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-primary font-bold mb-2">
                  Vehicle Information
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                  Vehicle Specifications
                </h2>

                <p className="text-sm text-base-content/50 mt-2">
                  Essential information about this vehicle.
                </p>
              </div>

              <span className="text-xs font-medium text-base-content/40">
                {car.carType || "General Vehicle"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              <InfoItem
                icon={<BsFuelPumpDiesel />}
                label="Vehicle Type"
                value={car.carType || "General"}
              />

              <InfoItem
                icon={<FaMapMarkerAlt />}
                label="Location"
                value={car.location}
              />

              <InfoItem
                icon={<FaBangladeshiTakaSign />}
                label="Rental Fee"
                value={
                  Number(car.rentalFee) > 0
                    ? `৳ ${formattedPrice} / day`
                    : "Free"
                }
              />

              <InfoItem
                icon={<FaUser />}
                label="Listed By"
                value={car.riderName || "Owner"}
              />

              <InfoItem
                icon={isAvailable ? <FaCheckCircle /> : <FaTimesCircle />}
                label="Availability"
                value={isAvailable ? "Available" : "Booked"}
              />

              <InfoItem
                icon={<FaRegCalendarAlt />}
                label="Rental Type"
                value="Daily"
              />
            </div>
          </motion.section>

          {/* Final Booking CTA */}
          <motion.section
            variants={sectionVariants}
            className="relative overflow-hidden rounded-3xl bg-neutral text-neutral-content p-7 sm:p-10 lg:p-12"
          >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-7">
              <div className="max-w-xl">
                <p className="text-primary text-xs uppercase tracking-[0.18em] font-bold mb-3">
                  Your Journey Starts Here
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  Ready to experience this ride?
                </h2>

                <p className="text-sm text-neutral-content/60 mt-3 leading-relaxed">
                  Explore your rental options and book this vehicle through
                  Wheelzy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                <div>
                  <p className="text-xs text-neutral-content/50 mb-1">
                    Starting from
                  </p>

                  <p className="text-2xl font-extrabold text-white">
                    {Number(car.rentalFee) > 0 ? `৳ ${formattedPrice}` : "Free"}
                    <span className="text-xs font-medium text-neutral-content/50 ml-1">
                      / day
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={!isAvailable || isBooking}
                  className={`inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isAvailable && !isBooking
                      ? "bg-primary text-primary-content hover:opacity-90 hover:-translate-y-0.5"
                      : "bg-base-300 text-base-content/40 cursor-not-allowed"
                  }`}
                >
                  {isBooking
                    ? "Processing..."
                    : isAvailable
                      ? "Book Now"
                      : "Already Booked"}

                  {isAvailable && !isBooking && <FaArrowRight size={13} />}
                </button>
              </div>
            </div>

            {/* Decorative Brand Element */}
            <div className="absolute -right-16 -bottom-28 w-72 h-72 rounded-full border border-primary/10 pointer-events-none" />

            <div className="absolute -right-8 -bottom-20 w-52 h-52 rounded-full border border-primary/10 pointer-events-none" />
          </motion.section>
        </motion.div>
      </div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {isImageOpen && car.bannerImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsImageOpen(false)}
          >
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsImageOpen(false)}
              aria-label="Close image viewer"
              className="absolute top-5 right-5 sm:top-8 sm:right-8 w-11 h-11 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-primary hover:text-primary-content transition-all z-10"
            >
              <FaTimes size={17} />
            </motion.button>

            <motion.img
              src={car.bannerImage}
              alt={car.carName || "Car"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarDetails;
