import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import { FaEye, FaTrash, FaSearch } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

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

  if (isLoading) return <Loader />;

  // 🔍 Search filter
  const filteredCars = cars.filter((car) =>
    `${car.carName} ${car.carType} ${car.location}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDelete = (car) => {
    Swal.fire({
      title: "Delete Car?",
      text: `Are you sure you want to delete ${car.carName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/cars/${car._id}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire("Deleted!", "Car has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">Manage Cars</h2>
        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search car..."
              className="grow"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
              <th>Car</th>
              <th>Rider Email</th>
              <th>Type</th>
              <th>Location</th>
              <th>Rental Fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCars.length > 0 ? (
              paginatedCars.map((car, index) => (
                <tr key={car._id}>
                  <td>{startIndex + index + 1}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={car.bannerImage}
                        alt="car"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <p className="font-semibold">{car.carName}</p>
                    </div>
                  </td>
                  <td>{car.riderEmail}</td>
                  <td>{car.carType}</td>
                  <td>{car.location}</td>
                  <td>
                    <div className="flex items-center gap-1 font-medium">
                      {car.rentalFee === 0 ? (
                        "Free"
                      ) : (
                        <>
                          <FaBangladeshiTakaSign />
                          <span>{car.rentalFee} / day</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge capitalize text-white ${
                        car.status === "approved"
                          ? "badge-success"
                          : car.status === "pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {car.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-square hover:btn-primary"
                        onClick={() => setSelectedCar(car)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-square hover:btn-error hover:text-white"
                        onClick={() => handleDelete(car)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-2xl text-error font-semibold"
                >
                  No cars found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-primary" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedCar && (
        <dialog open className="modal">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-xl mb-4 text-center">Car Details</h3>
            <img
              src={selectedCar.bannerImage}
              alt="banner"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p>
              <strong>Name:</strong> {selectedCar.carName}
            </p>
            <p>
              <strong>Type:</strong> {selectedCar.carType}
            </p>
            <p>
              <strong>Location:</strong> {selectedCar.location}
            </p>
            <p className="flex items-center gap-1">
              <strong>Rental Fee:</strong> <FaBangladeshiTakaSign />{" "}
              {selectedCar.rentalFee}
            </p>
            <p>
              <strong>Status:</strong> {selectedCar.status}
            </p>
            <p>
              <strong>Description:</strong> {selectedCar.description}
            </p>

            <div className="modal-action">
              <button
                className="btn btn-error text-white"
                onClick={() => setSelectedCar(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageCars;
