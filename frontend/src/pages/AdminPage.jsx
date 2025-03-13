import React from "react";
import { Outlet } from "react-router-dom";

/**
 * AdminPage Component
 * 
 * A layout component for the admin page. It serves as a container for nested routes
 * rendered via the `Outlet` component from React Router.
 * 
 * @returns {JSX.Element} - Rendered AdminPage component
 */
const AdminPage = () => {
  return (
    <div className="min-h-screen lg:overflow-hidden">
      {/* Main Content Area */}
      <div className="content-container">
        {/* Render nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;