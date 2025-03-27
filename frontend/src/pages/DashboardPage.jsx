import React, { useEffect, useState } from "react";
import Meter from "../components/Dashboard/Meter.jsx";
import CardTemp from "../components/Dashboard/CardView.jsx";
import axios from "axios";
import Barchart from "../components/Dashboard/Barchart.jsx";
import { motion } from "framer-motion";
import { login } from "../Features/auth/auth.slice.js";
import { useDispatch } from "react-redux";
import SemiCircularProgress from "../components/Dashboard/SemiCircularProgress.jsx";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [kwh, setKwh] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [cost, setCost] = useState(0);
  const [maxKwh, setMaxKwh] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  const [data, setData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Units Used Today",
        data: Array(24).fill(0),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const dispatch = useDispatch();
  const options = { withCredentials: true };

  const fetchUserData = async (date = selectedDate) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/data`,
        {
          ...options,
          params: {
            date
          }
        }
      );
      const userData = response.data.data;
      setUser(userData);
      setKwh(parseFloat(userData.units.toFixed(3)));
      setTotalCost(userData.totalCost);
      setCost(userData.costToday);
      setThreshold(userData.threshold);
      dispatch(login(userData));
    } catch (err) {
      console.error("User data error:", err.response?.data?.message || err);
    }
  };

  const fetchHourlyUsage = async (date = selectedDate) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-hourly`,
        {
          ...options,
          params: {
            date,
          }
        }
      );
      if (response.status === 200) {
        const unitsPerHour = response.data.data;
        setData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: unitsPerHour,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error fetching hourly usage data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchHourlyUsage();

    const interval = setInterval(() => {
      fetchUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  useEffect(() => {
    if (kwh > maxKwh) {
      setMaxKwh(Math.ceil(kwh / 10000) * 100000);
    }
  }, [kwh]);

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const today = new Date();
    if (newDate > today) return;
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-4 lg:p-10 ">
      <div className="flex flex-col lg:flex-row lg:space-x-10 space-y-6 lg:space-y-0 ">
        <div className="w-full lg:w-[45%] flex flex-col space-y-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex justify-center"
          >
            <CardTemp
              name={"COST TODAY"}
              value={cost}
              color={"text-indigo-400"}
              hidden={"hidden"}
            />
          </motion.div>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <SemiCircularProgress 
              value={totalCost}
              max={1000+(threshold*0.2)}
              initialThreshold={threshold}/>
          </motion.div>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col space-y-6 pt-0 lg:pt-16">
          <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 h-80">
            <Meter
              outerColor={"#d3435c"}
              innerColor={"#f97316"}
              outerValue={parseFloat(kwh)}
              innerValue={user?.watt || 0}
              outerMax={10000}
              innerMax={10000}
              outerUnit={"kwh/units"}
              innerUnit={"W"}
              outerLabel={"Units"}
              innerLabel={"Power"}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />

            <Meter
              outerColor={"#ed9d00"}
              innerColor={"#34d399"}
              outerValue={user?.voltage || 0}
              innerValue={user?.current || 0}
              outerMax={350}
              innerMax={30}
              outerUnit={"v"}
              innerUnit={"A"}
              outerLabel={"Voltage"}
              innerLabel={"Current"}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:mt-10 mt-60">
        <div className="flex flex-col lg:flex-row lg:space-x-10 space-y-6 lg:space-y-0">
          <div className="w-full">
            <Barchart 
              data={data} 
              selectedDate={selectedDate}
              onPrevDate={() => handleDateChange(-1)}
              onNextDate={() => handleDateChange(1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;