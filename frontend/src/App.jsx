import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeTheme } from "./Features/theme/theme.slice";

function App() {
  const dispatch = useDispatch();

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Outlet />
    </GoogleOAuthProvider>
  );
}

export default App;
