import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Services = () => {
  const options = { withCredentials: true };

  const [data, setData] = useState({
    labels: [
      "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
      "21:00", "22:00", "23:00",
    ],
    datasets: [
      {
        label: "Units Used Today",
        data: Array(24).fill(0),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  });

  const [btnState, setBtnState] = useState("d");

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  useEffect(() => {
    let endpoint = "";
    let labels = [];

    if (btnState === "y") {
      endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-yearly`;
      labels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July",
        "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
    } else if (btnState === "w") {
      endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-weekly`;
      labels = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday",
      ];
    } else {
      endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-hourly`;
      labels = [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
        "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
        "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
        "21:00", "22:00", "23:00",
      ];
    }

    axios.get(endpoint, options)
      .then((res) => {
        setData({
          labels,
          datasets: [
            {
              label:
                btnState === "y"
                  ? "Units Used This Year"
                  : btnState === "w"
                  ? "Units Used This Week"
                  : "Units Used Today",
              data: res.data.data || Array(labels.length).fill(0),
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        });
        toast.success("Data fetched successfully!"); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data! Please try again."); 
      });
  }, [btnState]);

  return (
    <div className="lg:w-4/5 h-fit lg:ml-44 lg:pt-10">
      <h2>Usage Statistics</h2>
      <Line data={data} options={chartOptions} />
      <div className="pt-10 flex justify-center space-x-10">
        <Button
          variant="contained"
          className="border border-neutral-900 w-44 h-9 text-xl"
          onClick={() => setBtnState("d")}
        >
          Daily Usage
        </Button>
        <Button
          variant="contained"
          className="border border-neutral-900 w-44 h-9 text-xl"
          onClick={() => setBtnState("w")}
        >
          Weekly Usage
        </Button>
        <Button
          variant="contained"
          className="border border-neutral-900 w-44 h-9 text-xl"
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
