import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useRole from "../../hooks/useRole";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaUserShield,
  FaUserMinus,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading } = useRole();

  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?searchText=${searchText}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  if (role !== "admin") {
    return (
      <div className="text-center text-2xl text-red-500 py-10">
        Access Denied: Only Admin Can Manage Users
      </div>
    );
  }

  const handleChangeRole = (user, newRole) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Change role of ${user.displayName} to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/${user._id}/role`, { role: newRole })
          .then((res) => {
            if (res.data.modifiedCount) {
              refetch();
              Swal.fire(
                "Success!",
                `${user.displayName}'s role updated to ${newRole}.`,
                "success"
              );
            }
          })
          .catch((err) => {
            Swal.fire("Error!", "Failed to update role.", "error");
            console.error(err);
          });
      }
    });
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${user.displayName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/users/${user._id}`)
          .then((res) => {
            if (res.data.deletedCount) {
              refetch();
              Swal.fire("Deleted!", "User has been removed.", "success");
            }
          })
          .catch((err) => {
            Swal.fire("Error!", "Failed to delete user.", "error");
            console.error(err);
          });
      }
    });
  };

  const roleBadge = (role) => {
    if (role === "admin") return "bg-green-500";
    if (role === "rider") return "bg-yellow-500";
    return "bg-blue-500"; // user
  };

  return (
    <div className="container mx-auto">
      <div className="py-10 ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-primary">Manage Users</h2>
          <div className="w-full md:w-80">
            <div className="input input-bordered flex items-center gap-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search User..."
                className="grow"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Index</th>
                <th>User</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        referrerPolicy="no-referrer"
                        src={user.photoURL}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border-2 border-primary object-cover object-top"
                      />
                      <div>
                        <div className="font-semibold">{user.displayName}</div>
                      </div>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                  <td>
                    <span
                      className={`text-white capitalize px-3 py-1 rounded-full text-sm ${roleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="flex gap-2">
                      {/* View */}
                      <div className="tooltip" data-tip="View User">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="btn btn-square hover:btn-primary"
                        >
                          <FaEye />
                        </button>
                      </div>

                      {user.role !== "admin" && (
                        <div className="tooltip" data-tip="Make Admin">
                          <button
                            onClick={() => handleChangeRole(user, "admin")}
                            className="btn btn-square hover:text-white hover:btn-success"
                          >
                            <FaUserShield />
                          </button>
                        </div>
                      )}

                      {user.role !== "rider" && (
                        <div className="tooltip" data-tip="Make Rider">
                          <button
                            onClick={() => handleChangeRole(user, "rider")}
                            className="btn btn-square hover:text-white hover:btn-warning"
                          >
                            <FaUserMinus />
                          </button>
                        </div>
                      )}

                      {user.role !== "user" && (
                        <div className="tooltip" data-tip="Make User">
                          <button
                            onClick={() => handleChangeRole(user, "user")}
                            className="btn btn-square hover:text-white hover:btn-info"
                          >
                            <FaUser />
                          </button>
                        </div>
                      )}

                      <div className="tooltip" data-tip="Delete User">
                        <button
                          onClick={() => handleDelete(user)}
                          className="btn btn-square hover:btn-error hover:text-white"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* USER DETAILS MODAL */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-2xl"
                onClick={() => setSelectedUser(null)}
              >
                &times;
              </button>

              <h3 className="text-xl font-bold mb-4 text-center">
                User Details
              </h3>

              <img
                src={selectedUser.photoURL}
                alt="avatar"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />

              <div className="space-y-2 text-center">
                <p>
                  <strong>Name:</strong> {selectedUser.displayName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="capitalize">
                  <strong>Role:</strong> {selectedUser.role}
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-error"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
