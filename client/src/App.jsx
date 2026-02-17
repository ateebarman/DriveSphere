import "./App.css";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeForm from "./components/HomeForm";
import { Login } from "./components/Login";
import DisplayCars from "./components/DisplayCars/DisplayCars";
import UserProfile from "./components/UserProfile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice"; // Adjust path as needed
import AdminDash from "./components/Admin Dash/AdminDash";
import CarOwnerDash from "./components/Owner Dash/CarOwnerDash";
import UserDash from "./components/User Dash/UserDash";
import AvailableCars from "./components/AvailableCars";
import BookingForm from "./components/BookingForm";
import PaymentComplete from "./components/PaymentComplete";
import UserBookingDetails from "./components/User Dash/UserBookingDetails";
import AppLayout from "./components/Layout/AppLayout";

function App() {
  const dispatch = useDispatch();

  // when page refresh, it will token in localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const token = user.token;
      const tokenExpiry = user.tokenExpiry;
      const currentTime = Date.now() / 1000;

      if (token && tokenExpiry > currentTime) {
        dispatch(setUser(user));
      } else {
        localStorage.removeItem("user"); // Remove user if token has expired
      }
    }
  }, [dispatch]);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <HomeForm />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/userdash",
          element: <UserDash />,
        },
        {
          path: "/admindash",
          element: <AdminDash />,
        },
        {
          path: "/carownerdash",
          element: <CarOwnerDash />,
        },
        {
          path: "/cards",
          element: <DisplayCars />,
        },
        {
          path: "/userprofile",
          element: <UserProfile />,
        },
        {
          path: "/availablecars",
          element: <AvailableCars />,
        },
        {
          path: "/bookingpage",
          element: <BookingForm />,
        },
        {
          path: "/completed",
          element: <PaymentComplete />,
        },
        {
          path: "/userbookings",
          element: <UserBookingDetails />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster />
    </>
  );
}

export default App;
