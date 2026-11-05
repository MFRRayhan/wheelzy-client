import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

import {
  FaCarSide,
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
  FaHourglassHalf,
  FaSyncAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

import Loader from "../../components/Loader";

const BRAND = "#0F766E";

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  return `৳ ${value.toLocaleString("en-BD")}`;
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// Image with fallback
const CarImage = ({ src, name, className = "" }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-base-200 ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name || "Car"}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <FaCarSide className="text-base-content/25" size={22} />
      )}
    </div>
  );
};

// Summary card
const SummaryCard = ({ title, value, description, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
    >
      <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold tracking-tight text-base-content">
            {value}
          </h3>

          <p className="mt-1 text-xs text-base-content/45">{description}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
};

// Action button
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}) => {
  const styles = {
    default:
      "bg-base-200 text-base-content/60 hover:bg-primary hover:text-white",
    success:
      "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white",
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]}`}
    >
      <Icon size={13} />
    </button>
  );
};

// Detail item
const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-base-300 bg-base-200/50 p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={13} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-base-content">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
};

// Car details modal
const CarDetailsModal = ({
  car,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}) => {
  if (!car) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="car-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-base-300 bg-base-100 shadow-2xl"
        >
          {/* Modal header image */}
          <div className="relative h-56 bg-base-200 sm:h-64">
            <CarImage
              src={car.bannerImage}
              name={car.carName}
              className="h-full w-full"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
              aria-label="Close modal"
            >
              <FaTimes size={14} />
            </button>

            <div className="absolute bottom-5 left-5 right-5">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-100 backdrop-blur-md">
                <FaClock size={10} />
                Awaiting approval
              </div>

              <h3 className="text-2xl font-bold text-white">
                {car.carName || "Unnamed vehicle"}
              </h3>

              <p className="mt-1 text-sm text-white/70">
                {car.carType || "Vehicle listing"}
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {/* Rental information */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                icon={FaCarSide}
                label="Vehicle Type"
                value={car.carType}
              />

              <DetailItem
                icon={FaMapMarkerAlt}
                label="Location"
                value={car.location}
              />

              <DetailItem
                icon={FaMoneyBillWave}
                label="Rental Fee"
                value={`${formatCurrency(car.rentalFee)} / day`}
              />

              <DetailItem
                icon={FaCalendarAlt}
                label="Date Added"
                value={formatDate(car.createdAt)}
              />
            </div>

            {/* Rider information */}
            <div className="rounded-2xl border border-base-300 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FaEnvelope size={13} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-base-content">
                    Rider Information
                  </p>

                  <p className="text-[10px] text-base-content/40">
                    Listing owner
                  </p>
                </div>
              </div>

              <p className="break-all text-sm font-medium text-base-content/70">
                {car.riderEmail || "Not available"}
              </p>
            </div>

            {/* Description */}
            {car.description && (
              <div className="rounded-2xl border border-base-300 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-base-content/40">
                  Vehicle Description
                </p>

                <p className="text-sm leading-7 text-base-content/70">
                  {car.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 border-t border-base-300 pt-5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={onReject}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                <FaTimes size={13} />
                Reject
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={onApprove}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-content shadow-lg shadow-primary/20 transition hover:brightness-110 disabled:opacity-50"
              >
                <FaCheck size={13} />
                Approve Listing
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const WaitingForApproval = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch pending cars
  const {
    data: pendingCars = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["pending-cars"],
    queryFn: async () => {
      const res = await axiosSecure.get("/cars?status=pending");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Update car status
  const statusMutation = useMutation({
    mutationFn: async ({ carId, status }) => {
      return axiosSecure.patch(`/cars/${carId}/status`, { status });
    },

    onSuccess: async (_, variables) => {
      const { status } = variables;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pending-cars"] }),
        queryClient.invalidateQueries({ queryKey: ["cars"] }),
      ]);

      setSelectedItem(null);

      Swal.fire({
        icon: "success",
        title: status === "approved" ? "Car Approved!" : "Car Rejected!",
        text:
          status === "approved"
            ? "The car listing is now approved."
            : "The car listing has been rejected.",
        timer: 1600,
        showConfirmButton: false,
      });
    },

    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: BRAND,
      });
    },
  });

  const filteredCars = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) return pendingCars;

    return pendingCars.filter((car) => {
      const carName = car.carName || "";
      const riderEmail = car.riderEmail || "";
      const carType = car.carType || "";
      const location = car.location || "";

      return (
        carName.toLowerCase().includes(search) ||
        riderEmail.toLowerCase().includes(search) ||
        carType.toLowerCase().includes(search) ||
        location.toLowerCase().includes(search)
      );
    });
  }, [pendingCars, searchText]);

  const handleUpdateStatus = async (car, status) => {
    if (!car?._id || statusMutation.isPending) return;

    const isApproving = status === "approved";

    const result = await Swal.fire({
      icon: isApproving ? "question" : "warning",
      title: isApproving ? "Approve this listing?" : "Reject this listing?",
      text: isApproving
        ? `Approve ${car.carName || "this car"} and make it available?`
        : `Are you sure you want to reject ${car.carName || "this car"}?`,
      showCancelButton: true,
      confirmButtonText: isApproving ? "Yes, approve" : "Yes, reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: isApproving ? BRAND : "#DC2626",
      cancelButtonColor: "#64748B",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    statusMutation.mutate({
      carId: car._id,
      status,
    });
  };

  if (isLoading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Pending Car Approval
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-base-content/50">
            Review vehicle submissions and approve or reject listings before
            they become available on Wheelzy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-4 text-sm font-semibold text-base-content/70 shadow-sm transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
        >
          <FaSyncAlt className={isFetching ? "animate-spin" : ""} size={13} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard
          title="Pending Submissions"
          value={pendingCars.length}
          description="Total listings awaiting review"
          icon={FaHourglassHalf}
        />

        <SummaryCard
          title="Search Results"
          value={filteredCars.length}
          description="Listings matching your search"
          icon={FaSearch}
        />
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-base-300 p-4 sm:p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-base font-bold text-base-content">
              Approval Queue
            </h2>

            <p className="mt-1 text-xs text-base-content/45">
              Review each vehicle submission carefully.
            </p>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <FaSearch
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35"
              size={13}
            />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search car, rider, location..."
              className="h-11 w-full rounded-xl border border-base-300 bg-base-200/50 pl-10 pr-10 text-sm text-base-content outline-none transition placeholder:text-base-content/35 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition hover:text-error"
                aria-label="Clear search"
              >
                <FaTimes size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Error state */}
        {isError ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <FaExclamationTriangle size={23} />
            </div>

            <h3 className="font-bold text-base-content">
              Unable to load pending cars
            </h3>

            <p className="mt-2 max-w-sm text-sm text-base-content/50">
              {error?.response?.data?.message ||
                "Something went wrong while fetching the approval queue."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-content transition hover:brightness-110"
            >
              <FaSyncAlt size={12} />
              Try Again
            </button>
          </div>
        ) : filteredCars.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              {searchText ? (
                <FaSearch size={27} />
              ) : (
                <FaCheckCircle size={30} />
              )}
            </div>

            <h3 className="text-lg font-bold text-base-content">
              {searchText ? "No matching listings" : "All caught up!"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/45">
              {searchText
                ? "No pending cars match your search. Try another keyword."
                : "There are currently no vehicle listings waiting for approval."}
            </p>

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="mt-4 text-sm font-bold text-primary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="premium-table w-full min-w-[850px]">
                <thead>
                  <tr>
                    <th className="w-14">#</th>
                    <th>Vehicle</th>
                    <th>Rider Email</th>
                    <th>Location</th>
                    <th>Date Added</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredCars.map((car, index) => (
                      <motion.tr
                        key={car._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="font-medium text-base-content/35">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        {/* Vehicle */}
                        <td>
                          <div className="flex items-center gap-3">
                            <CarImage
                              src={car.bannerImage}
                              name={car.carName}
                              className="h-12 w-16 shrink-0 rounded-xl"
                            />

                            <div className="min-w-0">
                              <p className="max-w-[190px] truncate text-sm font-bold text-base-content">
                                {car.carName || "Unnamed vehicle"}
                              </p>

                              <p className="mt-1 text-xs text-base-content/45">
                                {car.carType || "Vehicle"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Rider */}
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/45">
                              <FaEnvelope size={11} />
                            </div>

                            <span className="max-w-[190px] truncate text-xs font-medium text-base-content/65">
                              {car.riderEmail || "Not available"}
                            </span>
                          </div>
                        </td>

                        {/* Location */}
                        <td>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/60">
                            <FaMapMarkerAlt
                              className="shrink-0 text-primary/60"
                              size={11}
                            />

                            <span className="max-w-[130px] truncate">
                              {car.location || "Not available"}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                            <FaCalendarAlt size={11} />
                            {formatDate(car.createdAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <ActionButton
                              icon={FaEye}
                              label="View details"
                              onClick={() => setSelectedItem(car)}
                              disabled={statusMutation.isPending}
                            />

                            <ActionButton
                              icon={FaCheck}
                              label="Approve listing"
                              variant="success"
                              onClick={() =>
                                handleUpdateStatus(car, "approved")
                              }
                              disabled={statusMutation.isPending}
                            />

                            <ActionButton
                              icon={FaTimes}
                              label="Reject listing"
                              variant="danger"
                              onClick={() =>
                                handleUpdateStatus(car, "rejected")
                              }
                              disabled={statusMutation.isPending}
                            />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex flex-col justify-between gap-2 border-t border-base-300 px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-base-content/45">
                Showing{" "}
                <span className="font-bold text-base-content">
                  {filteredCars.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-base-content">
                  {pendingCars.length}
                </span>{" "}
                pending listings
              </p>

              <div className="flex items-center gap-2 text-xs text-amber-600">
                <FaClock size={11} />
                Requires admin review
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details modal */}
      {selectedItem && (
        <CarDetailsModal
          car={selectedItem}
          onClose={() => {
            if (!statusMutation.isPending) setSelectedItem(null);
          }}
          onApprove={() => handleUpdateStatus(selectedItem, "approved")}
          onReject={() => handleUpdateStatus(selectedItem, "rejected")}
          isProcessing={statusMutation.isPending}
        />
      )}
    </div>
  );
};

export default WaitingForApproval;
