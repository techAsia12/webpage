import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Drawer } from "@mui/material";
import Sidebar from "./Sidebar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { costRangePage, drawerToogle } from "../../Features/pages/pages.slice.js";
import { motion } from "motion/react";
import ThemeToggle from "../ThemeToogle.jsx";
import axios from "axios";

const SlideTabs = ({ navLinks }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((prev) => ({
          ...prev,
          opacity: 0,
        }));
      }}
      className="relative flex w-fit bg-white p-1 dark:bg-gray-800"
    >
      {navLinks.map((link) => (
        <Tabs setPosition={setPosition} link={link} key={link.path}>
          {link.label}
        </Tabs>
      ))}
      <Cursor position={position} />
    </ul>
  );
};

const Tabs = ({ link, setPosition, children }) => {
  const tabRef = useRef(null);

  const handleMouseEnter = () => {
    if (!tabRef.current) return;

    const { offsetLeft, offsetWidth } = tabRef.current;
    setPosition({
      left: offsetLeft,
      width: offsetWidth,
      opacity: 1,
    });
  };

  return (
    <li
      ref={tabRef}
      onMouseEnter={handleMouseEnter}
      className="relative z-10 cursor-pointer py-1.5 text-xs uppercase text-white mix-blend-difference md:px-10 md:py-3 md:text-base hidden lg:block"
    >
      <NavLink to={link.path} className="block w-full text-white">
        {children}
      </NavLink>
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity,
      }}
      className="absolute z-0 h-7 rounded-full w-36 bg-black md:h-12"
    />
  );
};

const Navbar = ({ navLinks }) => {
  const [open, setOpen] = React.useState(false);
  const [profile,setProfile]=React.useState();
  const isOpen = useSelector((state) => state.pages?.drawer);
  const dispatch = useDispatch();

  const options = {
    withCredentials: true,
  };
  
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-user`, options)
      .then((res) => {
        setProfile(res.data.data.profile);
      })
      .catch((err) => {});
  }, []);

  const toggleDrawer = () => {
    dispatch(drawerToogle());
  };

  const handleRedirect = () => {
    window.location.href = "https://techasiamechatronics.com/";
  };

  return (
    <div className="mt-7 mb-10 overflow-hidden z-0 dark:bg-gray-800 ">
      <nav className="flex justify-center lg:px-20 lg:w-full bg-white dark:bg-gray-800 dark:text-white">
        <div className="lg:-translate-x-20 dark:bg-gray-800">
          <img
            src="https://techasiamechatronics.com/wp-content/uploads/2023/03/techAsia-LOGO_horizontal1028.png"
            alt="logo"
            className="w-52"
            onClick={handleRedirect}
          />
        </div>
        <div className="flex w-3/4 items-center justify-center -translate-x-5 translate-y-1 ">
          <SlideTabs navLinks={navLinks} />
        </div>

        <div className="lg:translate-x-12 lg:pt-3 pt-2 -translate-x-10 flex space-x-3">
          <ThemeToggle />
          <Avatar
            alt="User Avatar"
            src={`${profile}` || ""}
            onClick={toggleDrawer}
          />
        </div>
      </nav>
      <Drawer
        open={open}
        onClose={toggleDrawer}
        anchor="right"
        className="rounded-2xl"
      >
        <Sidebar />
      </Drawer>
    </div>
  );
};

export default Navbar;
