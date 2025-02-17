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
    { path: "/dashboard/about", label: "About" },
    { path: "/dashboard/services", label: "Usage" },
    { path: "/dashboard/contact", label: "Contact" },
  ];

  const actions = [
    { icon: <HomeIcon />, name: "Home", path: "/dashboard" },
    { icon: <InfoIcon />, name: "About", path: "/dashboard/about" },
    { icon: <TimelineIcon />, name: "Usage", path: "/dashboard/services" },
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
      <div className="content-container dark:bg-gray-800 overflow-hidden ">
        <Outlet />
        <div className="lg:hidden">
          <NavDial actions={actions} />
        </div>
      </div>
      <div
        className={`z-10 h-full md:-translate-y-[850px] -translate-y-[300px] lg:-translate-y-[100px] flex justify-center items-center backdrop-blur-sm ${visibility} overflow-hidden `}
      >
        <Update />
      </div>
    </div>
  );
};

export default Layout;
