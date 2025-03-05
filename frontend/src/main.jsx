import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import App from "./App";
import Login from "./components/Login/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard.jsx";
import Addphone from "./components/Login/Addphone";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgotPassword from "./components/Login/ForgotPassword";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "./app/store.js";
import Download from "./components/Download.jsx";
import Contact from "./components/Contact.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CostRangePage from "./components/Admin/CostRange.jsx";
import BillDets from "./components/Admin/BillDets.jsx";
import Services from "./components/Services.jsx";
import AdminSignup from "./components/Admin/AdminSignup.jsx";
import AdminAddPhone from "./components/Admin/AdminAddPhone.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";
import HomePage from "./components/Admin/Home.jsx";
import AuthLogin from "./AuthLogin.jsx";
import { PersistGate } from "redux-persist/integration/react";
import AdminAuth from "./AdminAuth.jsx";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/LandingPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID} >
        <App />
      </GoogleOAuthProvider>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <AuthLogin authentication>
            <Provider store={store}>
              <Layout />
            </Provider>
          </AuthLogin>
        ),
        children: [
          {
            path: "",
            element: (
              <AuthLogin authentication >
                <Dashboard />
              </AuthLogin>
            ),
          },
          {
            path: "/dashboard/about",
            element: <Download />,
          },
          {
            path: "/dashboard/contact",
            element: <Contact />,
          },
          {
            path: "/dashboard/services",
            element: <Services />,
          },
        ],
      },
      {
        path:"",
        element:<LandingPage/>
      },
      {
        path: "/register",
        element: <Signup />,
      },
      {
        path: "/login",
        element: (
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <Login />
          </GoogleOAuthProvider>
        ),
      },
      {
        path: "/add-phone",
        element: <Addphone />,
      },
      {
        path: "/reset-password",
        element: <ForgotPassword />,
      },
      {
        path: "/range",
        element: <CostRangePage />,
      },
      {
        path: "/admin",
        element: (
              <AdminPage />
        ),
        children: [
          {
            path: "/admin/register",
            element: <AdminSignup />,
          },
          {
            path: "/admin/add-phone",
            element: <AdminAddPhone />,
          },
          {
            path: "/admin/home",
            element: (
              <AdminAuth authentication>
                <AdminLayout />
              </AdminAuth>
            ),
            children: [
              {
                path: "",
                element: (
                  <AdminAuth>
                    <HomePage />
                  </AdminAuth>
                ),
              },
              {
                path: "/admin/home/billdets",
                element: <BillDets />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
      />
    </Provider>
  </StrictMode>
);
