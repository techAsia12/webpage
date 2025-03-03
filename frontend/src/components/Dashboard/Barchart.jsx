import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "motion/react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  const theme = useSelector((state)=>state.theme.mode);
  const isDarkMode = theme === "dark";

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Daily Usage`,
        color: isDarkMode ? "white" : "black", 
      },
      legend: {
        labels: {
          color: isDarkMode ? "white" : "black", 
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "white" : "black",
        },
        grid: {
          color: isDarkMode ? "#444" : "#ccc",
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "white" : "black",
        },
        grid: {
          color: isDarkMode ? "#444" : "#ccc",
        },
      },
    },
  };

  return (
    <motion.Card
      className={`w-full lg:w-full shadow-lg rounded-2xl p-4 mb-8 lg:block hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <Bar data={data} options={options} className="w-full" />
    </motion.Card>
  );
};

export default BarChart;