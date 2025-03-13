import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { toggleTheme } from "../../Features/theme/theme.slice.js";
import { motion } from "framer-motion"; // Corrected import from "framer-motion"

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
      role="menuitem"
    >
      <HashLink
        to={link.path}
        smooth
        className="block w-full text-white"
        aria-label={`Navigate to ${link.label}`}
      >
        {children}
      </HashLink>
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
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const [themeBtn, setThemeBtn] = useState();
  const theme = useSelector((state) => state.theme.mode);
  const navigate = useNavigate();

  // Update the theme button icon based on the current theme
  useEffect(() => {
    if (theme === "dark") {
      setThemeBtn(<WbSunnyIcon />);
    } else {
      setThemeBtn(<DarkModeIcon />);
    }
  }, [theme]);

  return (
    <nav
      className="mb-20 flex items-center justify-between py-6"
      role="banner"
      aria-label="Main Navigation Bar"
    >
      {/* Logo */}
      <img
        src="https://techasiamechatronics.com/wp-content/uploads/2023/03/techAsia-LOGO_horizontal1028.png"
        alt="Tech Asia Mechatronics Logo"
        className="w-24 lg:w-52"
        onClick={() =>
          (window.location.href = "https://techasiamechatronics.com/")
        }
        role="button"
        aria-label="Go to Tech Asia Mechatronics homepage"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            window.location.href = "https://techasiamechatronics.com/";
          }
        }}
      />

      {/* Navigation Links and Buttons */}
      <div className="flex lg:space-x-2 space-x-1">
        <SlideTabs navLinks={navLinks} />

        {/* Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="contained"
            className="text-xl text-white text-wrap h-10 mr-10 cursor-pointer"
            sx={{
              backgroundColor: mode === "dark" ? "#1C1C3C" : "#000000",
              border: mode === "dark" ? "1px solid white" : "none",
              "&:hover": {
                backgroundColor: mode === "dark" ? "#2D1B5A" : "#374151",
                border: mode === "dark" ? "1px solid white" : "none",
              },
            }}
            onClick={() => navigate("/login")}
            aria-label="Login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            className="text-xl text-white text-wrap h-10 cursor-pointer"
            sx={{
              backgroundColor: mode === "dark" ? "#1C1C3C" : "#000000",
              border: mode === "dark" ? "1px solid white" : "none",
              "&:hover": {
                backgroundColor: mode === "dark" ? "#2D1B5A" : "#374151",
                border: mode === "dark" ? "1px solid white" : "none",
              },
            }}
            onClick={() => navigate("/register")}
            aria-label="Sign Up"
          >
            SignUp
          </Button>
          <Button
            className="text-black dark:text-white bottom-2"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle Theme"
          >
            {themeBtn}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;