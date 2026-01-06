import React, { useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/Loader";
import {
  FaLocationDot,
  FaUser,
  FaDollarSign,
  FaBangladeshiTakaSign,
} from "react-icons/fa6";
import { FaCar, FaSearch } from "react-icons/fa";
import { BsFuelPumpDiesel } from "react-icons/bs";

const Cars = ({ isFeatured = false }) => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await axiosSecure.get("/cars");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  const approvedCars = cars.filter((car) => car.status === "approved");

  const filteredCars = approvedCars
    .filter((car) =>
      (car.carName || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Pagination calculations
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = isFeatured
    ? filteredCars.slice(0, 8)
    : filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <section className="container mx-auto py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
          <FaCar /> {isFeatured ? "Featured Cars" : "Explore Cars"}
        </h2>

        {!isFeatured && (
          <form
            className="relative w-full md:w-80"
            onSubmit={(e) => e.preventDefault()}
          >
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-2" />
            <input
              type="text"
              placeholder="Search cars by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="input input-bordered w-full pl-10"
            />
          </form>
        )}
      </div>

      {/* Cars Grid */}
      {currentCars.length === 0 ? (
        <p className="text-center text-gray-500">No cars found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentCars.map((car) => (
            <div
              key={car._id}
              className="group rounded overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-300 p-4 relative"
            >
              <div className="relative h-52 overflow-hidden rounded-lg">
                <img
                  src={car.bannerImage || "/placeholder.jpg"}
                  alt={car.carName || "Car Image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 right-3 px-4 py-2 text-xs font-semibold rounded-md bg-primary text-white cursor-pointer">
                  {car.isBooked ? "Booked" : "Available"}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-semibold">{car.carName}</h3>

                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1 text-sm font-medium ">
                    <FaBangladeshiTakaSign className="text-primary text-base" />
                    {car.rentalFee ? (
                      <>
                        <span>{car.rentalFee}</span>
                        <span className="text-gray-500 text-xs ml-1">
                          / day
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </p>

                  {/* Fuel Type */}
                  <p className="flex items-center gap-1 text-sm font-medium">
                    <BsFuelPumpDiesel className="text-primary text-base" />
                    <span>{car.carType || "General"}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {/* Rider Name */}
                  {car.riderName && (
                    <p className="flex items-center gap-1 text-sm font-medium ">
                      <FaUser className="text-primary text-base" />
                      <span>{car.riderName}</span>
                    </p>
                  )}

                  {/* Location */}
                  <p className="flex items-center gap-1 text-sm font-medium ">
                    <FaLocationDot className="text-primary text-base" />
                    <span>{car.location || "Location not specified"}</span>
                  </p>
                </div>

                <Link
                  to={`/cars/${car._id}`}
                  className="btn btn-primary w-full mt-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isFeatured && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 items-center">
          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border-2 border-base-300 rounded cursor-pointer ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 disabled:cursor-not-allowed"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 border-2 border-base-300 rounded cursor-pointer ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border-2 border-base-300 rounded cursor-pointer ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 disabled:cursor-not-allowed"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Featured "View All" */}
      {isFeatured && (
        <div className="text-center mt-8">
          <Link to="/cars" className="btn btn-primary">
            View All Cars
          </Link>
        </div>
      )}
    </section>
  );
};

export default Cars;
