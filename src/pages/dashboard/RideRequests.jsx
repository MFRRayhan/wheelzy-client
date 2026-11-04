import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaRoute } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const statusBadge = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
};

const RideRequests = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: rideRequests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rider-ride-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/ride-requests");
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 font-semibold">
          {error?.response?.data?.message || "Failed to load ride requests"}
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-base-content">Ride Requests</h2>
        <p className="text-sm text-base-content/50 mt-0.5">
          {rideRequests.length} total requests
        </p>
      </div>

      {rideRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-base-100 rounded-2xl border border-base-300">
          <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mb-4">
            <FaRoute className="text-base-content/30" size={24} />
          </div>
          <p className="font-medium text-base-content">No ride requests yet</p>
          <p className="text-sm text-base-content/40 mt-1">
            Requests for your cars will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="premium-table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Car</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>User Email</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Requested</th>
                </tr>
              </thead>
              <tbody>
                {rideRequests.map((ride, index) => (
                  <tr key={ride._id}>
                    <td className="text-base-content/40">{index + 1}</td>
                    <td className="font-semibold text-base-content">
                      {ride.carName}
                    </td>
                    <td className="text-base-content/60">
                      {ride.carType || "N/A"}
                    </td>
                    <td className="text-base-content/60">
                      {ride.location || "N/A"}
                    </td>
                    <td className="text-base-content/60 text-xs">
                      {ride.userEmail}
                    </td>
                    <td>
                      {ride?.rentalFee === 0 ? (
                        <span className="text-emerald-600 font-semibold text-xs">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 font-semibold text-base-content">
                          <FaBangladeshiTakaSign className="text-xs text-primary" />
                          <span className="text-sm">{ride?.rentalFee}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusBadge[ride.status] || statusBadge.pending}`}
                      >
                        {ride.status}
                      </span>
                    </td>
                    <td className="text-base-content/40 text-xs">
                      {ride.rentalDate
                        ? new Date(ride.rentalDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideRequests;
