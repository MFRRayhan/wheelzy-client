import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCar,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ITEMS_PER_PAGE = 10;

const statusStyle = {
  approved: "badge-approved",
  pending: "badge-pending",
  rejected: "badge-rejected",
};

const MyManagedCars = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [mode, setMode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    carName: "",
    description: "",
    location: "",
    rentalFee: "",
    carType: "",
  });

  const {
    data: cars = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-managed-cars", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/my-cars");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  const safeCars = cars.filter((car) => car && car._id && car.carName);
  const filteredCars = safeCars.filter((car) =>
    car.carName.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const openModal = (car, type) => {
    if (!car) return;
    setSelectedCar(car);
    setMode(type);
    setFormData({
      carName: car.carName || "",
      description: car.description || "",
      location: car.location || "",
      rentalFee: car.rentalFee || "",
      carType: car.carType || "",
    });
  };

  const closeModal = () => {
    setSelectedCar(null);
    setMode(null);
  };

  const handleDelete = async (car) => {
    if (!car?._id) return;
    const res = await Swal.fire({
      title: "Delete Car?",
      text: `Delete "${car.carName}" permanently?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });
    if (res.isConfirmed) {
      await axiosSecure.delete(`/cars/${car._id}`);
      refetch();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedCar?._id) return;
    await axiosSecure.patch(`/cars/${selectedCar._id}`, formData);
    refetch();
    closeModal();
    Swal.fire({
      icon: "success",
      title: "Updated!",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">My Cars</h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {filteredCars.length} listed vehicles
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
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
                <th>Car</th>
                <th>Status</th>
                <th>Type</th>
                <th>Fee / Day</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCars.length > 0 ? (
                paginatedCars.map((car, i) => (
                  <tr key={car._id}>
                    <td className="text-base-content/40">
                      {startIndex + i + 1}
                    </td>
                    <td className="font-semibold text-base-content">
                      {car.carName}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${statusStyle[car.status] || "bg-base-200 text-base-content/60"}`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="text-base-content/60">
                      {car.carType || "N/A"}
                    </td>
                    <td>
                      <div className="flex items-center gap-0.5 font-semibold text-base-content">
                        <FaBangladeshiTakaSign className="text-xs text-primary" />
                        <span className="text-sm">{car.rentalFee || 0}</span>
                      </div>
                    </td>
                    <td className="text-base-content/60">
                      {car.location || "N/A"}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openModal(car, "view")}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-primary hover:text-white flex items-center justify-center transition-all text-base-content/60"
                        >
                          <FaEye size={12} />
                        </button>
                        <button
                          onClick={() => openModal(car, "edit")}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-950/30 flex items-center justify-center transition-all text-base-content/60"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(car)}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 flex items-center justify-center transition-all text-base-content/60"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FaCar className="text-base-content/20" size={28} />
                      <p className="text-base-content/40 text-sm">
                        No cars found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-base-200">
            <p className="text-xs text-base-content/40">
              Showing {startIndex + 1}–
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredCars.length)} of{" "}
              {filteredCars.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-base-300 flex items-center justify-center text-xs hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${currentPage === i + 1 ? "bg-primary text-primary-content" : "border border-base-300 hover:bg-base-200"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-base-300 flex items-center justify-center text-xs hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {mode === "view" && selectedCar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-base-100 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden pointer-events-auto border border-base-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-48 bg-base-200">
                  {selectedCar.bannerImage && (
                    <img
                      src={selectedCar.bannerImage}
                      alt={selectedCar.carName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-lg flex items-center justify-center text-white hover:bg-black/60 transition-all"
                  >
                    <FaTimes size={13} />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base-content text-lg">
                    {selectedCar.carName}
                  </h3>
                  {selectedCar.description && (
                    <div className="bg-base-200 rounded-xl p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-1">
                        Description
                      </p>
                      <p className="text-sm text-base-content/70 leading-relaxed">
                        {selectedCar.description}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={closeModal}
                    className="w-full h-10 bg-base-200 hover:bg-base-300 rounded-xl text-sm font-medium transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {mode === "edit" && selectedCar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="bg-base-100 rounded-2xl w-full max-w-md shadow-2xl pointer-events-auto border border-base-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-200">
                  <h3 className="font-bold text-base-content">Edit Car</h3>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 rounded-lg hover:bg-base-200 flex items-center justify-center text-base-content/50 transition-all"
                  >
                    <FaTimes size={13} />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { name: "carName", placeholder: "Car Name" },
                    { name: "location", placeholder: "Location" },
                    {
                      name: "rentalFee",
                      placeholder: "Rental Fee (৳/day)",
                      type: "number",
                    },
                    { name: "carType", placeholder: "Car Type" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1.5 capitalize">
                        {field.name.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full h-10 px-4 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1.5">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Car description..."
                      className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={closeModal}
                      className="flex-1 h-10 bg-base-200 hover:bg-base-300 rounded-xl text-sm font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 h-10 bg-primary text-primary-content rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                    >
                      Update Car
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

export default MyManagedCars;
