import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const AdminAuth = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth?.status);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (authStatus === undefined) {
      return <div>Loading...</div>;
    }

    if (authentication && authStatus !== authentication) {
      navigate("/admin/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/admin/home");
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