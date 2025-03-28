import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";

const Services = () => {
  const options = { withCredentials: true };
  const mode = useSelector((state) => state.theme.mode);
  const [data, setData] = useState([]);
  const [btnState, setBtnState] = useState("d");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const LABELS = {
    d: "Units Used Today",
    w: "Units Used This Week",
    y: "Units Used This Year",
  };

  const ENDPOINTS = {
    d: `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-hourly`,
    w: `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-weekly`,
    y: `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-yearly`,
  };

  // Helper functions for date formatting
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of week (Saturday)
    return { start, end };
  };

  const formatDateParam = (date, period) => {
    switch (period) {
      case "d":
        return date.toISOString().split("T")[0];
      case "w": {
        const weekRange = getWeekRange(date);
        return `${weekRange.start.toISOString().split("T")[0]}_${
          weekRange.end.toISOString().split("T")[0]
        }`;
      }
      case "y":
        return date.getFullYear();
      default:
        return date.toISOString().split("T")[0];
    }
  };

  const fetchData = async (endpoint, label, period) => {
    try {
      const dateParam = formatDateParam(selectedDate, period);
      const res = await axios.get(endpoint, {
        ...options,
        params: { date: dateParam },
      });

      const formattedData = res.data.data.map((value, index) => ({
        name: getLabelName(index, period),
        [label]: value,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Error fetching data");
      setData([]);
    }
  };

  const getLabelName = (index, period) => {
    switch (period) {
      case "d":
        const hour = index % 12 || 12;
        return `${hour} ${index < 12 ? "AM" : "PM"}`;
      case "w":
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index];
      case "y":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][index];
      default:
        return index;
    }
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    switch (btnState) {
      case "d":
        newDate.setDate(newDate.getDate() + direction);
        break;
      case "w":
        newDate.setDate(newDate.getDate() + 7 * direction);
        break;
      case "y":
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
    }
    setSelectedDate(newDate);
  };

  const isNextDisabled = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (btnState) {
      case "d":
        return selectedDate.toDateString() === today.toDateString();
      case "w": {
        const currentWeekRange = getWeekRange(today);
        const selectedWeekRange = getWeekRange(selectedDate);
        return selectedWeekRange.end >= currentWeekRange.start;
      }
      case "y":
        return selectedDate.getFullYear() === today.getFullYear();
      default:
        return false;
    }
  };

  useEffect(() => {
    fetchData(ENDPOINTS[btnState], LABELS[btnState], btnState);
  }, [btnState, selectedDate, mode]);

  return (
    <div className="w-full lg:w-4/5 h-fit lg:ml-44 lg:pt-10 p-4">
      <Helmet>
        <title>Usage Statistics - Smart Energy Meter</title>
        <meta
          name="description"
          content="View your usage statistics on Your App Name. Track daily, weekly, and yearly usage with interactive charts."
        />
        <meta
          name="keywords"
          content="usage statistics, charts, daily usage, weekly usage, yearly usage, your app name"
        />
      </Helmet>

      <div className="flex items-center justify-between mb-4">
        <h2 className={mode === "dark" ? "text-white" : "text-black"}>
          Usage Statistics
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className={mode === "dark" ? "text-white" : "text-black"}>
            {btnState === "y"
              ? selectedDate.getFullYear()
              : btnState === "w"
              ? (() => {
                  const { start, end } = getWeekRange(selectedDate);
                  return `${formatDate(start)} - ${formatDate(end)}`;
                })()
              : selectedDate.toLocaleDateString()}
          </span>
          <button
            onClick={() => handleDateChange(1)}
            disabled={isNextDisabled()}
            className={`p-2 rounded-full ${
              isNextDisabled()
                ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <svg
              className={`w-6 h-6 ${
                isNextDisabled()
                  ? "text-gray-400 dark:text-gray-600"
                  : "text-gray-700 dark:text-gray-200"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

      {/* Rest of the component remains the same */}
      <div className="h-96 lg:h-[500px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={mode === "dark" ? "text-white" : "text-black"}>
              No data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: mode === "dark" ? "white" : "black" }}
              />
              <YAxis tick={{ fill: mode === "dark" ? "white" : "black" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: mode === "dark" ? "#333" : "#fff",
                  color: mode === "dark" ? "#fff" : "#333",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={LABELS[btnState]}
                stroke={mode === "dark" ? "#8884d8" : "#1976D2"} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="pt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10">
        <Button
          variant="contained"
          onClick={() => setBtnState("d")}
          className="dark:bg-[#3f51b5] dark:hover:bg-[#4963c7]"
        >
          Daily Usage
        </Button>
        <Button
          variant="contained"
          onClick={() => setBtnState("w")}
          className="dark:bg-[#3f51b5] dark:hover:bg-[#4963c7]"
        >
          Weekly Usage
        </Button>
        <Button
          variant="contained"
          onClick={() => setBtnState("y")}
          className="dark:bg-[#3f51b5] dark:hover:bg-[#4963c7]"
        >
          Yearly Usage
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Services;
