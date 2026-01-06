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

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }}></Navigate>;
  }

  return children;
};

export default PrivateRoute;
