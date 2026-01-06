import { createBrowserRouter } from "react-router";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import RootLayout from "../layouts/RootLayout";
import Cars from "../pages/Cars";
import Dashboard from "../layouts/Dashboard";
import PrivateRoute from "./PrivateRoutes";
import DashboardHome from "../pages/dashboard/DashboardHome";
import Settings from "../pages/dashboard/Settings";
import CarDetails from "../pages/CarDetails";
import AddACar from "../pages/dashboard/AddACar";
import CarMembers from "../pages/dashboard/CarMembers";
import ManageUsers from "../pages/dashboard/ManageUsers";
import ManageCars from "../pages/dashboard/ManageCars";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import MyCars from "../pages/dashboard/MyCars";
import MyManagedCars from "../pages/dashboard/MyManagedCars";
import AllPaymentHistory from "../pages/dashboard/AllPaymentHistory";
import RiderPayments from "../pages/dashboard/RiderPayments";
import WaitingForApproval from "../pages/dashboard/WaitingForApproval";
import AdminRoute from "../router/AdminRoute";
import RiderRoute from "./RiderRoute";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import RiderDashboard from "../pages/dashboard/RiderDashboard";
import RiderRentals from "../pages/dashboard/RiderRentals";
import BeARider from "../pages/dashboard/BeARider";
import RideRequests from "../pages/dashboard/RideRequests";
import AboutUs from "../pages/AboutUs";
import Services from "../pages/Services";
import ContactUs from "../pages/ContactUs";
import PendingRiderRequests from "../pages/dashboard/PendingRiderRequests";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "cars",
        Component: Cars,
      },
      {
        path: "cars/:id",
        element: <CarDetails />,
      },
      {
        path: "about",
        Component: AboutUs,
      },
      {
        path: "services",
        Component: Services,
      },
      {
        path: "contact",
        Component: ContactUs,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "forgot-password",
        Component: ForgotPassword,
      },
      {
        path: "be-a-rider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        // Component: Profile,
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      // Admin Routes
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "manage-cars",
        // Component: ManageCars,
        element: (
          <AdminRoute>
            <ManageCars></ManageCars>
          </AdminRoute>
        ),
      },
      {
        path: "waiting-for-approval",
        // Component: WaitingForApproval,
        element: (
          <AdminRoute>
            <WaitingForApproval></WaitingForApproval>
          </AdminRoute>
        ),
      },
      {
        path: "pending-rider-requests",
        element: (
          <AdminRoute>
            <PendingRiderRequests></PendingRiderRequests>
          </AdminRoute>
        ),
      },
      {
        path: "all-payments",
        // Component: AllPaymentHistory,
        element: (
          <AdminRoute>
            <AllPaymentHistory></AllPaymentHistory>
          </AdminRoute>
        ),
      },

      /* -------------------------------------------------------------------------- */

      // car rider routes
      {
        path: "my-managed-cars",
        // Component: MyManagedCars,
        element: (
          <RiderRoute>
            <MyManagedCars></MyManagedCars>
          </RiderRoute>
        ),
      },
      // {
      //   path: "car-members",
      //   // Component: CarMembers,
      //   element: (
      //     <RiderRoute>
      //       <CarMembers></CarMembers>
      //     </RiderRoute>
      //   ),
      // },
      {
        path: "add-car",
        element: (
          <RiderRoute>
            <AddACar></AddACar>
          </RiderRoute>
        ),
      },
      {
        path: "rider-payments",
        element: (
          <RiderRoute>
            <RiderPayments></RiderPayments>
          </RiderRoute>
        ),
      },
      {
        path: "ride-requests",
        element: (
          <RiderRoute>
            <RideRequests></RideRequests>
          </RiderRoute>
        ),
      },

      /* -------------------------------------------------------------------------- */

      {
        path: "my-cars",
        Component: MyCars,
      },
      {
        path: "payments",
        Component: PaymentHistory,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
