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

const BarChart = ({ data }) => {
  const theme = useSelector((state) => state.theme.mode);
  const isDarkMode = theme === "dark";

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
    >
      <ResponsiveContainer width="100%" height={505}>
        <RechartsBarChart
          data={rechartsData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? "#444" : "#ccc"}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: isDarkMode ? "white" : "black" }}
            stroke={isDarkMode ? "white" : "black"}
          />
          <YAxis
            tick={{ fill: isDarkMode ? "white" : "black" }}
            stroke={isDarkMode ? "white" : "black"}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#333" : "#fff",
              borderColor: isDarkMode ? "#555" : "#ccc",
              color: isDarkMode ? "white" : "black",
            }}
          />
          <Legend
            wrapperStyle={{
              color: isDarkMode ? "white" : "black",
            }}
          />
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