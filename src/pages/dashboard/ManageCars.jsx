import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

import {
  FaEye,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCar,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaGasPump,
  FaEnvelope,
} from "react-icons/fa";

import { FaBangladeshiTakaSign } from "react-icons/fa6";

const BRAND = "#0F766E";
const ITEMS_PER_PAGE = 10;

const statusConfig = {
  approved: {
    label: "Approved",
    className: "bg-primary/10 text-primary border-primary/15",
    icon: FaCheckCircle,
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/15",
    icon: FaClock,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/15",
    icon: FaBan,
  },
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  return new Intl.NumberFormat("en-BD").format(value);
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatus = (status) => {
  const normalized = String(status || "").toLowerCase();

  return (
    statusConfig[normalized] || {
      label: status || "Unknown",
      className: "bg-base-200 text-base-content/60 border-base-300",
      icon: FaCar,
    }
  );
};

const CarImage = ({ src, alt, className = "" }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-base-200 ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || "Car"}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <FaCar className="text-base-content/25" size={22} />
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = getStatus(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-bold capitalize ${config.className}`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
};

const SummaryCard = ({ title, count, icon: Icon, description }) => (
  <div className="relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5">
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

const ActionButton = ({ title, onClick, variant = "default", children }) => {
  const variants = {
    default:
      "bg-base-200 text-base-content/60 hover:bg-primary hover:text-white",
    delete:
      "bg-base-200 text-base-content/60 hover:bg-red-500 hover:text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const ManageCars = () => {
  const axiosSecure = useAxiosSecure();

  const [selectedCar, setSelectedCar] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: cars = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await axiosSecure.get("/cars");

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const filteredCars = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) return cars;

    return cars.filter((car) => {
      const searchableText = [
        car.carName,
        car.carType,
        car.location,
        car.riderEmail,
        car.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [cars, searchText]);

  const approvedCount = cars.filter(
    (car) => car.status?.toLowerCase() === "approved",
  ).length;

  const pendingCount = cars.filter(
    (car) => car.status?.toLowerCase() === "pending",
  ).length;

  const rejectedCount = cars.filter(
    (car) => car.status?.toLowerCase() === "rejected",
  ).length;

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

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleDelete = async (car) => {
    const result = await Swal.fire({
      title: "Delete this listing?",
      html: `
        <div style="font-size:14px;color:#777;">
          You are about to remove
          <strong>${car.carName || "this car"}</strong>
          from the platform. This action cannot be undone.
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete listing",
      cancelButtonText: "Keep listing",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5",
        cancelButton: "rounded-xl px-5",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/cars/${car._id}`);

      if (res.data.deletedCount) {
        if (selectedCar?._id === car._id) {
          setSelectedCar(null);
        }

        await refetch();

        Swal.fire({
          icon: "success",
          title: "Listing deleted",
          text: `${car.carName || "Car"} has been removed.`,
          timer: 1800,
          showConfirmButton: false,
          customClass: { popup: "rounded-2xl" },
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "No changes made",
          text: "The listing was not deleted.",
          confirmButtonColor: BRAND,
          customClass: { popup: "rounded-2xl" },
        });
      }
    } catch (err) {
      console.error("Delete car error:", err);

      Swal.fire({
        icon: "error",
        title: "Deletion failed",
        text:
          err.response?.data?.message ||
          "Unable to delete this listing. Please try again.",
        confirmButtonColor: BRAND,
        customClass: { popup: "rounded-2xl" },
      });
    }
  };

  if (isLoading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />

            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
            Manage Cars
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/50">
            Review vehicle listings, monitor approval status, and manage cars
            registered on the Wheelzy platform.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm sm:w-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FaCar size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
              Total listings
            </p>

            <p className="text-lg font-bold leading-tight text-base-content">
              {cars.length}
              <span className="ml-1 text-xs font-medium text-base-content/40">
                vehicles
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh listings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-base-200 text-base-content/60 transition-all hover:bg-primary hover:text-white disabled:opacity-50"
          >
            <FaSyncAlt size={13} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07 } },
        }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            title: "Total Listings",
            count: cars.length,
            icon: FaCar,
            description: "All registered vehicles",
          },
          {
            title: "Approved",
            count: approvedCount,
            icon: FaCheckCircle,
            description: "Available approved listings",
          },
          {
            title: "Pending Review",
            count: pendingCount,
            icon: FaClock,
            description: "Awaiting administrator review",
          },
          {
            title: "Rejected",
            count: rejectedCount,
            icon: FaBan,
            description: "Rejected vehicle listings",
          },
        ].map((item) => (
          <motion.div
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.35 },
              },
            }}
          >
            <SummaryCard {...item} />
          </motion.div>
        ))}
      </motion.div>

      {/* Cars Directory */}
      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Directory Header */}
        <div className="flex flex-col gap-4 border-b border-base-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FaCar size={16} />
            </div>

            <div>
              <h2 className="text-base font-bold text-base-content">
                Vehicle Directory
              </h2>

              <p className="mt-0.5 text-xs text-base-content/45">
                Browse and manage registered vehicles
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-xs">
            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-base-content/35" />

            <input
              type="text"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search cars, type, location..."
              aria-label="Search cars"
              className="h-11 w-full rounded-xl border border-base-300 bg-base-200/50 pl-10 pr-10 text-sm text-base-content outline-none transition-all placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:ring-4 focus:ring-primary/10"
            />

            {searchText && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 transition-colors hover:text-base-content"
              >
                <FaTimes size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Table Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 bg-base-200/30 px-4 py-3 sm:px-5">
          <p className="text-xs text-base-content/50">
            Showing{" "}
            <span className="font-bold text-base-content">
              {filteredCars.length}
            </span>{" "}
            {filteredCars.length === 1 ? "listing" : "listings"}
          </p>

          {isFetching && (
            <span className="flex items-center gap-2 text-[11px] font-medium text-base-content/40">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Updating listings...
            </span>
          )}
        </div>

        {/* Error */}
        {isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <FaExclamationCircle size={22} />
            </div>

            <h3 className="font-bold text-base-content">
              Unable to load car listings
            </h3>

            <p className="mt-2 max-w-sm text-sm text-base-content/50">
              {error?.response?.data?.message ||
                "Something went wrong while loading vehicle listings."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all hover:brightness-95"
              style={{ backgroundColor: BRAND }}
            >
              <FaSyncAlt size={12} />
              Try again
            </button>
          </div>
        ) : filteredCars.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FaSearch size={23} />
            </div>

            <h3 className="font-bold text-base-content">No cars found</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/50">
              {searchText
                ? `No vehicles match "${searchText}". Try another search term.`
                : "There are no vehicle listings to display yet."}
            </p>

            {searchText && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="mt-4 rounded-xl px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="premium-table w-full min-w-[1050px]">
              <thead>
                <tr>
                  <th className="w-14">No.</th>
                  <th>Vehicle</th>
                  <th>Rider Email</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Rental Fee</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginatedCars.map((car, index) => (
                    <motion.tr
                      key={car._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Number */}
                      <td>
                        <span className="text-xs font-semibold tabular-nums text-base-content/35">
                          {String(startIndex + index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      {/* Vehicle */}
                      <td>
                        <div className="flex min-w-[190px] items-center gap-3">
                          <CarImage
                            src={car.bannerImage}
                            alt={car.carName}
                            className="h-11 w-14 rounded-xl border border-base-300"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-base-content">
                              {car.carName || "Unnamed vehicle"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-base-content/40">
                              Vehicle listing
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rider Email */}
                      <td>
                        <div className="flex min-w-[180px] items-center gap-2 text-xs text-base-content/60">
                          <FaEnvelope
                            size={11}
                            className="shrink-0 text-base-content/30"
                          />

                          <span className="truncate">
                            {car.riderEmail || "Not available"}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        <span className="text-sm font-medium text-base-content/70">
                          {car.carType || "N/A"}
                        </span>
                      </td>

                      {/* Location */}
                      <td>
                        <div className="flex min-w-[130px] items-center gap-2 text-xs text-base-content/60">
                          <FaMapMarkerAlt
                            size={11}
                            className="shrink-0 text-base-content/30"
                          />

                          <span className="truncate">
                            {car.location || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Rental Fee */}
                      <td>
                        {Number(car.rentalFee) === 0 ? (
                          <span className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-bold text-primary">
                            Free
                          </span>
                        ) : (
                          <div className="flex items-center gap-0.5 whitespace-nowrap font-semibold text-base-content">
                            <FaBangladeshiTakaSign
                              size={11}
                              className="text-primary"
                            />

                            <span className="text-sm">
                              {formatCurrency(car.rentalFee)}
                            </span>

                            <span className="ml-0.5 text-[10px] font-medium text-base-content/40">
                              / day
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={car.status} />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-end gap-1.5">
                          <ActionButton
                            title="View vehicle details"
                            onClick={() => setSelectedCar(car)}
                          >
                            <FaEye size={13} />
                          </ActionButton>

                          <ActionButton
                            title="Delete vehicle"
                            variant="delete"
                            onClick={() => handleDelete(car)}
                          >
                            <FaTrash size={12} />
                          </ActionButton>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isError && filteredCars.length > 0 && (
          <div className="flex flex-col justify-between gap-3 border-t border-base-200 bg-base-200/20 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <p className="text-[11px] text-base-content/45">
              Showing{" "}
              <span className="font-bold text-base-content">
                {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredCars.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-base-content">
                {filteredCars.length}
              </span>{" "}
              listings
            </p>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-base-300 text-base-content/60 transition-all hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FaChevronLeft size={11} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, visiblePages) => {
                    const previousPage = visiblePages[index - 1];

                    return (
                      <React.Fragment key={page}>
                        {previousPage && page - previousPage > 1 && (
                          <span className="px-1 text-xs text-base-content/40">
                            ...
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Page ${page}`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                          className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-bold transition-all ${
                            currentPage === page
                              ? "bg-primary text-primary-content shadow-sm"
                              : "border border-base-300 text-base-content/60 hover:bg-base-200"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-base-300 text-base-content/60 transition-all hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <FaChevronRight size={11} />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Vehicle Details Modal */}
      <AnimatePresence>
        {selectedCar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[3px]"
              onClick={() => setSelectedCar(null)}
            />

            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 18 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="pointer-events-auto my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <div className="group relative h-52 bg-base-200 sm:h-60">
                  <CarImage
                    src={selectedCar.bannerImage}
                    alt={selectedCar.carName}
                    className="h-full w-full"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <button
                    type="button"
                    onClick={() => setSelectedCar(null)}
                    aria-label="Close vehicle details"
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70"
                  >
                    <FaTimes size={13} />
                  </button>

                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                      Vehicle information
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                      {selectedCar.carName || "Unnamed vehicle"}
                    </h3>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  {/* Status and price */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <StatusBadge status={selectedCar.status} />

                    <div className="flex items-center gap-1 text-primary">
                      <FaBangladeshiTakaSign size={15} />

                      <span className="text-lg font-bold text-base-content">
                        {Number(selectedCar.rentalFee) === 0
                          ? "Free"
                          : formatCurrency(selectedCar.rentalFee)}
                      </span>

                      {Number(selectedCar.rentalFee) !== 0 && (
                        <span className="text-xs text-base-content/40">
                          / day
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Information grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Vehicle Type",
                        value: selectedCar.carType || "N/A",
                        icon: FaCar,
                      },
                      {
                        label: "Location",
                        value: selectedCar.location || "N/A",
                        icon: FaMapMarkerAlt,
                      },
                      {
                        label: "Rental Fee",
                        value:
                          Number(selectedCar.rentalFee) === 0
                            ? "Free"
                            : `৳ ${formatCurrency(selectedCar.rentalFee)} / day`,
                        icon: FaBangladeshiTakaSign,
                      },
                      {
                        label: "Listed On",
                        value: formatDate(selectedCar.createdAt),
                        icon: FaCalendarAlt,
                      },
                    ].map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-base-300 bg-base-200/40 p-3.5"
                      >
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon size={13} />
                        </div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                          {label}
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold capitalize text-base-content">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Rider */}
                  <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FaEnvelope size={13} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                          Registered Rider
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-base-content">
                          {selectedCar.riderEmail || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedCar.description && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-base-content/40">
                        Description
                      </p>

                      <p className="rounded-2xl border border-base-300 bg-base-200/40 p-4 text-sm leading-6 text-base-content/70">
                        {selectedCar.description}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedCar(null)}
                    className="flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:brightness-95 active:scale-[0.99]"
                    style={{ backgroundColor: BRAND }}
                  >
                    Close Details
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCars;
