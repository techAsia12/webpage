import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { set } from "../../Features/auth/billDets.slice";
import { billDetsPage, costRangePage } from "../../Features/pages/pages.slice";
import CancelIcon from "@mui/icons-material/Cancel";

const AddDets = () => {
  const navigate = useNavigate();
  const [base, setBase] = useState();
  const [percentPerUnit, setPercentPerUnit] = useState();
  const [totalTaxPercent, setTotalTaxPercent] = useState();
  const [tax, setTax] = useState();
  const [state, setState] = useState();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/bill-dets`, {
        base,
        percentPerUnit,
        totalTaxPercent,
        tax,
        state,
      })
      .then((res) => {
        if (res?.data?.success === true) {
          toast.success("Bill details submitted successfully!");
          dispatch(set(state));
          dispatch(billDetsPage());
          dispatch(costRangePage());
        }
      })
      .catch((error) => {
        toast.error("Error submitting bill details!");
        console.log(error?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="lg:w-1/3 w-4/5 lg:h-5/6 border border-neutral-900 rounded-3xl bg-white dark:bg-gray-800 dark:border-white lg:ml-20">
        <h1 className="text-center text-4xl pt-20 text-black dark:text-white">
          Bill Details
        </h1>
        <CancelIcon
          className="ml-52 transform lg:-translate-y-14 -translate-y-28 lg:ml-96 right-0 text-black dark:text-white"
          color="error"
          onClick={() => {
            dispatch(billDetsPage());
          }}
          fontSize="large"
        />
        <form
          action=""
          onSubmit={handleSubmit}
          className="self-center space-y-4 flex flex-col justify-center items-center h-3/4"
        >
          <TextField
            label="Enter Fixed Tax"
            variant="outlined"
            className="lg:w-5/6 dark:bg-gray-700 dark:text-white dark:border-white"
            onChange={(e) => setBase(e.target.value)}
            InputLabelProps={{
              className: "dark:text-white", 
            }}
            InputProps={{
              className: "dark:text-white", 
            }}
          />
          <TextField
            label="Enter Tax Per Unit"
            variant="outlined"
            className="lg:w-5/6 dark:bg-gray-700 dark:text-white dark:border-white"
            onChange={(e) => setPercentPerUnit(e.target.value)}
            InputLabelProps={{
              className: "dark:text-white", 
            }}
            InputProps={{
              className: "dark:text-white", 
            }}
          />
          <TextField
            label="Enter Tax Percentage"
            variant="outlined"
            className="lg:w-5/6 dark:bg-gray-700 dark:text-white dark:border-white"
            onChange={(e) => setTotalTaxPercent(e.target.value)}
            InputLabelProps={{
              className: "dark:text-white", 
            }}
            InputProps={{
              className: "dark:text-white", 
            }}
          />
          <TextField
            label="Enter Interest"
            variant="outlined"
            className="lg:w-5/6 dark:bg-gray-700 dark:text-white dark:border-white"
            onChange={(e) => setTax(e.target.value)}
            InputLabelProps={{
              className: "dark:text-white", 
            }}
            InputProps={{
              className: "dark:text-white", 
            }}
          />
          <TextField
            label="Enter Provider_State"
            variant="outlined"
            className="lg:w-5/6 dark:bg-gray-700 dark:text-white dark:border-white"
            onChange={(e) => setState(e.target.value)}
            InputLabelProps={{
              className: "dark:text-white", 
            }}
            InputProps={{
              className: "dark:text-white", 
            }}
          />

          {loading ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              variant="contained"
              className="border border-neutral-900 w-44 h-9 text-xl dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              onClick={handleSubmit}
              disabled={loading} 
            >
              Next
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDets;
