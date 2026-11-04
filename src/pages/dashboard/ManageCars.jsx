import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import { FaEye, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const statusStyle = {
  approved: "badge-approved",
  pending: "badge-pending",
  rejected: "badge-rejected",
};

const ManageCars = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: cars = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await axiosSecure.get("/cars");
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  const filteredCars = cars.filter((car) =>
    `${car.carName} ${car.carType} ${car.location}`
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleDelete = (car) => {
    Swal.fire({
      title: "Delete Car?",
      text: `Are you sure you want to delete "${car.carName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e85d04",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/cars/${car._id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-base-content">Manage Cars</h2>
          <p className="text-sm text-base-content/50 mt-0.5">
            {filteredCars.length} total listings
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search cars..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
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
                <th>Rider Email</th>
                <th>Type</th>
                <th>Location</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCars.length > 0 ? (
                paginatedCars.map((car, index) => (
                  <tr key={car._id}>
                    <td className="text-base-content/40 font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-base-200 flex-shrink-0">
                          <img
                            src={car.bannerImage}
                            alt={car.carName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-base-content truncate max-w-32">
                          {car.carName}
                        </span>
                      </div>
                    </td>
                    <td className="text-base-content/60 max-w-36 truncate">
                      {car.riderEmail}
                    </td>
                    <td className="text-base-content/70">{car.carType}</td>
                    <td className="text-base-content/70">{car.location}</td>
                    <td>
                      {car.rentalFee === 0 ? (
                        <span className="text-emerald-600 font-semibold text-xs">
                          Free
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 font-semibold text-base-content">
                          <FaBangladeshiTakaSign className="text-xs text-primary" />
                          <span className="text-sm">{car.rentalFee}</span>
                          <span className="text-xs text-base-content/40">
                            /d
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                          statusStyle[car.status] ||
                          "bg-base-200 text-base-content/60"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCar(car)}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-150 text-base-content/60"
                          title="View details"
                        >
                          <FaEye size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(car)}
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 flex items-center justify-center transition-all duration-150 text-base-content/60"
                          title="Delete car"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center text-base-content/40"
                  >
                    No cars match your search.
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
              {Math.min(startIndex + itemsPerPage, filteredCars.length)} of{" "}
              {filteredCars.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-base-300 flex items-center justify-center text-xs hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-primary text-primary-content"
                      : "border border-base-300 hover:bg-base-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-base-300 flex items-center justify-center text-xs hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Car detail modal */}
      <AnimatePresence>
        {selectedCar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
              onClick={() => setSelectedCar(null)}
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
                <div className="relative h-52 bg-base-200">
                  <img
                    src={selectedCar.bannerImage}
                    alt={selectedCar.carName}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedCar(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-lg flex items-center justify-center text-white transition-all"
                  >
                    <FaTimes size={13} />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-base-content">
                    {selectedCar.carName}
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: "Type", value: selectedCar.carType },
                      { label: "Location", value: selectedCar.location },
                      {
                        label: "Rental Fee",
                        value: selectedCar.rentalFee
                          ? `৳ ${selectedCar.rentalFee} / day`
                          : "Free",
                      },
                      { label: "Status", value: selectedCar.status },
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
                    onClick={() => setSelectedCar(null)}
                    className="w-full h-10 bg-base-200 hover:bg-base-300 rounded-xl text-sm font-medium text-base-content transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCars;
