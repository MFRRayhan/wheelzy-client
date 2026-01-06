import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import Loader from "../../components/Loader";

const WaitingForApproval = () => {
  const axiosSecure = useAxiosSecure(); // Ensure this sends Firebase token
  const [pendingCars, setPendingCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  // ---------------- FETCH PENDING CARS ----------------
  const fetchPendingData = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/cars?status=pending");
      setPendingCars(res.data);
    } catch (err) {
      console.error("Fetch pending cars error:", err.response?.data || err);
      Swal.fire("Error", "Failed to fetch pending cars", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  // ---------------- APPROVE / REJECT CAR ----------------
  const updateCarStatus = async (carId, status) => {
    if (!["approved", "rejected"].includes(status)) return;

    try {
      const res = await axiosSecure.patch(`/cars/${carId}/status`, { status });
      console.log("PATCH response:", res.data);

      Swal.fire(
        "Success",
        `Car ${status === "approved" ? "approved" : "rejected"} successfully`,
        "success"
      );

      // ✅ Pending list refresh
      setPendingCars((prev) => prev.filter((car) => car._id !== carId));
      setSelectedItem(null);
    } catch (err) {
      console.error("PATCH error:", err.response?.data || err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update car status",
        "error"
      );
    }
  };

  const filteredCars = pendingCars.filter(
    (car) =>
      car.carName.toLowerCase().includes(searchText.toLowerCase()) ||
      car.riderEmail.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="py-10 container mx-auto">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Pending Car Approval
        </h2>
        <div className="w-full md:w-80">
          <div className="input input-bordered flex items-center gap-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search Here..."
              className="grow"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table or No Data */}
      {filteredCars.length === 0 ? (
        <p className="text-center pt-30 text-2xl text-error font-bold">
          No pending cars
        </p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="table table-zebra  w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Rider Email</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car, i) => (
                <tr key={car._id}>
                  <td>{i + 1}</td>
                  <td>{car.carName}</td>
                  <td>{car.riderEmail}</td>
                  <td>{new Date(car.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => setSelectedItem(car)}
                      className="btn btn-square hover:btn-primary flex items-center gap-1"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => updateCarStatus(car._id, "approved")}
                      className="btn btn-square hover:btn-success flex items-center gap-1"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => updateCarStatus(car._id, "rejected")}
                      className="btn btn-square hover:btn-error flex items-center gap-1"
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
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setSelectedItem(null)}
          ></div>

          <div className="relative bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6 z-10 shadow-lg">
            {selectedItem.bannerImage && (
              <img
                src={selectedItem.bannerImage}
                alt={selectedItem.carName}
                className="w-full h-96 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-2xl font-bold mb-2">{selectedItem.carName}</h3>
            {selectedItem.description && (
              <p className="mb-2">
                <strong>Description:</strong> {selectedItem.description}
              </p>
            )}
            {selectedItem.carType && (
              <p className="mb-2">
                <strong>Car Type:</strong> {selectedItem.carType}
              </p>
            )}
            {selectedItem.location && (
              <p className="mb-2">
                <strong>Location:</strong> {selectedItem.location}
              </p>
            )}
            {selectedItem.rentalFee !== undefined && (
              <p className="mb-2">
                <strong>Rental Fee:</strong> BDT {selectedItem.rentalFee}
              </p>
            )}
            <p className="mb-2 capitalize">
              <strong>Status:</strong> {selectedItem.status}
            </p>
            <p className="mb-2">
              <strong>Rider Email:</strong> {selectedItem.riderEmail}
            </p>
            <p className="mb-2">
              <strong>Created At:</strong>{" "}
              {new Date(selectedItem.createdAt).toLocaleString()}
            </p>
            <p className="mb-2">
              <strong>Updated At:</strong>{" "}
              {new Date(selectedItem.updatedAt).toLocaleString()}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                className="btn btn-primary"
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

export default WaitingForApproval;
