import React from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import { Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="lg:overflow-hidden">
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
