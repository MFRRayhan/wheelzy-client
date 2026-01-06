// src/pages/dashboard/UserBookings.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaEye, FaTrash, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const MyCars = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");

  // Fetch user's active bookings
  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userBookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/memberships/active"); // Backend API
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Cancel booking
  const handleCancelBooking = (bookingId, carName) => {
    Swal.fire({
      title: `Cancel booking for ${carName}?`,
      text: "This will cancel your current booking. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel Booking",
      cancelButtonText: "No, Keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(
            `/memberships/cancel/${bookingId}`
          );
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire(
              "Cancelled!",
              `Your booking for ${carName} has been cancelled.`,
              "success"
            );
          } else {
            Swal.fire(
              "Failed",
              res.data.message || "Could not cancel booking",
              "error"
            );
          }
        } catch (err) {
          Swal.fire(
            "Error",
            "Server error occurred while cancelling booking",
            "error"
          );
        }
      }
    });
  };

  if (isLoading) return <Loader />;

  if (bookings.length === 0)
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-700">
          You have no active bookings.
        </h3>
        <p className="text-gray-500 mt-2">
          Browse available cars on the{" "}
          <Link to="/cars" className="text-primary hover:underline font-medium">
            Cars Page
          </Link>{" "}
          to make a booking!
        </p>
      </div>
    );

  // Filter by search
  const filteredBookings = bookings.filter((b) =>
    b.carName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      {/* Heading + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl text-primary font-bold">My Active Bookings</h2>

        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
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
                  <th>{index + 1}</th>
                  <td>{booking.carName}</td>
                  <td>
                    {booking.membershipFee === 0 ? (
                      "Free"
                    ) : (
                      <div className="flex items-center gap-1">
                        <FaBangladeshiTakaSign />
                        {booking.membershipFee}
                      </div>
                    )}
                  </td>
                  <td>{new Date(booking.purchaseDate).toLocaleDateString()}</td>
                  <td className="capitalize">{booking.status}</td>
                  <td className="space-x-2">
                    <Link
                      to={`/cars/${booking.carId}`}
                      className="btn btn-square hover:bg-primary hover:text-white"
                      title="View Car Details"
                    >
                      <FaEye />
                    </Link>

                    <button
                      onClick={() =>
                        handleCancelBooking(booking._id, booking.carName)
                      }
                      className="btn btn-square hover:btn-error hover:text-white"
                      title="Cancel Booking"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No matching bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCars;
