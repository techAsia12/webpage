// routes.js
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "../pages/Layout.jsx";
import App from "../App";
import Login from "../pages/LoginPage.jsx";
import Signup from "../pages/SignupPage.jsx";
import Dashboard from "../pages/DashboardPage.jsx";
import Addphone from "../components/Login/Addphone.jsx";
import ForgotPassword from "../components/Login/ForgotPassword.jsx";
import Download from "../pages/DownloadPage.jsx";
import Contact from "../pages/ContactPage.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import CostRangePage from "../components/Admin/CostRange.jsx";
import BillDets from "../components/Admin/BillDets.jsx";
import Services from "../pages/ServicesPage.jsx";
import AdminSignup from "../components/Admin/AdminSignup.jsx";
import AdminAddPhone from "../components/Admin/AdminAddPhone.jsx";
import AdminLayout from "../pages/AdminLayout.jsx";
import HomePage from "../components/Admin/Home.jsx";
import AuthLogin from "../AuthLogin.jsx";
import AdminAuth from "../AdminAuth.jsx";
import LandingPage from "../pages/LandingPage.jsx";

export const routes = [
  {
    path: "/",
    element: (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <AuthLogin authentication>
            <Layout />
          </AuthLogin>
        ),
        children: [
          {
            path: "",
            element: (
              <AuthLogin authentication>
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
        path: "",
        element: <LandingPage />,
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
        element: <AdminPage />,
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
];