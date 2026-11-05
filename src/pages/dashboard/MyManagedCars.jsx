import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaCar,
  FaCarSide,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaMapMarkerAlt,
  FaRedo,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaListAlt,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Swal from "sweetalert2";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const ITEMS_PER_PAGE = 10;

const statusConfig = {
  approved: {
    label: "Approved",
    icon: FaCheckCircle,
  },
  pending: {
    label: "Pending",
    icon: FaClock,
  },
  rejected: {
    label: "Rejected",
    icon: FaBan,
  },
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  return value.toLocaleString("en-BD");
};

const SummaryCard = ({ title, count, icon: Icon, description }) => (
  <div className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/5" />

    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-base-content/50">{title}</p>

        <p className="mt-2 text-2xl font-bold tracking-tight text-base-content">
          {count}
        </p>

        <p className="mt-1 text-[11px] text-base-content/40">{description}</p>
      </div>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={17} />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();
  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    icon: FaListAlt,
  };

  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-base-200 border border-base-300 text-base-content/70 text-[11px] font-semibold capitalize whitespace-nowrap">
      <Icon size={11} />
      {config.label}
    </span>
  );
};

const ActionButton = ({ icon: Icon, label, onClick, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className="w-9 h-9 rounded-xl flex items-center justify-center bg-base-200 border border-base-300 text-base-content/60 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    <Icon size={13} />
  </button>
);

const ModalOverlay = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    {children}
  </motion.div>
);

