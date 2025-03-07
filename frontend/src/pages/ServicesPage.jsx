import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const Services = () => {
  const options = { withCredentials: true };
  const mode = useSelector((state) => state.theme.mode);

  const [data, setData] = useState([]);
  const [btnState, setBtnState] = useState("d");

  const fetchData = async (endpoint, label, currentBtnState) => {
    try {
      const res = await axios.get(endpoint, options);
      const formattedData = res.data.data.map((value, index) => {
        let name;
        switch (currentBtnState) {
          case "d":
            const hour = index % 12 === 0 ? 12 : index % 12;
            const ampm = index < 12 ? "AM" : "PM";
            name = `${hour} ${ampm}`;
            break;
          case "w":
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            name = days[index] || index;
            break;
          case "y":
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            name = months[index] || index;
            break;
          default:
            name = index;
        }
        return { name, [label]: value };
      });
      setData(formattedData);
      toast.success("Data fetched successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      toast.error(error.response?.data?.message || "Error fetching data");
    }
  };

  useEffect(() => {
    let endpoint = "";
    let label = "";

    if (btnState === "y") {
      endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-yearly`;
      label = "Units Used This Year";
    } else if (btnState === "w") {
      endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-weekly`;
      label = "Units Used This Week";
    } else {
      endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-hourly`;
      label = "Units Used Today";
    }

    fetchData(endpoint, label, btnState);
  }, [btnState, mode]);

  return (
    <div className="w-full lg:w-4/5 h-fit lg:ml-44 lg:pt-10 p-4">
      <h2 className={mode === "dark" ? "text-white" : "text-black"}>Usage Statistics</h2>
      <div className="h-96 lg:h-[500px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={mode === "dark" ? "text-white" : "text-black"}>No data available</p>
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
                  color: mode === "dark" ? "#fff" : "#333" 
                }} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={btnState === "y" ? "Units Used This Year" : btnState === "w" ? "Units Used This Week" : "Units Used Today"}
                stroke="#8884d8"
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
          className="w-full sm:w-44 h-10 text-base sm:text-lg"
          onClick={() => setBtnState("d")}
        >
          Daily Usage
        </Button>
        <Button
          variant="contained"
          className="w-full sm:w-44 h-10 text-base sm:text-lg"
          onClick={() => setBtnState("w")}
        >
          Weekly Usage
        </Button>
        <Button
          variant="contained"
          className="w-full sm:w-44 h-10 text-base sm:text-lg"
          onClick={() => setBtnState("y")}
        >
          Yearly Usage
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Services;