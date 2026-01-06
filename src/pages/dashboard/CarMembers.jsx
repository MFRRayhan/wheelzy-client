import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";

const CarMembers = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Fetch cars
  useEffect(() => {
    axiosSecure.get("/my-cars").then((res) => {
      setCars(res.data);
    });
  }, [axiosSecure]);

  // Fetch members for a selected car
  const handleLoadMembers = async (carId) => {
    setSelectedCar(carId);
    setLoading(true);
    const res = await axiosSecure.get(`/manager/car-members/${carId}`);
    setMembers(res.data);
    setFilteredMembers(res.data);
    setLoading(false);
  };

  // Filter members dynamically based on search input
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((m) => {
        const nameMatch = m.userInfo.displayName
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const emailMatch = m.userEmail
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        return nameMatch || emailMatch;
      });
      setFilteredMembers(filtered);
    }
  }, [searchText, members]);

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-primary font-bold mb-4">Car Members</h2>

        {/* Car Selector */}
        <div className="flex justify-center gap-4 mb-4">
          <select
            className="select select-bordered w-full max-w-md"
            onChange={(e) => handleLoadMembers(e.target.value)}
          >
            <option value="">Select a car</option>
            {cars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.carName}
              </option>
            ))}
          </select>

          {/* Search Input */}
          {selectedCar && members.length > 0 && (
            <input
              type="text"
              placeholder="Search members..."
              className="input input-bordered w-full max-w-md"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Members Table */}
      {loading && <Loader />}

      {!loading && filteredMembers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Member</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, index) => (
                <tr key={m._id}>
                  <td>{index + 1}</td>
                  <td>{m.userInfo.displayName}</td>
                  <td>{m.userEmail}</td>
                  <td>{new Date(m.purchaseDate).toLocaleDateString()}</td>
                  <td>
                    <b>BDT.</b> {m.membershipFee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && selectedCar && filteredMembers.length === 0 && (
        <p className="text-2xl text-center font-semibold text-error">
          No members found.
        </p>
      )}
    </div>
  );
};

export default CarMembers;
