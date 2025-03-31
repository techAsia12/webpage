import React, { useEffect, useState } from "react";
import Meter from "../components/Dashboard/Meter.jsx";
import CardTemp from "../components/Dashboard/CardView.jsx";
import axios from "axios";
import Barchart from "../components/Dashboard/Barchart.jsx";
import { motion } from "framer-motion";
import { login,setRole } from "../Features/auth/auth.slice.js";
import { useDispatch } from "react-redux";
import SemiCircularProgress from "../components/Dashboard/SemiCircularProgress.jsx";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [kwh, setKwh] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [cost, setCost] = useState(0);
  const [maxKwh, setMaxKwh] = useState(0);
  const [powerFactor, setPowerFactor] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
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
            date,
          },
        }
      );
      const userData = response.data.data;
      setUser(userData);
      setKwh(parseFloat(userData.units.toFixed(3)));
      setTotalCost(userData.totalCost);
      setCost(userData.costToday);
      setThreshold(userData.threshold);
      setPowerFactor(userData.power_factor);
      dispatch(login(userData));
      dispatch(setRole("Client"));
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
          },
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
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="w-full h-screen bg-transparent overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 lg:p-10 lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col lg:flex-row lg:space-x-10">
          <div className="w-full lg:w-[45%] flex flex-col space-y-10">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <SemiCircularProgress
                value={totalCost}
                max={threshold * 1.1}
                initialThreshold={threshold}
                innerValue={cost}
                showInnerRing={true}
              />
            </motion.div>
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex justify-center"
            >
              <CardTemp
                name={"Power Factor"}
                value={powerFactor}
                color={"text-indigo-400"}
                hidden={"hidden"}
                unit={""}
              />
            </motion.div>
          </div>
  
          <div className="w-full lg:w-1/3 flex flex-col lg:flex-row lg:space-x-6 space-y-2 lg:space-y-0 h-80 pt-0 lg:pt-12">
            <Meter
              outerColor={"#f97316"}
              innerColor={"#d3435c"}
              outerValue={user?.watt || 0}
              innerValue={parseFloat(kwh)}
              outerMax={5000}
              innerMax={100}
              outerUnit={"W"}
              innerUnit={"kwh/units"}
              outerLabel={"Power"}
              innerLabel={"Units"}
              showThirdRing={true}
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
  
        <div className="w-full mt-6">
          <Barchart
            data={data}
            selectedDate={selectedDate}
            onPrevDate={() => handleDateChange(-1)}
            onNextDate={() => handleDateChange(1)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
