import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeTheme } from "./Features/theme/theme.slice";

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const authStatus = useSelector((state) => state.auth?.status);
  const navigate = useNavigate();
  console.log("authStatus", authStatus);

  // Initialize theme on component mount
  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    if (authStatus === true) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [authStatus, navigate]);

  // Apply theme styles based on the current theme mode
  useEffect(() => {
    const isDarkMode = themeMode === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode);

    if (isDarkMode) {
      document.body.style.backgroundImage =
        "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))";
      document.body.style.backgroundColor = "";
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#FFFFFF";
    }
  }, [themeMode]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      {/* Add SEO Meta Tags */}
      <head>
        <title>Your App Title</title>
        <meta name="description" content="Your app description for SEO." />
        <meta name="keywords" content="your, keywords, here" />
        <meta name="author" content="Your Name" />
        <meta property="og:title" content="Your App Title" />
        <meta
          property="og:description"
          content="Your app description for SEO."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourapp.com" />
        <meta property="og:image" content="https://yourapp.com/logo.png" />
      </head>

      {/* Render the nested routes */}
      <Outlet />
    </GoogleOAuthProvider>
  );
}

export default App;
