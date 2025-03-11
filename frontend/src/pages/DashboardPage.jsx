import React, { useEffect, useState } from "react";
import Meter from "../components/Dashboard/Meter.jsx";
import CardTemp from "../components/Dashboard/CardView.jsx";
import axios from "axios";
import Barchart from "../components/Dashboard/Barchart.jsx";
import { motion } from "framer-motion";
import { login } from "../Features/auth/auth.slice.js";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const [user, setUser] = useState("");
  const [kwh, setkwh] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [cost, setCost] = useState(0);
  const [costPerMonth, setPerMonth] = useState(0);
  const [maxKwh, setMaxKwh] = useState(parseFloat(kwh).toFixed(0));
  const dispatch = useDispatch();
  const [data, setData] = useState({
    labels: [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
    ],
    datasets: [
      {
        label: "Units Used Today",
        data: 0,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [billDets, setBillDet] = useState({
    base: 0,
    percentPerUnit: 0,
    totalTaxPercent: 0,
    tax: 0,
    state: "",
    range: [{ unitRange: 0, cost: 0, taxPerUnit: 0 }],
  });

  const options = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchUserData = () => {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/data`, options)
        .then((res) => {
          setUser(res.data.data);
          const time =
            (new Date() - new Date(res.data.data.date_time)) / (1000 * 60 * 60);
          setkwh(parseFloat(res.data.data.watt.toFixed(3)));
          setTotalCost(res.data.data.totalCost);
          setCost(res.data.data.costToday);
          setPerMonth((totalCost / 12).toFixed(2));
        })
        .catch((err) =>
          console.log("User data error:", err.response?.data?.message || err)
        );
    };

    fetchUserData();

    const interval = setInterval(() => {
      fetchUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, [user.watt]);

  useEffect(() => {
    const fetchUserData = () => {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/data`, options)
        .then((res) => {
          const userData = res.data.data;
          dispatch(login(userData));
          setKwh(userData.watt);
        })
        .catch((err) =>
          console.log("User data error:", err.response?.data?.message || err)
        );
    };

    const fetchHourlyUsage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-hourly`,
          { withCredentials: true }
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

    fetchUserData();
    fetchHourlyUsage();
  }, []);

  useEffect(() => {
    if (kwh > maxKwh) {
      setMaxKwh(Math.ceil(kwh / 10000) * 100000);
    }
  }, [kwh]);

  return (
    <div className="w-full min-h-screen bg-transparent p-4 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-6 lg:space-y-0">
        <div className="w-full lg:w-1/2 flex flex-col space-y-4">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
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
            <CardTemp
              name={"TOTAL COST"}
              value={totalCost}
              color={"text-sky-500"}
            />
          </motion.div>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 h-80">
            <Meter
              color={"#d3435c"}
              value={parseFloat(kwh)}
              maxValue={1000}
              unit={"kwh"}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
            <Meter
              color={"#ed9d00"}
              value={user?.voltage || 0}
              maxValue={350}
              unit={"v"}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:mt-10 mt-60">
        <div className="flex flex-col lg:flex-row lg:space-x-10 space-y-6 lg:space-y-0 ">
          <div className="w-full ">
            <Barchart data={data} />
          </div>

          <div className="w-full lg:w-1/3 flex flex-col space-y-6 py-2 ">
            <Meter
              color={"#34d399"}
              value={user?.current || 0}
              maxValue={30}
              unit={"A"}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            />
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <CardTemp
                name={"COST/MONTH"}
                value={costPerMonth}
                color={"text-rose-500"}
                hidden={"hidden"}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
