import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoadingSpinner from "./components/LoadingSpinner";

const AuthLogin = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth?.status);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    // Handle undefined auth status
    if (authStatus === undefined) {
      return <div>Loading...</div>;
    }

    // Redirect based on authentication status
    if (authentication && authStatus !== authentication) {
      navigate("/");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/dashboard");
    }
    setLoader(false);
  }, [authStatus, authentication, navigate]);

  return loader ? (
    <>
      <Helmet>
        <title>Loading - Smart Energy Meter</title>
        <meta
          name="description"
          content="Loading page for Smart Energy Meter. Please wait while we authenticate your session."
        />
        <meta name="keywords" content="loading, authentication, Smart Energy Meter" />
      </Helmet>
      <LoadingSpinner />
    </>
  ) : (
    <>
      <Helmet>
        <title>Dashboard - Smart Energy Meter</title>
        <meta
          name="description"
          content="Dashboard page for Smart Energy Meter. Manage your profile and services."
        />
        <meta name="keywords" content="dashboard, profile, smart energy meter" />
      </Helmet>
      {children}
    </>
  );
};

export default AuthLogin;