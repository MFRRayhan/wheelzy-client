import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaRoute,
  FaCarSide,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaSearch,
  FaTimes,
  FaMapMarkerAlt,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import SummaryCard from "../../components/SummaryCard";

const ITEMS_PER_PAGE = 10;

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return "N/A";

  return value.toLocaleString("en-BD");
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusConfig = {
  active: {
    label: "Active",
    icon: FaCheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    icon: FaBan,
  },
  pending: {
    label: "Pending",
    icon: FaClock,
  },
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    icon: FaRoute,
  };

  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-base-200 border border-base-300 text-base-content/70 text-[11px] font-semibold capitalize whitespace-nowrap">
      <Icon size={11} />
      {config.label}
    </span>
  );
};

const RideRequests = () => {
  const axiosSecure = useAxiosSecure();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: rideRequests = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["rider-ride-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/ride-requests");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Search and filtering
  const filteredRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return rideRequests;

    return rideRequests.filter((ride) =>
      [ride.carName, ride.carType, ride.location, ride.userEmail, ride.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [rideRequests, search]);

  // Summary statistics
  const stats = useMemo(
    () => ({
      total: rideRequests.length,
      active: rideRequests.filter(
        (ride) => ride.status?.toLowerCase() === "active",
      ).length,
      pending: rideRequests.filter(
        (ride) => ride.status?.toLowerCase() === "pending",
      ).length,
      cancelled: rideRequests.filter(
        (ride) => ride.status?.toLowerCase() === "cancelled",
      ).length,
    }),
    [rideRequests],
  );

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (isLoading) return <Loader fullScreen={false} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-5 rounded-full bg-primary" />

            <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
              Booking Management
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-base-content tracking-tight">
            Ride Requests
          </h2>

          <p className="text-sm text-base-content/50 mt-1">
            Monitor and review ride requests for your vehicles.
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

      {/* Error State */}
      {isError ? (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mx-auto text-primary">
            <FaRoute size={23} />
          </div>

          <h3 className="font-bold text-base-content mt-4">
            Unable to Load Ride Requests
          </h3>

          <p className="text-sm text-base-content/50 mt-2">
            {error?.response?.data?.message ||
              "Something went wrong while fetching ride requests."}
          </p>

          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-primary text-primary-content text-sm font-semibold hover:opacity-90 transition-all"
          >
            <FaRedo size={12} />
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <SummaryCard
              title="Total Requests"
              count={stats.total}
              icon={FaRoute}
              description="All ride requests"
            />

            <SummaryCard
              title="Active Rides"
              count={stats.active}
              icon={FaCheckCircle}
              description="Currently active"
            />

            <SummaryCard
              title="Pending Requests"
              count={stats.pending}
              icon={FaClock}
              description="Awaiting response"
            />

            <SummaryCard
              title="Cancelled"
              count={stats.cancelled}
              icon={FaBan}
              description="Cancelled requests"
            />
          </div>

          {/* Main Table */}
          <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="p-4 sm:p-5 border-b border-base-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-base-content">
                    All Ride Requests
                  </h3>

                  <p className="text-xs text-base-content/45 mt-1">
                    {filteredRequests.length} requests found
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full sm:w-72">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35 text-sm pointer-events-none" />

                    <input
                      type="text"
                      placeholder="Search car, email, location..."
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
                    All Requests
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
                    <th>Location</th>
                    <th>Customer</th>
                    <th>Daily Rate</th>
                    <th>Status</th>
                    <th>Requested Date</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRequests.length > 0 ? (
                    paginatedRequests.map((ride, index) => (
                      <tr key={ride._id}>
                        <td className="text-base-content/40 text-xs font-medium">
                          {startIndex + index + 1}
                        </td>

                        <td>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-base-content truncate max-w-40">
                              {ride.carName || "Unknown Vehicle"}
                            </p>

                            <p className="text-[11px] text-base-content/40 mt-1">
                              {ride.carType || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center gap-1.5 text-sm text-base-content/60 min-w-28">
                            <FaMapMarkerAlt className="text-primary text-xs shrink-0" />

                            <span className="truncate max-w-36">
                              {ride.location || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center gap-2 min-w-40">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary shrink-0">
                              <FaEnvelope size={12} />
                            </div>

                            <span className="text-xs text-base-content/65">
                              {ride.userEmail || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td>
                          {Number(ride.rentalFee) === 0 ? (
                            <span className="text-xs font-semibold text-base-content/60">
                              Free
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1 font-bold text-sm text-base-content whitespace-nowrap">
                              <FaBangladeshiTakaSign className="text-primary text-xs" />
                              {formatCurrency(ride.rentalFee)}
                            </div>
                          )}
                        </td>

                        <td>
                          <StatusBadge status={ride.status} />
                        </td>

                        <td>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/50 whitespace-nowrap">
                            <FaCalendarAlt className="text-primary" />
                            {formatDate(ride.rentalDate)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center text-primary/60 mb-3">
                            <FaRoute size={24} />
                          </div>

                          <h4 className="text-sm font-bold text-base-content">
                            {search
                              ? "No Matching Requests"
                              : "No Ride Requests Yet"}
                          </h4>

                          <p className="text-xs text-base-content/45 mt-1 max-w-xs">
                            {search
                              ? "Try searching with a different keyword."
                              : "Requests for your vehicles will appear here."}
                          </p>

                          {search && (
                            <button
                              onClick={() => {
                                setSearch("");
                                setCurrentPage(1);
                              }}
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
                    {Math.min(
                      startIndex + ITEMS_PER_PAGE,
                      filteredRequests.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-base-content">
                    {filteredRequests.length}
                  </span>{" "}
                  requests
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
        </>
      )}
    </div>
  );
};

export default RideRequests;
