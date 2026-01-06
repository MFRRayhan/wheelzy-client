import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ITEMS_PER_PAGE = 10;

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

  if (isLoading) return <Loader />;

  /* ---------- SAFE FILTER ---------- */
  const safeCars = cars.filter((car) => car && car._id && car.carName);

  const filteredCars = safeCars.filter((car) =>
    car.carName.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ---------- BADGE ---------- */
  const badge = (status) => {
    const base = "badge capitalize text-white font-semibold";
    if (status === "approved")
      return <span className={`${base} badge-success`}>{status}</span>;
    if (status === "pending")
      return <span className={`${base} badge-warning`}>{status}</span>;
    if (status === "rejected")
      return <span className={`${base} badge-error`}>{status}</span>;
    return <span className={`${base} badge-neutral`}>{status}</span>;
  };

  /* ---------- MODAL ---------- */
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

  /* ---------- DELETE ---------- */
  const handleDelete = async (car) => {
    if (!car || !car._id) return;

    const res = await Swal.fire({
      title: "Delete Car?",
      text: `Delete "${car.carName}" permanently?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (res.isConfirmed) {
      await axiosSecure.delete(`/cars/${car._id}`);
      refetch();
      Swal.fire("Deleted", "Car deleted successfully", "success");
    }
  };

  /* ---------- UPDATE ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedCar || !selectedCar._id) return;

    await axiosSecure.patch(`/cars/${selectedCar._id}`, formData);
    refetch();
    closeModal();
    Swal.fire("Updated", "Car updated successfully", "success");
  };

  return (
    <div className="py-10 container mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">My Managed Cars</h2>

        <input
          type="text"
          placeholder="Search car..."
          className="input input-bordered w-full md:w-72"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Index</th>
              <th>Car</th>
              <th>Status</th>
              <th>Type</th>
              <th>Price / Day</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCars.map((car, i) => (
              <tr key={car._id}>
                <td>{startIndex + i + 1}</td>
                <td className="font-semibold">{car.carName}</td>
                <td>{badge(car.status)}</td>
                <td>{car.carType || "N/A"}</td>
                <td className="flex items-center gap-1">
                  <FaBangladeshiTakaSign />
                  {car.rentalFee || 0}
                </td>
                <td>{car.location || "N/A"}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => openModal(car, "view")}
                    className="btn btn-square hover:btn-primary"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => openModal(car, "edit")}
                    className="btn btn-square hover:btn-warning hover:text-white"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(car)}
                    className="btn btn-square hover:btn-error hover:text-white"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {!paginatedCars.length && (
              <tr>
                <td colSpan="7" className="text-center py-10 text-error">
                  No cars found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n + 1)}
              className={`btn btn-sm ${
                currentPage === n + 1 ? "btn-primary" : ""
              }`}
            >
              {n + 1}
            </button>
          ))}

          <button
            className="btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* VIEW MODAL */}
      {mode === "view" && selectedCar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">{selectedCar.carName}</h3>
            <img
              src={selectedCar.bannerImage}
              className="rounded mb-3"
              alt=""
            />
            <p>{selectedCar.description}</p>
            <div className="text-right mt-4">
              <button className="btn btn-error" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {mode === "edit" && selectedCar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Edit Car</h3>

            {["carName", "location", "rentalFee", "carType"].map((f) => (
              <input
                key={f}
                name={f}
                value={formData[f]}
                onChange={handleChange}
                className="input input-bordered w-full mb-3"
                placeholder={f}
              />
            ))}

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Description"
            />

            <div className="flex justify-end gap-2">
              <button className="btn btn-error" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyManagedCars;
