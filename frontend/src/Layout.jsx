import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Update from "./components/Update.jsx";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavDial from "./components/Navbar/NavDial.jsx";

const Layout = () => {
  const [visibility, setVisibility] = useState();

  const navLinks = [
    { path: "/dashboard", label: "Home" },
    { path: "/dashboard/services", label: "Usage" },
    { path: "/dashboard/about", label: "Download" },
    { path: "/dashboard/contact", label: "Contact" },
  ];

  const actions = [
    { icon: <HomeIcon />, name: "Home", path: "/dashboard" },
    { icon: <TimelineIcon />, name: "Usage", path: "/dashboard/services" },
    { icon: <InfoIcon />, name: "About", path: "/dashboard/about" },
    { icon: <LocationOnIcon />, name: "Contact", path: "/dashboard/contact" },
  ];

  const isUpdate = useSelector((state) => state.pages?.isUpdate);

  useEffect(() => {
    if (isUpdate === true) {
      setVisibility("block");
    } else {
      setVisibility("hidden");
    }
  }, [isUpdate]);

  return (
    <div className="lg:overflow-hidden dark:bg-gray-800 top-0">
      <Navbar navLinks={navLinks} />
      <div className="container lg:overflow-hidden dark:bg-gray-800  z-10 flex lg:ml-20">
        <Outlet />
        <div className={`z-20 absolute backdrop-blur-sm ${visibility}`}>
          <Update />
        </div>
      </div>
      <div className="lg:hidden bottom-0 right-0 sticky">
        <NavDial actions={actions} />
      </div>
    </div>
  );
};

export default Layout;
