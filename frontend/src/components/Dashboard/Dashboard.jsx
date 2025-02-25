import React, { useEffect, useState } from "react";
import Meter from "./Meter";
import CardTemp from "./CardView";
import axios from "axios";
import Barchart from "./Barchart";
import { motion } from "motion/react";
import { login } from "../../Features/auth/auth.slice";
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

  const costCalc = async (unit) => {
    const calc = (unit, cos, index) => {
      const base = unit * cos + billDets.base;
      const tax1 = unit * billDets.percentPerUnit;
      const tax2 = unit * billDets.range[index].taxPerUnit;
      const tax3 = (billDets.totalTaxPercent / 100) * (base + tax1 + tax2);
      const total = base + tax1 + tax2 + tax3 + billDets.tax;

      return { base, total };
    };

    let { base, total } = { base: 0, total: 0 };

    if (unit > billDets.range[3].unitRange) {
      ({ base, total } = calc(unit, billDets.range[3].cost, 3));
    } else if (unit > billDets.range[2].unitRange) {
      ({ base, total } = calc(unit, billDets.range[2].cost, 2));
    } else if (unit > billDets.range[1].unitRange) {
      ({ base, total } = calc(unit, billDets.range[1].cost, 1));
    } else {
      ({ base, total } = calc(unit, billDets.range[0].cost, 0));
    }

    setCost(parseFloat(base.toFixed()));
    setTotalCost(parseFloat(total.toFixed()));
    setPerMonth(parseFloat(totalCost / 12).toFixed());
  };

  useEffect(() => {
    const fetchUserData = () => {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/data`, options)
        .then((res) => {
          setUser(res.data.data);
          const time =
            (new Date() - new Date(res.data.data.date_time)) / (1000 * 60 * 60);
            console.log(res.data.data.watt);
          setkwh(parseFloat(((res.data.data.watt).toFixed(3))));
        })
        .catch((err) =>
          console.log("User data error:", err.response?.data?.message || err)
        );
    };

    const fetchBillDetails = () => {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/data-dets?state=${
            user.state
          }`,
          options
        )
        .then((res) => {
          const [range, range3, range2, range1] = res.data.data.costDetails;

          setBillDet({
            base: res.data.data.billDetails.base,
            percentPerUnit: res.data.data.billDetails.percentPerUnit,
            state: res.data.data.billDetails.state,
            tax: res.data.data.billDetails.tax,
            totalTaxPercent: res.data.data.billDetails.totalTaxPercent,
            range: [range, range1, range2, range3],
          });
          costCalc(kwh);
          setPerMonth(parseFloat(totalCost / 12).toFixed());
        })
        .catch((err) =>
          console.log("Bill details error:", err.response?.data?.message || err)
        );
    };

    fetchUserData();
    if (user) {
      fetchBillDetails();
    }

    const interval = setInterval(() => {
      fetchUserData();
      if (user) {
        fetchBillDetails();
      }
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
          const time = (new Date() - new Date(userData.date_time)) / (1000 * 60 * 60); 
          const newKwh = parseFloat(((userData.watt * time) / 1000).toFixed(3)); 
          setKwh(newKwh); 
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
    if (!user || kwh <= 0) return; 

    const fetchBillDetails = () => {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/data-dets?state=${user.state}`,
          options
        )
        .then((res) => {
          const [range, range3, range2, range1] = res.data.data.costDetails;

          setBillDet({
            base: res.data.data.billDetails.base,
            percentPerUnit: res.data.data.billDetails.percentPerUnit,
            state: res.data.data.billDetails.state,
            tax: res.data.data.billDetails.tax,
            totalTaxPercent: res.data.data.billDetails.totalTaxPercent,
            range: [range, range1, range2, range3],
          });

          costCalc(kwh); 
        })
        .catch((err) =>
          console.log("Bill details error:", err.response?.data?.message || err)
        );
    };

    fetchBillDetails(); 

  }, [user, kwh]); 

  useEffect(() => {
    if (kwh > maxKwh) {
      setMaxKwh(Math.ceil(kwh / 10000) * 100000); 
    }
  }, [kwh]);

  return (
    <div className="w-screen max-h-screen z-0 dark:bg-gray-800 lg:overflow-x-hidden overflow-auto top-0">
      <div className="lg:flex lg:space-x-10 px-10 dark:bg-gray-800">
        <div className="lg:w-4/5">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <CardTemp
              name={"COST TODAY"}
              value={cost}
              color={"text-indigo-400"}
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
        <Meter
          color={"#d3435c"}
          value={parseFloat(kwh)}
          maxValue={maxKwh}
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
      <div className="px-10 w-full dark:bg-gray-800 ">
        <div className="lg:flex lg:space-x-10 w-full dark:bg-gray-800 ">
          <Barchart data={data} />
          <div className="lg:w-1/3">
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
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;