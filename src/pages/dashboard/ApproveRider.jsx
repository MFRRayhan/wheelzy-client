import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaTrash, FaUserCheck } from "react-icons/fa";
import { IoPersonRemoveSharp } from "react-icons/io5";
import Swal from "sweetalert2";

const ApproveRider = () => {
  const axiosSecure = useAxiosSecure();

  const { refetch, data: rider = [] } = useQuery({
    queryKey: ["rider", "pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider");
      return res.data;
    },
  });

  // === Universal Status Update ===
  const updateRiderStatus = (rider, status) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${status} this rider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${status}`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updateInfo = { status: status, email: rider.riderEmail };

        axiosSecure
          .patch(`/rider/${rider._id}`, updateInfo)
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire({
                position: "center",
                icon: status === "approved" ? "success" : "error",
                title:
                  status === "approved"
                    ? "Rider Approved Successfully!"
                    : "Rider Rejected!",
                showConfirmButton: false,
                timer: 2000,
              });
            }
          })
          .catch((error) => console.log(error));
      }
    });
  };

  const handleRemoveRider = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((res) => {
      if (res.isConfirmed) {
        axiosSecure.delete(`/rider/${id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Rider has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-semibold text-secondary mb-6">
        Riders Approval Panel
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-white">
        <table className="table w-full text-center">
          {/* head */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>E-mail</th>
              <th>District</th>
              <th>Application Status</th>
              <th>Work Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rider.map((rider, index) => (
              <tr
                key={rider._id}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="font-medium">{index + 1}</td>
                <td>{rider.riderName}</td>
                <td>{rider.riderEmail}</td>
                <td>{rider.riderDistrict}</td>

                {/* Status Badge */}
                <td className="capitalize">
                  <span
                    className={`badge px-4 py-3 font-semibold ${
                      rider.status === "approved"
                        ? "bg-primary text-secondary"
                        : rider.status === "rejected"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-600"
                    }`}
                  >
                    {rider.status}
                  </span>
                </td>

                <td className="capitalize">{rider.workStatus}</td>

                {/* Action Buttons */}
                <td>
                  <div className="flex items-center justify-center gap-2">
                    {/* view details */}
                    {/* You can open the modal using document.getElementById('ID').showModal() method */}
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        document
                          .getElementById(`rider_modal_${rider._id}`)
                          .showModal()
                      }
                    >
                      <FaEye />
                    </button>

                    <dialog id={`rider_modal_${rider._id}`} className="modal">
                      <div className="modal-box max-w-3xl bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 p-6">
                        {/* Header */}
                        <h3 className="font-bold text-3xl mb-6 text-secondary text-center tracking-wide border-b pb-3">
                          🏍️ Rider Information
                        </h3>

                        <div className="space-y-6 text-gray-800">
                          {/* Personal Info */}
                          <div className="p-4 bg-gray-50 rounded-xl shadow-inner">
                            <h4 className="font-semibold text-lg mb-2 text-secondary">
                              Personal Information
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <p>
                                <b>Name:</b> {rider.riderName}
                              </p>
                              <p>
                                <b>Age:</b> {rider.riderAge}
                              </p>
                              <p>
                                <b>Email:</b> {rider.riderEmail}
                              </p>
                              <p>
                                <b>Contact:</b> {rider.contact}
                              </p>
                              <p>
                                <b>NID:</b> {rider.nid}
                              </p>
                              <p>
                                <b>Driving License:</b> {rider.drivingLicense}
                              </p>
                            </div>
                          </div>

                          {/* Region Info */}
                          <div className="p-4 bg-blue-50 rounded-xl shadow-inner">
                            <h4 className="font-semibold text-lg mb-2 text-blue-700">
                              Region Information
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <p>
                                <b>Region:</b> {rider.riderRegion}
                              </p>
                              <p>
                                <b>District:</b> {rider.riderDistrict}
                              </p>
                              <p>
                                <b>Warehouse:</b> {rider.warehouse}
                              </p>
                            </div>
                          </div>

                          {/* Vehicle Info */}
                          <div className="p-4 bg-emerald-50 rounded-xl shadow-inner">
                            <h4 className="font-semibold text-lg mb-2 text-emerald-700">
                              Vehicle Information
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <p>
                                <b>Bike:</b> {rider.bikeName}
                              </p>
                              <p>
                                <b>Vehicle Reg:</b> {rider.vehicleRegNumber}
                              </p>
                              <p className="col-span-2">
                                <b>Address:</b> {rider.fullAddress}
                              </p>
                            </div>
                          </div>

                          {/* Created At */}
                          <div className="p-4 bg-gray-50 rounded-xl shadow-inner text-sm">
                            <p>
                              <b>Created At:</b>{" "}
                              {new Date(rider.createdAt).toLocaleString(
                                "en-BD",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="modal-action mt-6">
                          <form method="dialog">
                            <button className="btn bg-secondary hover:bg-secondary/80 text-white px-6 rounded-lg shadow-lg transition hover:scale-105">
                              Close
                            </button>
                          </form>
                        </div>
                      </div>
                    </dialog>

                    {/* Approve */}
                    <button
                      onClick={() => updateRiderStatus(rider, "approved")}
                      className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                    >
                      <FaUserCheck />
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => updateRiderStatus(rider, "rejected")}
                      className="btn btn-sm bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <IoPersonRemoveSharp />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemoveRider(rider._id)}
                      className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveRider;
