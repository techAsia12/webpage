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

const BarChart = ({ data, selectedDate, onPrevDate, onNextDate }) => {
  const theme = useSelector((state) => state.theme.mode);
  const isDarkMode = theme === "dark";

  const rechartsData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index],
  }));

  const formattedDate = new Date(selectedDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      className={`w-full shadow-lg rounded-2xl p-4 mb-8 lg:block hidden border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
      role="figure"
      aria-label="Bar chart displaying data"
    >
      <div className="mb-4 flex items-center justify-between px-4">
        <span className="text-lg font-semibold dark:text-white">
          {formattedDate}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPrevDate}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Previous date"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={onNextDate}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Next date"
            disabled={
              new Date(selectedDate).toDateString() ===
              new Date().toDateString()
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <RechartsBarChart
          data={rechartsData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          aria-label="Bar chart"
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
            fill={isDarkMode ? "#8884d8" : "#1976D2"}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BarChart;