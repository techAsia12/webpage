import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeTheme } from "./Features/theme/theme.slice";

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");

    if (mode === "dark") {
      document.body.style.backgroundImage =
        "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))";
      document.body.style.backgroundColor = "";
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#FFFFFF";
    }
  }, [mode]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Outlet />
    </GoogleOAuthProvider>
  );
}

export default App;
