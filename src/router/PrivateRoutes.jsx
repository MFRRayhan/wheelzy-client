import { Navigate, useLocation } from "react-router";
import Loader from "../components/Loader";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // console.log(location);

  if (loading) {
    return <Loader></Loader>;
  }

  if (user) return children;

  return <Navigate to={"/login"} state={location?.pathname}></Navigate>;
};

export default PrivateRoute;
