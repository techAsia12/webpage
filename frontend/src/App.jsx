import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID} >
        <Outlet />
    </GoogleOAuthProvider>
  );
}

export default App;
