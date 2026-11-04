import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaEye, FaTrash, FaSearch, FaCar } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const statusBadge = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
};

const MyCars = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userBookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/memberships/active");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleCancelBooking = (bookingId, carName) => {
    Swal.fire({
      title: "Cancel Booking?",
      text: `Cancel your booking for "${carName}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Cancel Booking",
      cancelButtonText: "Keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(
            `/memberships/cancel/${bookingId}`,
          );
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              icon: "success",
              title: "Booking cancelled",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            Swal.fire(
              "Failed",
              res.data.message || "Could not cancel booking",
              "error",
            );
          }
        } catch {
          Swal.fire("Error", "Server error occurred", "error");
        }
      }
    });
  };

  if (isLoading) return <Loader fullScreen={false} />;

  const filteredBookings = bookings.filter((b) =>
    b.carName.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mb-4">
          <FaCar className="text-base-content/30" size={26} />
        </div>
        <p className="font-bold text-base-content text-lg mb-1">
          No active bookings
        </p>
        <p className="text-sm text-base-content/50 mb-6">
          Browse available cars and make your first booking.
        </p>
        <Link
          to="/cars"
          className="bg-primary text-primary-content font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all"
        >
          Browse Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">My Bookings</h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {filteredBookings.length} active bookings
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-base-100 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="premium-table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Car Name</th>
                <th>Fee Paid</th>
                <th>Booked On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr key={booking._id}>
                    <td className="text-base-content/40 font-medium">
                      {index + 1}
                    </td>
                    <td className="font-semibold text-base-content">
                      {booking.carName}
                    </td>
                    <td>
                      {booking.membershipFee === 0 ? (
                        <span className="text-emerald-600 font-semibold text-xs">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 font-semibold text-base-content">
                          <FaBangladeshiTakaSign className="text-xs text-primary" />
                          <span className="text-sm">
                            {booking.membershipFee}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="text-base-content/50 text-xs">
                      {new Date(booking.purchaseDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                          statusBadge[booking.status] ||
                          "bg-base-200 text-base-content/60"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/cars/${booking.carId}`}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-base-content/60"
                          title="View car"
                        >
                          <FaEye size={12} />
                        </Link>
                        <button
                          onClick={() =>
                            handleCancelBooking(booking._id, booking.carName)
                          }
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 flex items-center justify-center transition-all text-base-content/60"
                          title="Cancel booking"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-base-content/40 text-sm"
                  >
                    No bookings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCars;
