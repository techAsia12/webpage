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
import { Card } from "@mui/material";
import { motion } from "motion/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Daily Usage`,
      },
    },
  };

  return (
    <motion.Card
      className="w-full lg:w-full shadow-lg rounded-2xl p-4 mb-8 lg:block hidden dark:bg-gray-800"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <Bar data={data} options={options} className="w-full" />
    </motion.Card>
  );
};

export default BarChart;
