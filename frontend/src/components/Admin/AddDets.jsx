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

// SEO Component to add meta tags
const SEO = () => (
  <>
    <title>Add Bill Details | Admin Panel</title>
    <meta
      name="description"
      content="Add bill details including fixed tax, tax per unit, tax percentage, interest, and provider state."
    />
    <meta
      name="keywords"
      content="bill details, tax management, admin panel, add bill details"
    />
    <meta name="author" content="TechAsia Mechatronics Pvt Ltd" />
  </>
);

// Form Input Component
const FormInput = ({ label, value, onChange, theme }) => (
  <TextField
    label={label}
    variant="outlined"
    className="w-full lg:w-5/6"
    value={value}
    onChange={onChange}
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
  />
);

// Main Component
const AddDets = () => {
  const navigate = useNavigate();
  const [base, setBase] = useState("");
  const [percentPerUnit, setPercentPerUnit] = useState("");
  const [totalTaxPercent, setTotalTaxPercent] = useState("");
  const [tax, setTax] = useState("");
  const [state, setState] = useState("");
  const [serviceProvider, setServiceProvider] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !base ||
      !percentPerUnit ||
      !totalTaxPercent ||
      !tax ||
      !state ||
      !serviceProvider
    ) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    const state_Service_provider = serviceProvider + "_" + state;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/bill-dets`,
        {
          base,
          percentPerUnit,
          totalTaxPercent,
          tax,
          state: state_Service_provider,
        },
        { withCredentials: true }
      );

      if (response?.data?.success === true) {
        toast.success("Bill details submitted successfully!");
        dispatch(set(state_Service_provider));
        dispatch(billDetsPage());
        dispatch(costRangePage());
      }
    } catch (error) {
      toast.error("Error submitting bill details!");
      console.log(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center dark:text-white lg:p-10 p-5">
      <SEO /> {/* Add SEO meta tags */}
      <CancelIcon
        className="absolute top-10 lg:top-6 right-1 lg:right-[30%] cursor-pointer"
        color="error"
        onClick={() => dispatch(billDetsPage())}
        fontSize="large"
      />
      <Box className="flex flex-col items-center justify-center space-y-10 w-3/4 lg:w-1/3 border rounded-3xl p-5 pb-10">
        <h1 className="text-center text-2xl lg:text-4xl pt-5 lg:pt-10 text-black dark:text-white">
          Bill Details
        </h1>

        <FormInput
          label="Enter Fixed Tax"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          theme={theme}
        />
        <FormInput
          label="Enter Tax Per Unit"
          value={percentPerUnit}
          onChange={(e) => setPercentPerUnit(e.target.value)}
          theme={theme}
        />
        <FormInput
          label="Enter Tax Percentage"
          value={totalTaxPercent}
          onChange={(e) => setTotalTaxPercent(e.target.value)}
          theme={theme}
        />
        <FormInput
          label="Enter Interest"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          theme={theme}
        />
        <FormInput
          label="Enter Service Provider"
          value={serviceProvider}
          onChange={(e) => setServiceProvider(e.target.value)}
          theme={theme}
        />
        <FormInput
          label="Enter State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          theme={theme}
        />

        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Button
            variant="contained"
            className="w-full lg:w-44 h-9 text-xl dark:hover:bg-gray-600 mt-4 "
            sx={{
              backgroundColor: theme === "dark" ? "black" : "",
              border: "1px solid white",
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
