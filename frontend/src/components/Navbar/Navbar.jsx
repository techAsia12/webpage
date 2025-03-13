import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Drawer } from "@mui/material";
import Sidebar from "./Sidebar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { drawerToogle } from "../../Features/pages/pages.slice.js";
import { motion } from "framer-motion"; // Corrected import from "framer-motion"
import ThemeToggle from "../ThemeToogle.jsx";
import axios from "axios";

/**
 * SlideTabs Component
 * 
 * A component that displays navigation links with a hover effect.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.navLinks - Array of navigation links
 * @returns {JSX.Element} - Rendered SlideTabs component
 */
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
      className="relative flex w-fit rounded-full bg-transparent"
      role="navigation"
      aria-label="Main Navigation"
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

/**
 * Tabs Component
 * 
 * A single tab item within the SlideTabs component.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.link - Navigation link object
 * @param {Function} props.setPosition - Function to set the hover position
 * @param {ReactNode} props.children - Children elements
 * @returns {JSX.Element} - Rendered Tabs component
 */
const Tabs = ({ link, setPosition, children }) => {
  const tabRef = useRef(null);
  const theme = useSelector((state) => state.theme.mode);

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
      className="relative z-10 cursor-pointer py-1.5 text-xs uppercase mix-blend-difference md:px-10 md:py-3 md:text-base hidden lg:block text-black dark:text-white hover:text-white"
      role="menuitem"
    >
      <NavLink to={link.path} className="block w-full" aria-label={link.label}>
        {children}
      </NavLink>
    </li>
  );
};

/**
 * Cursor Component
 * 
 * A visual indicator that follows the hovered tab.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.position - Position and size of the cursor
 * @returns {JSX.Element} - Rendered Cursor component
 */
const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        left: position.left,
        width: position.width,
        opacity: position.opacity,
      }}
      className="absolute z-0 h-7 rounded-full w-36 bg-black md:h-12"
      aria-hidden="true" // Hidden from screen readers (visual-only element)
    />
  );
};

/**
 * Navbar Component
 * 
 * The main navigation bar of the application.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.navLinks - Array of navigation links
 * @returns {JSX.Element} - Rendered Navbar component
 */
const Navbar = ({ navLinks }) => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState();
  const isOpen = useSelector((state) => state.pages?.drawer);
  const dispatch = useDispatch();

  const options = {
    withCredentials: true,
  };

  // Sync the drawer state with Redux
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // Fetch user profile data
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-user`, options)
      .then((res) => {
        setProfile(res.data.data.profile);
      })
      .catch((err) => {
        console.error("Failed to fetch user profile:", err);
      });
  }, []);

  // Toggle the drawer
  const toggleDrawer = () => {
    dispatch(drawerToogle());
  };

  // Redirect to the main website
  const handleRedirect = () => {
    window.location.href = "https://techasiamechatronics.com/";
  };

  return (
    <nav
      className="flex justify-center py-5 lg:px-20 lg:w-full dark:text-white"
      role="banner"
      aria-label="Main Navigation Bar"
    >
      {/* Logo */}
      <div className="lg:-translate-x-20">
        <img
          src="https://techasiamechatronics.com/wp-content/uploads/2023/03/techAsia-LOGO_horizontal1028.png"
          alt="Tech Asia Mechatronics Logo"
          className="w-52"
          onClick={handleRedirect}
          role="button"
          aria-label="Go to Tech Asia Mechatronics homepage"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRedirect();
          }}
        />
      </div>

      {/* Navigation Links */}
      <div className="flex w-3/4 items-center justify-center -translate-x-5 translate-y-1">
        <SlideTabs navLinks={navLinks} />
      </div>

      {/* Theme Toggle and Avatar */}
      <div className="lg:translate-x-12 lg:pt-3 pt-2 -translate-x-10 flex space-x-3">
        <ThemeToggle />
        <Avatar
          alt="User Avatar"
          src={`${profile}` || ""}
          onClick={toggleDrawer}
          role="button"
          aria-label="Toggle Sidebar"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleDrawer();
          }}
        />
      </div>

      {/* Drawer for Sidebar */}
      <Drawer
        open={open}
        onClose={toggleDrawer}
        anchor="right"
        className="rounded-2xl"
        role="dialog"
        aria-label="Sidebar Drawer"
      >
        <Sidebar />
      </Drawer>
    </nav>
  );
};

export default Navbar;
export { SlideTabs };