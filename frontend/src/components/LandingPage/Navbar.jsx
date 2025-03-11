import React, { useState, useEffect,useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { toggleTheme } from "../../Features/theme/theme.slice.js";
import { motion } from "motion/react";

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
      <a href={link.path} className="block w-full text-white">
        {children}
      </a>
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
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const [themeBtn, setThemeBtn] = useState();
  const theme = useSelector((state) => state.theme.mode);
  const navigate=useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      setThemeBtn(<WbSunnyIcon/>);
    } else {
      setThemeBtn(<DarkModeIcon />);
    }
  }, [theme]);

  return (
    <nav className="mb-20 flex items-center justify-between py-6 ">
      <img
        src="https://techasiamechatronics.com/wp-content/uploads/2023/03/techAsia-LOGO_horizontal1028.png"
        alt="logo"
        className="w-24 lg:w-52"
        onClick={() =>
          (window.location.href = "https://techasiamechatronics.com/")
        }
      />
      <div className="flex lg:space-x-2 space-x-1">
        <SlideTabs navLinks={navLinks} />
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
          >
            SignUp
          </Button>
          <Button
            className="text-black dark:text-white bottom-2"
            onClick={() => dispatch(toggleTheme())}
          >
            {themeBtn}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
