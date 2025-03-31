import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

const AdminAuth = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth?.status);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    // Check if current path is the exception
    const isRegisterPath = location.pathname === "/admin/register";

    if (authStatus === undefined) {
      return <div>Loading...</div>;
    }

    // Skip authentication check for register path
    if (isRegisterPath) {
      setLoader(false);
      return;
    }

    if (authentication && authStatus !== authentication) {
      navigate("/");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/admin/home");
    }
    setLoader(false);
  }, [authStatus, authentication, navigate, location.pathname]);

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
        <title>Admin - Your App Name</title>
        <meta
          name="description"
          content="Admin page for Your App Name. Manage your services and users."
        />
        <meta name="keywords" content="admin, management, your app name" />
      </Helmet>
      {children}
    </>
  );
};

export default AdminAuth;