const MyManagedCars = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [mode, setMode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    carName: "",
    description: "",
    location: "",
    rentalFee: "",
    carType: "",
  });

  // Fetch managed cars
  const {
    data: cars = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my-managed-cars", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/my-cars");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Filter cars
  const safeCars = useMemo(
    () => cars.filter((car) => car && car._id && car.carName),
    [cars],
  );

  const filteredCars = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return safeCars;

    return safeCars.filter((car) =>
      [car.carName, car.carType, car.location, car.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [safeCars, search]);

  // Summary statistics
  const stats = useMemo(
    () => ({
      total: safeCars.length,
      approved: safeCars.filter(
        (car) => car.status?.toLowerCase() === "approved",
      ).length,
      pending: safeCars.filter((car) => car.status?.toLowerCase() === "pending")
        .length,
      rejected: safeCars.filter(
        (car) => car.status?.toLowerCase() === "rejected",
      ).length,
    }),
    [safeCars],
  );

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Modal handlers
  const openModal = (car, type) => {
    if (!car) return;

    setSelectedCar(car);
    setMode(type);

    setFormData({
      carName: car.carName || "",
      description: car.description || "",
      location: car.location || "",
      rentalFee: car.rentalFee ?? "",
      carType: car.carType || "",
    });
  };

  const closeModal = () => {
    if (isUpdating) return;

    setSelectedCar(null);
    setMode(null);
  };

  // Form handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Delete car
  const handleDelete = async (car) => {
    if (!car?._id || deletingId) return;

    const result = await Swal.fire({
      title: "Delete this car?",
      text: `Are you sure you want to permanently delete "${car.carName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0F766E",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(car._id);

      await axiosSecure.delete(`/cars/${car._id}`);

      await refetch();

      Swal.fire({
        icon: "success",
        title: "Car Deleted",
        text: "The car has been successfully removed.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Update car
  const handleUpdate = async () => {
    if (!selectedCar?._id || isUpdating) return;

    if (
      !formData.carName.trim() ||
      !formData.location.trim() ||
      !formData.carType.trim() ||
      formData.rentalFee === ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#0F766E",
      });

      return;
    }

    const rentalFee = Number(formData.rentalFee);

    if (!Number.isFinite(rentalFee) || rentalFee < 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Rental Fee",
        text: "Please enter a valid rental fee.",
        confirmButtonColor: "#0F766E",
      });

      return;
    }

    try {
      setIsUpdating(true);

      await axiosSecure.patch(`/cars/${selectedCar._id}`, {
        ...formData,
        rentalFee,
      });

      await refetch();

      setSelectedCar(null);
      setMode(null);

      Swal.fire({
        icon: "success",
        title: "Changes Saved",
        text: "Your car information has been updated.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <Loader fullScreen={false} />;

  // Error state
  if (isError) {
    return (
      <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mx-auto text-primary">
          <FaCar size={23} />
        </div>

        <h3 className="font-bold text-base-content mt-4">
          Unable to Load Your Cars
        </h3>

        <p className="text-sm text-base-content/50 mt-2">
          Something went wrong while fetching your managed vehicles.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-primary text-primary-content text-sm font-semibold hover:opacity-90 transition-all"
        >
          <FaRedo size={12} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-5 rounded-full bg-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
              Fleet Management
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-base-content tracking-tight">
            My Managed Cars
          </h2>

          <p className="text-sm text-base-content/50 mt-1">
            Manage, monitor and update your listed vehicles.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-base-300 bg-base-100 text-sm font-semibold text-base-content/70 hover:bg-primary hover:text-primary-content hover:border-primary transition-all disabled:opacity-50"
        >
          <FaRedo size={12} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          title="Total Vehicles"
          count={stats.total}
          icon={FaCar}
          description="All listed vehicles"
        />

        <SummaryCard
          title="Approved"
          count={stats.approved}
          icon={FaCheckCircle}
          description="Approved vehicles"
        />

        <SummaryCard
          title="Pending"
          count={stats.pending}
          icon={FaClock}
          description="Awaiting approval"
        />

        <SummaryCard
          title="Rejected"
          count={stats.rejected}
          icon={FaBan}
          description="Rejected vehicles"
        />
      </div>

      {/* Main Table Card */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-4 sm:p-5 border-b border-base-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-base-content">
                Vehicle Inventory
              </h3>

              <p className="text-xs text-base-content/45 mt-1">
                {filteredCars.length} vehicles found in your inventory
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35 text-sm pointer-events-none" />

                <input
                  type="text"
                  placeholder="Search name, type, location..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 pl-10 pr-10 bg-base-200/60 border border-base-300 rounded-xl text-sm text-base-content placeholder:text-base-content/35 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />

                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>

              <div className="h-10 px-3 flex items-center justify-center gap-2 rounded-xl bg-base-200/60 border border-base-300 text-xs font-medium text-base-content/60">
                <FaFilter size={11} />
                All Vehicles
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th className="w-14">No.</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Category</th>
                <th>Daily Rate</th>
                <th>Location</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCars.length > 0 ? (
                paginatedCars.map((car, index) => (
                  <tr key={car._id}>
                    <td className="text-base-content/40 text-xs font-medium">
                      {startIndex + index + 1}
                    </td>

                    <td>
                      <div className="flex items-center gap-3 min-w-48">
                        <div className="w-11 h-11 rounded-xl bg-base-200 border border-base-300 overflow-hidden shrink-0">
                          {car.bannerImage ? (
                            <img
                              src={car.bannerImage}
                              alt={car.carName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary">
                              <FaCar size={17} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-sm text-base-content truncate max-w-44">
                            {car.carName}
                          </p>

                          <p className="text-[11px] text-base-content/40 mt-1">
                            ID: {car._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <StatusBadge status={car.status} />
                    </td>

                    <td className="text-sm text-base-content/60">
                      {car.carType || "N/A"}
                    </td>

                    <td>
                      <div className="inline-flex items-center gap-1 font-bold text-sm text-base-content whitespace-nowrap">
                        <FaBangladeshiTakaSign className="text-primary text-xs" />
                        {formatCurrency(car.rentalFee || 0)}
                        <span className="text-[10px] font-normal text-base-content/40">
                          /day
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-1.5 text-sm text-base-content/60 min-w-28">
                        <FaMapMarkerAlt className="text-primary/70 text-xs shrink-0" />
                        <span className="truncate max-w-36">
                          {car.location || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-1.5">
                        <ActionButton
                          icon={FaEye}
                          label="View details"
                          onClick={() => openModal(car, "view")}
                        />

                        <ActionButton
                          icon={FaEdit}
                          label="Edit vehicle"
                          onClick={() => openModal(car, "edit")}
                          disabled={!!deletingId}
                        />

                        <ActionButton
                          icon={FaTrash}
                          label="Delete vehicle"
                          onClick={() => handleDelete(car)}
                          disabled={!!deletingId}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center text-primary/60 mb-3">
                        <FaCar size={24} />
                      </div>

                      <h4 className="text-sm font-bold text-base-content">
                        {search ? "No Matching Vehicles" : "No Vehicles Yet"}
                      </h4>

                      <p className="text-xs text-base-content/45 mt-1 max-w-xs">
                        {search
                          ? "Try searching with a different keyword."
                          : "Your managed vehicles will appear here once you add them."}
                      </p>

                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="mt-4 text-xs font-bold text-primary hover:underline"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-t border-base-200">
            <p className="text-xs text-base-content/45">
              Showing{" "}
              <span className="font-semibold text-base-content">
                {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredCars.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-base-content">
                {filteredCars.length}
              </span>{" "}
              vehicles
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl border border-base-300 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-primary-content hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-base-content/60 disabled:hover:border-base-300"
              >
                <FaChevronLeft size={11} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === index + 1
                      ? "bg-primary text-primary-content shadow-sm"
                      : "border border-base-300 text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl border border-base-300 flex items-center justify-center text-base-content/60 hover:bg-primary hover:text-primary-content hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-base-content/60 disabled:hover:border-base-300"
              >
                <FaChevronRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View / Edit Modal */}
      <AnimatePresence>
        {selectedCar && mode && (
          <ModalOverlay onClose={closeModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-base-100 border border-base-300 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-base-200">
                <div>
                  <h3 className="text-base font-bold text-base-content">
                    {mode === "view" ? "Vehicle Details" : "Edit Vehicle"}
                  </h3>

                  <p className="text-xs text-base-content/45 mt-1">
                    {mode === "view"
                      ? "Overview of your listed vehicle"
                      : "Update your vehicle information"}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className="w-9 h-9 rounded-xl bg-base-200 text-base-content/60 hover:bg-primary hover:text-primary-content flex items-center justify-center transition-all disabled:opacity-40"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              {mode === "view" ? (
                /* View Modal */
                <div>
                  <div className="h-52 bg-base-200 relative">
                    {selectedCar.bannerImage ? (
                      <img
                        src={selectedCar.bannerImage}
                        alt={selectedCar.carName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/50">
                        <FaCar size={48} />
                      </div>
                    )}

                    <div className="absolute bottom-3 left-4">
                      <StatusBadge status={selectedCar.status} />
                    </div>
                  </div>

                  <div className="p-5 space-y-5">
                    <div>
                      <h4 className="text-xl font-bold text-base-content">
                        {selectedCar.carName}
                      </h4>

                      <p className="text-xs text-base-content/45 mt-1">
                        {selectedCar.carType || "Vehicle"} ·{" "}
                        {selectedCar.location || "Location not specified"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-base-200/70 border border-base-300">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-base-content/40">
                          Daily Rental Fee
                        </p>

                        <p className="flex items-center gap-1 text-lg font-bold text-primary mt-2">
                          <FaBangladeshiTakaSign size={13} />
                          {formatCurrency(selectedCar.rentalFee || 0)}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-base-200/70 border border-base-300">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-base-content/40">
                          Vehicle Type
                        </p>

                        <p className="text-sm font-bold text-base-content mt-2">
                          {selectedCar.carType || "N/A"}
                        </p>
                      </div>
                    </div>

                    {selectedCar.description && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-base-content/40 mb-2">
                          Description
                        </p>

                        <p className="text-sm text-base-content/65 leading-relaxed bg-base-200/70 border border-base-300 rounded-xl p-4">
                          {selectedCar.description}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={closeModal}
                      className="w-full h-11 rounded-xl bg-primary text-primary-content text-sm font-bold hover:opacity-90 transition-all"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              ) : (
                /* Edit Modal */
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: "carName",
                        label: "Car Name",
                        placeholder: "e.g. Toyota Axio",
                        type: "text",
                      },
                      {
                        name: "carType",
                        label: "Car Type",
                        placeholder: "e.g. Sedan",
                        type: "text",
                      },
                      {
                        name: "location",
                        label: "Location",
                        placeholder: "e.g. Dhaka",
                        type: "text",
                      },
                      {
                        name: "rentalFee",
                        label: "Rental Fee (BDT / Day)",
                        placeholder: "e.g. 2500",
                        type: "number",
                      },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-xs font-bold text-base-content/60 mb-2">
                          {field.label}
                          <span className="text-primary ml-1">*</span>
                        </label>

                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          min={field.type === "number" ? "0" : undefined}
                          className="w-full h-11 px-3.5 bg-base-200/60 border border-base-300 rounded-xl text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-base-content/60 mb-2">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write something about your vehicle..."
                      className="w-full px-3.5 py-3 bg-base-200/60 border border-base-300 rounded-xl text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                    <button
                      onClick={closeModal}
                      disabled={isUpdating}
                      className="flex-1 h-11 rounded-xl border border-base-300 bg-base-100 text-base-content/70 text-sm font-semibold hover:bg-base-200 transition-all disabled:opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="flex-1 h-11 rounded-xl bg-primary text-primary-content text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <span className="loading loading-spinner loading-xs" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle size={13} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyManagedCars;
