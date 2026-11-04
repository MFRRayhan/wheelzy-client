import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes, FaSearch, FaUserClock } from "react-icons/fa";
import Loader from "../../components/Loader";

const PendingRiderRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchPendingRiders = async () => {
    try {
      const res = await axiosSecure.get("/admin/rider-applications");
      setApplications(res.data);
    } catch {
      Swal.fire("Error", "Failed to fetch rider applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRiders();
  }, []);

  const updateRiderStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: "Confirm Action",
      text: `${status === "approved" ? "Approve" : "Reject"} this rider application?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#059669" : "#dc2626",
      confirmButtonText: status === "approved" ? "Approve" : "Reject",
    });
    if (!confirm.isConfirmed) return;
    try {
      await axiosSecure.patch(`/admin/rider-applications/${id}`, { status });
      Swal.fire({
        icon: "success",
        title: "Done!",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchPendingRiders();
      setSelectedItem(null);
    } catch {
      Swal.fire("Error", "Failed to update", "error");
    }
  };

  const pendingApplications = applications
    .filter((app) => app.status === "pending")
    .filter(
      (app) =>
        app.name.toLowerCase().includes(searchText.toLowerCase()) ||
        app.email.toLowerCase().includes(searchText.toLowerCase()),
    );

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">
            Rider Applications
          </h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {pendingApplications.length} pending reviews
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-base-100 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {pendingApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-base-100 rounded-2xl border border-base-300">
          <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mb-4">
            <FaUserClock className="text-base-content/30" size={24} />
          </div>
          <p className="font-medium text-base-content">
            No pending applications
          </p>
          <p className="text-sm text-base-content/40 mt-1">
            All rider requests have been reviewed.
          </p>
        </div>
      ) : (
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="premium-table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map((app, index) => (
                  <tr key={app._id}>
                    <td className="text-base-content/40">{index + 1}</td>
                    <td className="font-semibold text-base-content">
                      {app.name}
                    </td>
                    <td className="text-base-content/60">{app.email}</td>
                    <td className="text-base-content/60">{app.contact}</td>
                    <td className="text-base-content/60">
                      {app.district}, {app.division}
                    </td>
                    <td className="text-base-content/40 text-xs">
                      {new Date(
                        app.appliedAt || app.createdAt,
                      ).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedItem(app)}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-base-content/60"
                          title="View details"
                        >
                          <FaEye size={12} />
                        </button>
                        <button
                          onClick={() => updateRiderStatus(app._id, "approved")}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 flex items-center justify-center transition-all"
                          title="Approve"
                        >
                          <FaCheck size={12} />
                        </button>
                        <button
                          onClick={() => updateRiderStatus(app._id, "rejected")}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 flex items-center justify-center transition-all"
                          title="Reject"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-base-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden pointer-events-auto border border-base-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-200">
                  <h3 className="font-bold text-base-content">
                    Application Details
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-8 h-8 rounded-lg hover:bg-base-200 flex items-center justify-center text-base-content/50 transition-all"
                  >
                    <FaTimes size={13} />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: "Name", value: selectedItem.name },
                      { label: "Email", value: selectedItem.email },
                      { label: "Contact", value: selectedItem.contact },
                      {
                        label: "Location",
                        value: `${selectedItem.district}, ${selectedItem.division}`,
                      },
                      { label: "Status", value: selectedItem.status },
                      {
                        label: "Applied",
                        value: new Date(
                          selectedItem.appliedAt || selectedItem.createdAt,
                        ).toLocaleDateString(),
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-base-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-base-content capitalize">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {selectedItem.description && (
                    <div className="bg-base-200 rounded-xl p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">
                        Description
                      </p>
                      <p className="text-sm text-base-content/70 leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() =>
                        updateRiderStatus(selectedItem._id, "approved")
                      }
                      className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <FaCheck size={12} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        updateRiderStatus(selectedItem._id, "rejected")
                      }
                      className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <FaTimes size={12} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingRiderRequests;
