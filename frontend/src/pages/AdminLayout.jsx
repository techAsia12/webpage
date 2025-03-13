import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import Update from "../components/Update.jsx";
import { useSelector } from "react-redux";
import AddDets from "../components/Admin/AddDets.jsx";
import CostRangePage from "../components/Admin/CostRange.jsx";
import NavDial from "../components/Navbar/NavDial.jsx";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";

/**
 * AdminLayout Component
 * 
 * The layout component for the admin dashboard. It includes a navbar, a floating action button (FAB),
 * and dynamic overlays for updating user details, adding bill details, and setting cost ranges.
 * 
 * @returns {JSX.Element} - Rendered AdminLayout component
 */
const AdminLayout = () => {
  const [visibility, setVisibility] = useState("hidden");
  const [billVisibility, setBillVisibility] = useState("hidden");
  const [costRangeVisibility, setCostRangeVisibility] = useState("hidden");

  const mode = useSelector((state) => state.theme.mode);
  const isUpdate = useSelector((state) => state.pages?.isUpdate);
  const isbill = useSelector((state) => state.pages?.isbill);
  const isCostRange = useSelector((state) => state.pages?.isCostRange);

  // Dynamic background class based on theme
  const backgroundClass =
    mode === "dark"
      ? "bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
      : "bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))]";

  // Navigation links for the navbar
  const navLinks = [
    { path: "/admin/home", label: "Home" },
    { path: "/admin/home/billdets", label: "BillDets" },
  ];

  // Actions for the floating action button (FAB)
  const actions = [
    { icon: <HomeIcon />, name: "Home", path: "/admin/home" },
    { icon: <ArticleIcon />, name: "BillDets", path: "/admin/home/billdets" },
  ];

  // Update visibility states based on Redux state changes
  useEffect(() => {
    setVisibility(isUpdate ? "block" : "hidden");
  }, [isUpdate]);

  useEffect(() => {
    setBillVisibility(isbill ? "block" : "hidden");
  }, [isbill]);

  useEffect(() => {
    setCostRangeVisibility(isCostRange ? "block" : "hidden");
  }, [isCostRange]);

  return (
    <div
      className={`min-h-screen ${backgroundClass} bg-cover bg-center overflow-hidden ${
        visibility === "block" ? "overflow-hidden" : ""
      }`}
    >
      {/* Navbar */}
      <Navbar navLinks={navLinks} />

      {/* Main Content */}
      <div className="z-10 text-center">
        <Outlet />

        {/* Overlay for Update Component */}
        <div className={`fixed z-20 inset-0 backdrop-blur-sm ${visibility}`}>
          <Update />
        </div>

        {/* Overlay for AddDets Component */}
        <div className={`fixed z-20 inset-0 backdrop-blur-sm ${billVisibility}`}>
          <AddDets />
        </div>

        {/* Overlay for CostRangePage Component */}
        <div className={`fixed z-20 inset-0 backdrop-blur-sm ${costRangeVisibility}`}>
          <CostRangePage />
        </div>
      </div>

      {/* Floating Action Button (FAB) for Mobile */}
      <div className="lg:hidden">
        <NavDial actions={actions} />
      </div>
    </div>
  );
};

export default AdminLayout;