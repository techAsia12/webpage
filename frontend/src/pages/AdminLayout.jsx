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
    <div className="lg:overflow-hidden dark:bg-gray-800 dark:text-white top-0">
      <Navbar navLinks={navLinks} />
      <div className="content-container z-10 dark:bg-gray-800 dark:text-white justify-center  overflow-hidden flex">
        <Outlet />
        <div className={`z-20 absolute backdrop-blur-sm ${visibility}`}>
          <Update />
        </div>
        <div
          className={`z-20 absolute backdrop-blur-sm ${billVisibility}`}
        >
          <AddDets />
        </div>
        <div
          className={`z-20 absolute backdrop-blur-sm ${costRangeVisibility}`}
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
