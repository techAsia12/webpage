import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/theme/theme.slice";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Corrected import from "framer-motion"

/**
 * ThemeToggle Component
 * 
 * A toggle switch for switching between light and dark themes.
 * It includes animations and dynamically changes images based on the theme.
 * 
 * @returns {JSX.Element} - Rendered ThemeToggle component
 */
const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const [bgImage, setBgImage] = useState("");
  const [image, setImage] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Image URLs for light and dark themes
  const lightThemeImages = {
    bgImage: "https://th.bing.com/th/id/OIP.QcHFhMyR8D6KnW6vme-1XQHaHZ?w=182&h=182&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    image: "https://th.bing.com/th/id/OIP._F-KiBUQe499xvG60RPuRwHaHa?pid=ImgDet&w=202&h=202&c=7&dpr=1.5",
  };

  const darkThemeImages = {
    bgImage: "https://th.bing.com/th/id/OIP.n_ZbPHKpAUzbMAhIOIGDNAHaFj?rs=1&pid=ImgDetMain",
    image: "https://th.bing.com/th/id/OIP.7W7uXNU2vFYaimi_xGt9AAHaHa?w=216&h=216&c=7&r=0&o=5&dpr=1.5&pid=1.7",
  };

  // Update images based on the current theme
  useEffect(() => {
    if (theme === "dark") {
      setBgImage(darkThemeImages.bgImage);
      setImage(darkThemeImages.image);
    } else {
      setBgImage(lightThemeImages.bgImage);
      setImage(lightThemeImages.image);
    }
  }, [theme]);

  // Handle window resize to update screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Calculate the X position of the toggle switch based on screen width and theme.
   * 
   * @returns {number} - The X position for the toggle switch
   */
  const calculateXPosition = () => {
    if (screenWidth >= 1024) {
      return theme === "light" ? 2 : 26; // Desktop
    } else {
      return theme === "light" ? 2 : 14; // Mobile
    }
  };

  return (
    <motion.div
      className="rounded-full w-8 h-4 lg:w-16 lg:h-8 mt-2 p-0.5 lg:p-1 border border-neutral-900 bg-cover bg-center cursor-pointer"
      style={{ backgroundImage: `url(${bgImage})` }}
      onClick={() => dispatch(toggleTheme())}
      role="button"
      aria-label="Toggle Theme"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") dispatch(toggleTheme());
      }}
    >
      <motion.div
        className="w-3 h-3 lg:w-6 lg:h-6 rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        animate={{ x: calculateXPosition() }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        aria-hidden="true" // Hidden from screen readers (visual-only element)
      ></motion.div>
    </motion.div>
  );
};

export default ThemeToggle;