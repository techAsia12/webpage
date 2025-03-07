import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress, Box } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
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
  const theme = useSelector((state) => state.theme.mode);
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
    <div className="flex justify-center items-center  dark:text-white lg:p-10  pt-20 ">
      <CancelIcon
        className="absolute top-10 lg:top-6 right-1 lg:right-[30%] cursor-pointer"
        color="error"
        onClick={() => dispatch(billDetsPage())}
        fontSize="large"
      />
      <Box className="flex flex-col items-center justify-center space-y-10 w-3/4 lg:w-1/3 lg:p-10 p-5 border rounded-3xl">
        <h1 className="text-center text-2xl lg:text-4xl pt-10 lg:pt-20 text-black dark:text-white">
          Bill Details
        </h1>

        <TextField
          label="Enter Fixed Tax"
          variant="outlined"
          className={`w-full lg:w-5/6 ${theme === "dark" ? "text-white" : ""}`}
          sx={{
            "& .MuiInputBase-input": {
              color: theme === "dark" ? "white" : "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme === "dark" ? "white" : "black",
            },
            "& .MuiInputLabel-root": {
              color: theme === "dark" ? "white" : "black", // Add this for label color
            },
          }}
          onChange={(e) => setBase(e.target.value)}
        />
        <TextField
          label="Enter Tax Per Unit"
          variant="outlined"
          className={`w-full lg:w-5/6 ${theme === "dark" ? "text-white" : ""}`}
          sx={{
            "& .MuiInputBase-input": {
              color: theme === "dark" ? "white" : "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme === "dark" ? "white" : "black",
            },
            "& .MuiInputLabel-root": {
              color: theme === "dark" ? "white" : "black", // Add this for label color
            },
          }}
          onChange={(e) => setPercentPerUnit(e.target.value)}
        />
        <TextField
          label="Enter Tax Percentage"
          variant="outlined"
          className={`w-full lg:w-5/6 ${theme === "dark" ? "text-white" : ""}`}
          sx={{
            "& .MuiInputBase-input": {
              color: theme === "dark" ? "white" : "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme === "dark" ? "white" : "black",
            },
            "& .MuiInputLabel-root": {
              color: theme === "dark" ? "white" : "black", 
            },
          }}
          onChange={(e) => setTotalTaxPercent(e.target.value)}
        />
        <TextField
          label="Enter Interest"
          variant="outlined"
          className={`w-full lg:w-5/6 ${theme === "dark" ? "text-white" : ""}`}
          sx={{
            "& .MuiInputBase-input": {
              color: theme === "dark" ? "white" : "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme === "dark" ? "white" : "black",
            },
            "& .MuiInputLabel-root": {
              color: theme === "dark" ? "white" : "black", // Add this for label color
            },
          }}
          onChange={(e) => setTax(e.target.value)}
        />
        <TextField
          label="Enter Provider_State"
          variant="outlined"
          className={`w-full lg:w-5/6 ${theme === "dark" ? "text-white" : ""}`}
          sx={{
            "& .MuiInputBase-input": {
              color: theme === "dark" ? "white" : "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme === "dark" ? "white" : "black",
            },
            "& .MuiInputLabel-root": {
              color: theme === "dark" ? "white" : "black",
            },
          }}
          onChange={(e) => setState(e.target.value)}
        />

        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Button
            variant="contained"
            className="w-full lg:w-44 h-9 text-xl dark:hover:bg-gray-600 mt-4 lg:mt-0"
            sx={{
              backgroundColor:theme==="dark"?"black":"",
              border:"1px solid white"
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            Next
          </Button>
        )}
      </Box>
    </div>
  );
};

export default AddDets;
