import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/theme/theme.slice";
import { useEffect, useState } from "react";
import {motion} from "motion/react";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const [bgImage, setBgImage] = useState("https://th.bing.com/th/id/OIP.QcHFhMyR8D6KnW6vme-1XQHaHZ?w=182&h=182&c=7&r=0&o=5&dpr=1.5&pid=1.7");
  const [image,setImage]=useState("https://th.bing.com/th/id/OIP._F-KiBUQe499xvG60RPuRwHaHa?pid=ImgDet&w=202&h=202&c=7&dpr=1.5");

  useEffect(() => {
    if (theme === "dark") {
      setBgImage(
        "https://th.bing.com/th/id/OIP.n_ZbPHKpAUzbMAhIOIGDNAHaFj?rs=1&pid=ImgDetMain"
      );
      setImage("https://th.bing.com/th/id/OIP.7W7uXNU2vFYaimi_xGt9AAHaHa?w=216&h=216&c=7&r=0&o=5&dpr=1.5&pid=1.7")
    } else {
      setBgImage("https://th.bing.com/th/id/OIP.QcHFhMyR8D6KnW6vme-1XQHaHZ?w=182&h=182&c=7&r=0&o=5&dpr=1.5&pid=1.7");
      setImage("https://th.bing.com/th/id/OIP._F-KiBUQe499xvG60RPuRwHaHa?pid=ImgDet&w=202&h=202&c=7&dpr=1.5")
    }
  }, [theme]);

  return (


    <motion.div
    className="rounded-full w-16 h-8 mt-2 p-1 border border-neutral-900 bg-cover bg-center cursor-pointer"
    style={{ backgroundImage: `url(${bgImage})` }}
    onClick={() => dispatch(toggleTheme())}
  >
    <motion.div
      className="w-6 h-6 rounded-full bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
      animate={{ x: theme === "light" ? 2 : 26 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    ></motion.div>
  </motion.div>
  );
};

export default ThemeToggle;
