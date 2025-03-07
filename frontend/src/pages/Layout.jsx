import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Update from "../components/Update.jsx";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavDial from "../components/Navbar/NavDial.jsx";

const Layout = () => {
  const [visibility, setVisibility] = useState("hidden");

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
    setVisibility(isUpdate ? "block" : "hidden");
  }, [isUpdate]);

  const mode = useSelector((state) => state.theme.mode);

  const backgroundClass =
    mode === "dark"
      ? "bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
      : "bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))]";

  return (
    <div
      className={`min-h-screen  ${backgroundClass} bg-cover bg-center lg:overflow-x-hidden  ${
        visibility === "block" ? "overflow-hidden" : ""
      }`}
    >
      <Navbar navLinks={navLinks} />
      <div className=" z-10 text-center">
        <Outlet />
        <div
          className={`fixed z-20  inset-0 backdrop-blur-sm ${visibility}`}
        >
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
