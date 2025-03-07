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

const AdminLayout = () => {
  const [visibility, setVisibility] = useState();
  const [billVisibility, setBillVisibility] = useState();
  const [costRangeVisibility, setCostRangeVisibility] = useState();
  const mode = useSelector((state) => state.theme.mode);

  const backgroundClass =
    mode === "dark"
      ? "bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
      : "bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))]";

  const navLinks = [
    { path: "/admin/home", label: "Home" },
    { path: "/admin/home/billdets", label: "BillDets" },
  ];

  const actions = [
    { icon: <HomeIcon />, name: "Home", path: "/admin/home" },
    { icon: <ArticleIcon />, name: "BillDets", path: "/admin/home/billdets" },
  ];

  const isUpdate = useSelector((state) => state.pages?.isUpdate);
  const isbill = useSelector((state) => state.pages?.isbill);
  const isCostRange = useSelector((state) => state.pages?.isCostRange);

  useEffect(() => {
    if (isUpdate === true) {
      setVisibility("block");
    } else {
      setVisibility("hidden");
    }
  }, [isUpdate]);

  useEffect(() => {
    if (isbill === true) {
      setBillVisibility("block");
    } else {
      setBillVisibility("hidden");
    }
  }, [isbill]);

  useEffect(() => {
    if (isCostRange === true) {
      setCostRangeVisibility("block");
    } else {
      setCostRangeVisibility("hidden");
    }
  }, [isCostRange]);

  console.log(costRangeVisibility);
  return (
    <div
      className={`min-h-screen  ${backgroundClass} bg-cover bg-center overflow-hidden  ${
        visibility === "block" ? "overflow-hidden" : ""
      }`}
    >
      <Navbar navLinks={navLinks} />
      <div className="z-10 text-center">
        <Outlet />
        <div className={`fixed z-20  inset-0 backdrop-blur-sm ${visibility}`}>
          <Update />
        </div>
        <div
          className={`fixed z-20  inset-0 backdrop-blur-sm ${billVisibility}`}
        >
          {" "}
          <AddDets />
        </div>
        <div
          className={`fixed z-20  inset-0 backdrop-blur-sm ${costRangeVisibility}`}
        >
          <CostRangePage />
        </div>
      </div>
      <div className="lg:hidden ">
        <NavDial actions={actions} />
      </div>
    </div>
  );
};

export default AdminLayout;
