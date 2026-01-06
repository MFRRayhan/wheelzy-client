import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

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

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="text-center mt-10 text-error font-semibold">
        {error?.response?.data?.message || "Failed to load ride requests"}
      </div>
    );
  }

  return (
    <div className="px-4 py-10">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Ride Requests for My Cars
      </h2>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
              <th>Car</th>
              <th>Type</th>
              <th>Location</th>
              <th>User Email</th>
              <th>Rental Fee</th>
              <th>Status</th>
              <th>Requested At</th>
            </tr>
          </thead>

          <tbody>
            {rideRequests.length > 0 ? (
              rideRequests.map((ride, index) => (
                <tr key={ride._id}>
                  <td>{index + 1}</td>

                  <td>
                    <span className="font-semibold">{ride.carName}</span>
                  </td>

                  <td>{ride.carType || "N/A"}</td>

                  <td>{ride.location || "N/A"}</td>

                  <td className="text-sm">{ride.userEmail}</td>

                  <td>
                    {ride?.rentalFee === 0 ? (
                      "Free"
                    ) : (
                      <span className="flex items-center gap-1">
                        <FaBangladeshiTakaSign />
                        {ride?.rentalFee}
                      </span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`badge capitalize font-semibold ${
                        ride.status === "active"
                          ? "badge-success"
                          : ride.status === "cancelled"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </td>

                  <td className="text-sm text-gray-500">
                    {ride.rentalDate
                      ? new Date(ride.rentalDate).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-2xl text-error font-semibold"
                >
                  No ride requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RideRequests;
