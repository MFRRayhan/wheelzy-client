import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaSearch,
  FaHourglassHalf,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import Loader from "../../components/Loader";

const WaitingForApproval = () => {
  const axiosSecure = useAxiosSecure();
  const [pendingCars, setPendingCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  const fetchPendingData = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/cars?status=pending");
      setPendingCars(res.data);
    } catch {
      Swal.fire("Error", "Failed to fetch pending cars", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  const updateCarStatus = async (carId, status) => {
    try {
      await axiosSecure.patch(`/cars/${carId}/status`, { status });
      Swal.fire({
        icon: "success",
        title: `Car ${status}!`,
        timer: 1500,
        showConfirmButton: false,
      });
      setPendingCars((prev) => prev.filter((car) => car._id !== carId));
      setSelectedItem(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const filteredCars = pendingCars.filter(
    (car) =>
      car.carName.toLowerCase().includes(searchText.toLowerCase()) ||
      car.riderEmail.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">
            Pending Car Approval
          </h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {filteredCars.length} awaiting review
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search by car or rider..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-base-100 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {filteredCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-base-100 rounded-2xl border border-base-300">
          <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mb-4">
            <FaHourglassHalf className="text-base-content/30" size={22} />
          </div>
          <p className="font-medium text-base-content">No pending cars</p>
          <p className="text-sm text-base-content/40 mt-1">
            All listings have been reviewed.
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
                  <th>Rider Email</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car, i) => (
                  <tr key={car._id}>
                    <td className="text-base-content/40">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-base-200 flex-shrink-0">
                          {car.bannerImage && (
                            <img
                              src={car.bannerImage}
                              alt={car.carName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-semibold text-base-content">
                          {car.carName}
                        </span>
                      </div>
                    </td>
                    <td className="text-base-content/60">{car.riderEmail}</td>
                    <td className="text-base-content/40 text-xs">
                      {new Date(car.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedItem(car)}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-base-content/60"
                          title="View details"
                        >
                          <FaEye size={12} />
                        </button>
                        <button
                          onClick={() => updateCarStatus(car._id, "approved")}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center transition-all"
                          title="Approve"
                        >
                          <FaCheck size={12} />
                        </button>
                        <button
                          onClick={() => updateCarStatus(car._id, "rejected")}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 flex items-center justify-center transition-all"
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

      {/* Car detail modal */}
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
                className="bg-base-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden pointer-events-auto border border-base-300 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedItem.bannerImage && (
                  <div className="relative h-48 bg-base-200">
                    <img
                      src={selectedItem.bannerImage}
                      alt={selectedItem.carName}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-lg flex items-center justify-center text-white hover:bg-black/60 transition-all"
                    >
                      <FaTimes size={13} />
                    </button>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base-content text-lg">
                    {selectedItem.carName}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: "Type", value: selectedItem.carType },
                      { label: "Location", value: selectedItem.location },
                      {
                        label: "Rental Fee",
                        value: selectedItem.rentalFee
                          ? `৳ ${selectedItem.rentalFee} / day`
                          : "Free",
                      },
                      { label: "Rider", value: selectedItem.riderEmail },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-base-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-base-content truncate">
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
                        updateCarStatus(selectedItem._id, "approved")
                      }
                      className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <FaCheck size={12} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        updateCarStatus(selectedItem._id, "rejected")
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

export default WaitingForApproval;
