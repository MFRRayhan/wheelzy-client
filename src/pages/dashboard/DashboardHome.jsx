import React from "react";
import useRole from "../../hooks/useRole";
import Loader from "../../components/Loader";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import RiderDashboard from "./RiderDashBoard";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loader></Loader>;
  }

  if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "rider") {
    return <RiderDashboard></RiderDashboard>;
  } else {
    return <UserDashboard></UserDashboard>;
  }
};

export default DashboardHome;
