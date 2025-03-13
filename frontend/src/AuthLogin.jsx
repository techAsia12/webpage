import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

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
        <title>Loading - Your App Name</title>
        <meta
          name="description"
          content="Loading page for Your App Name. Please wait while we authenticate your session."
        />
        <meta name="keywords" content="loading, authentication, your app name" />
      </Helmet>
      <h1>Loading......</h1>
    </>
  ) : (
    <>
      <Helmet>
        <title>Dashboard - Your App Name</title>
        <meta
          name="description"
          content="Dashboard page for Your App Name. Manage your profile and services."
        />
        <meta name="keywords" content="dashboard, profile, your app name" />
      </Helmet>
      {children}
    </>
  );
};

export default AuthLogin;