import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loader from "../components/Loader";
import Forbidden from "../pages/Forbidden";

const MemberRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loader></Loader>;
  }

  if (role !== "member") {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default MemberRoute;
