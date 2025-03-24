import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

/**
 * BarChart Component
 * 
 * A responsive bar chart component that supports dark and light themes.
 * It uses Recharts for rendering the chart and Framer Motion for animations.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Chart data containing labels and datasets
 * @returns {JSX.Element} - Rendered BarChart component
 */
const BarChart = ({ data }) => {
  // Get the current theme mode from the Redux store
  const theme = useSelector((state) => state.theme.mode);
  const isDarkMode = theme === "dark";

  // Transform the input data into the format required by Recharts
  const rechartsData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index],
  }));

  return (
    <motion.div
      className={`w-full shadow-lg rounded-2xl p-4 mb-8 lg:block hidden border`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
      role="figure"
      aria-label="Bar chart displaying data"
    >
      <ResponsiveContainer width="100%" height={700}>
        <RechartsBarChart
          data={rechartsData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          aria-label="Bar chart"
        >
          {/* Grid lines for the chart */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#444" : "#ccc"}
          />

          {/* X-axis with customizable tick colors based on theme */}
          <XAxis
            dataKey="name"
            tick={{ fill: isDarkMode ? "white" : "black" }}
            stroke={isDarkMode ? "white" : "black"}
          />

          {/* Y-axis with customizable tick colors based on theme */}
          <YAxis
            tick={{ fill: isDarkMode ? "white" : "black" }}
            stroke={isDarkMode ? "white" : "black"}
          />

          {/* Tooltip with theme-based styling */}
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#333" : "#fff",
              borderColor: isDarkMode ? "#555" : "#ccc",
              color: isDarkMode ? "white" : "black",
            }}
          />

          {/* Legend with theme-based text color */}
          <Legend
            wrapperStyle={{
              color: isDarkMode ? "white" : "black",
            }}
          />

          {/* Bar component representing the data */}
          <Bar
            dataKey="value"
            name={data.datasets[0].label}
            fill={isDarkMode ? "#8884d8" : "#82ca9d"}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BarChart;