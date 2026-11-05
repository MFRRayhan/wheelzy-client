import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import {
  FaLocationDot,
  FaUser,
  FaBangladeshiTakaSign,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { BsFuelPumpDiesel } from "react-icons/bs";
import CarCard from "../components/CarCard";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Cars = ({ isFeatured = false }) => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["public-cars"],
    queryFn: async () => {
      const res = await axiosSecure.get("/cars");
      return res.data;
    },
  });

  if (isLoading) return <Loader fullScreen={false} />;

  const approvedCars = cars.filter((car) => car.status === "approved");

  const filteredCars = approvedCars
    .filter((car) =>
      (car.carName || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = isFeatured
    ? filteredCars.slice(0, 8)
    : filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      className={`max-w-7xl pt-30 mx-auto px-4 sm:px-6 ${
        isFeatured ? "py-20" : "py-12"
      }`}
    >
      {/* ── Section header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-10">
        <div>
          {isFeatured && (
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2">
              Featured
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content">
            {isFeatured ? "Featured Cars" : "Explore All Cars"}
          </h2>
          {!isFeatured && (
            <p className="text-sm text-base-content/50 mt-1">
              {filteredCars.length} cars available
            </p>
          )}
        </div>

        {!isFeatured && (
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30 text-sm pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-11 pl-10 pr-4 bg-base-100 border border-base-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        )}
      </div>

      {/* ── Cars grid ── */}
      {currentCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center mb-4">
            <BsFuelPumpDiesel className="text-base-content/30" size={28} />
          </div>
          <p className="text-base-content/60 font-medium">No cars found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <motion.div
          key={`page-${currentPage}-${searchTerm}`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {currentCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </motion.div>
      )}

      {/* ── Pagination ── */}
      {!isFeatured && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-base-300 flex items-center justify-center text-base-content/60 hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <FaChevronLeft size={13} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            // Show limited range
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-content shadow-sm"
                      : "border border-base-300 text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  {page}
                </button>
              );
            }
            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span
                  key={page}
                  className="w-10 h-10 flex items-center justify-center text-base-content/30 text-sm"
                >
                  …
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border border-base-300 flex items-center justify-center text-base-content/60 hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <FaChevronRight size={13} />
          </button>
        </div>
      )}

      {/* ── Featured "View All" ── */}
      {isFeatured && filteredCars.length > 8 && (
        <div className="text-center mt-10">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 bg-primary text-primary-content font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm hover:shadow-md"
          >
            View All Cars
            <FaArrowRight size={13} />
          </Link>
        </div>
      )}
    </section>
  );
};

export default Cars;
