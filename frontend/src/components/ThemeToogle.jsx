import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/theme/theme.slice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 dark:bg-gray-800 text-gray-900 transfrom lg:-translate-y-2  dark:text-gray-100 transition duration-300"
    >
      {theme === "light" ? "🌙 " : "☀️ "}
    </button>
  );
};

export default ThemeToggle;
