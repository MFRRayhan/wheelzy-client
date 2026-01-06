import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import Loader from "../../components/Loader";

const PendingRiderRequests = () => {
  const axiosSecure = useAxiosSecure();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch pending riders
  const fetchPendingRiders = async () => {
    try {
      const res = await axiosSecure.get("/admin/rider-applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch rider applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRiders();
  }, []);

  // Approve / Reject rider
  const updateRiderStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `This rider will be ${status}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/admin/rider-applications/${id}`, { status });

      Swal.fire(
        "Success",
        `Rider ${status === "approved" ? "approved" : "rejected"} successfully`,
        "success"
      );

      fetchPendingRiders();
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update rider status", "error");
    }
  };

  const pendingApplications = applications
    .filter((app) => app.status === "pending")
    .filter(
      (app) =>
        app.name.toLowerCase().includes(searchText.toLowerCase()) ||
        app.email.toLowerCase().includes(searchText.toLowerCase())
    );

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Pending Rider Applications
        </h2>

        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {pendingApplications.length === 0 ? (
        <p className="text-center pt-30 text-2xl text-error font-bold">
          No pending rider applications
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Applied At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingApplications.map((app, index) => (
                <tr key={app._id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.contact}</td>
                  <td>
                    {app.district}, {app.division}
                  </td>
                  <td>
                    {new Date(
                      app.appliedAt || app.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-square hover:btn-primary"
                      onClick={() => setSelectedItem(app)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn btn-square hover:btn-success"
                      onClick={() => updateRiderStatus(app._id, "approved")}
                    >
                      <FaCheck />
                    </button>

                    <button
                      className="btn btn-square hover:btn-error"
                      onClick={() => updateRiderStatus(app._id, "rejected")}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setSelectedItem(null)}
          ></div>

          <div className="relative bg-white rounded-lg w-11/12 md:w-1/2 p-6 shadow-lg z-10">
            <h3 className="text-2xl font-bold mb-4">
              Rider Application Details
            </h3>

            <p className="mb-2">
              <strong>Name:</strong> {selectedItem.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {selectedItem.email}
            </p>
            <p className="mb-2">
              <strong>Contact:</strong> {selectedItem.contact}
            </p>
            <p className="mb-2">
              <strong>Location:</strong> {selectedItem.district},{" "}
              {selectedItem.division}
            </p>
            <p className="mb-2">
              <strong>Description:</strong> {selectedItem.description}
            </p>
            <p className="mb-2 capitalize">
              <strong>Status:</strong> {selectedItem.status}
            </p>
            <p className="mb-4">
              <strong>Applied At:</strong>{" "}
              {new Date(
                selectedItem.appliedAt || selectedItem.createdAt
              ).toLocaleString()}
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="btn btn-success"
                onClick={() => updateRiderStatus(selectedItem._id, "approved")}
              >
                Approve
              </button>

              <button
                className="btn btn-error"
                onClick={() => updateRiderStatus(selectedItem._id, "rejected")}
              >
                Reject
              </button>

              <button
                className="btn btn-outline"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiderRequests;
