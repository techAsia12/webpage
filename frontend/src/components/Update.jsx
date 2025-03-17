import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { updatePage } from "../Features/pages/pages.slice";
import CancelIcon from "@mui/icons-material/Cancel";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

/**
 * Update Component
 * 
 * A form component for updating user information, including name, email, and service provider (for clients).
 * 
 * @returns {JSX.Element} - Rendered Update component
 */
const Update = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedServiceProvider, setSelectedServiceProvider] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNameReadOnly, setIsNameReadOnly] = useState(true);
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(true);

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  const options = { withCredentials: true };

  // Fetch states and user data on component mount
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-stateDets`, options)
      .then((res) => setStates(res.data.data))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to load states.")
      );

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-user`, options)
      .then((res) => {
        setRole(res.data.data.role);
        setName(res.data.data.name);
        setEmail(res.data.data.email);
      })
      .catch((err) => toast.error("Failed to load user data."))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Toggle the read-only state of a field.
   * 
   * @param {string} field - The field to toggle (e.g., "name" or "email")
   */
  const toggleFieldReadOnly = (field) => {
    switch (field) {
      case "name":
        setIsNameReadOnly((prev) => !prev);
        break;
      case "email":
        setIsEmailReadOnly((prev) => !prev);
        break;
      default:
        break;
    }
  };

  /**
   * Handle state selection change.
   * 
   * @param {Object} event - The change event
   */
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedServiceProvider("");
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = () => {
    setLoading(true);
    const endpoint = role === "Client" ? "user/update" : "admin/update";
    const payload =
      role === "Client"
        ? { name, email, selectedServiceProvider }
        : { name, email };

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/${endpoint}`,
        payload,
        options
      )
      .then((res) => {
        toast.success(res.data.message || "Update successful!", {
          position: "top-right",
        });
        setTimeout(() => dispatch(updatePage()), 1000);
      })
      .catch((err) => {
        toast.error(
          `Error: ${err.response?.data?.message || "Update failed."}`
        );
      })
      .finally(() => setLoading(false));
  };

  /**
   * Extract the state name from a state string.
   * 
   * @param {string} stateString - The state string (e.g., "Provider_State")
   * @returns {string} - The state name
   */
  const getStateName = (stateString) => stateString.split("_")[1];

  /**
   * Extract the service provider name from a state string.
   * 
   * @param {string} stateString - The state string (e.g., "Provider_State")
   * @returns {string} - The service provider name
   */
  const getServiceProvider = (stateString) => stateString.split("_")[0];

  // Get unique states from the states array
  const uniqueStates = Array.from(
    new Set(states.map((stateObj) => getStateName(stateObj.state)))
  );

  /**
   * Render a text field with a toggleable read-only state.
   * 
   * @param {string} label - The label for the text field
   * @param {string} value - The value of the text field
   * @param {Function} setValue - The function to update the value
   * @param {boolean} isReadOnly - Whether the field is read-only
   * @param {string} field - The field name (e.g., "name" or "email")
   * @returns {JSX.Element} - Rendered TextField component
   */
  const renderTextField = (label, value, setValue, isReadOnly, field) => (
    <TextField
      variant="outlined"
      className="lg:w-5/6 w-3/4"
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        readOnly: isReadOnly,
        endAdornment: (
          <InputAdornment
            position="end"
            onClick={() => toggleFieldReadOnly(field)}
            style={{ cursor: "pointer", padding: "0 8px" }}
          >
            {isReadOnly ? <EditIcon /> : <CheckIcon />}
          </InputAdornment>
        ),
      }}
      onFocus={() => toggleFieldReadOnly(field)}
      sx={{
        "& .MuiInputBase-input": {
          color: theme === "dark" ? "white" : "black",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme === "dark" ? "white" : "black",
        },
      }}
      aria-label={label}
    />
  );

  // Loading state
  if (loading) {
    return (
      <div className="fixed w-full h-full bg-black/50 flex justify-center items-center z-40">
        <ElectricBoltIcon className="z-50" />
        <CircularProgress size={80} color="inherit" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center dark:text-white lg:p-40 pt-20">
      {/* Close Button */}
      <CancelIcon
        className="absolute top-10 lg:top-24 right-1 lg:right-1/3 cursor-pointer"
        color="error"
        onClick={() => dispatch(updatePage())}
        fontSize="large"
        aria-label="Close Update Form"
      />

      {/* Update Form */}
      <Box className="flex flex-col items-center justify-center space-y-10 w-3/4 lg:w-1/3 lg:p-10 p-5 border rounded-3xl">
        <Avatar alt="User Avatar" src="" sx={{ width: 60, height: 60 }} />

        {/* Name Field */}
        {renderTextField("Name", name, setName, isNameReadOnly, "name")}

        {/* Email Field */}
        {renderTextField("Email", email, setEmail, isEmailReadOnly, "email")}

        {/* State and Service Provider Fields (for Clients) */}
        {role === "Client" && (
          <>
            <FormControl className="lg:w-5/6 w-3/4" margin="normal">
              <InputLabel sx={{ color: theme === "dark" ? "white" : "black" }}>
                State
              </InputLabel>
              <Select
                label="State"
                value={selectedState}
                onChange={handleStateChange}
                sx={{
                  color: theme === "dark" ? "white" : "black",
                  "& .MuiSelect-icon": {
                    color: theme === "dark" ? "white" : "black",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "dark" ? "white" : "black",
                  },
                }}
                aria-label="Select State"
              >
                {uniqueStates.map((stateName) => (
                  <MenuItem key={stateName} value={stateName}>
                    {stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              className="lg:w-5/6 w-3/4"
              margin="normal"
              disabled={!selectedState}
            >
              <InputLabel sx={{ color: theme === "dark" ? "white" : "black" }}>
                Service Provider
              </InputLabel>
              <Select
                label="Service Provider"
                value={selectedServiceProvider}
                onChange={(e) => setSelectedServiceProvider(e.target.value)}
                sx={{
                  color: theme === "dark" ? "white" : "black",
                  "& .MuiSelect-icon": {
                    color: theme === "dark" ? "white" : "black",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme === "dark" ? "white" : "black",
                  },
                }}
                aria-label="Select Service Provider"
              >
                {states
                  .filter(
                    (stateObj) => getStateName(stateObj.state) === selectedState
                  )
                  .map((stateObj) => (
                    <MenuItem key={stateObj.state} value={stateObj.state}>
                      {getServiceProvider(stateObj.state)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </>
        )}

        {/* Submit Button */}
        <Button
          variant="contained"
          className="w-44 h-9 text-xl"
          onClick={handleSubmit}
          sx={{
            backgroundColor: theme === "dark" ? "gray.700" : "white",
            color: theme === "dark" ? "white" : "black",
            border: `1px solid ${theme === "dark" ? "white" : "black"}`,
            "&:hover": {
              backgroundColor: theme === "dark" ? "gray.600" : "gray.100",
            },
          }}
          aria-label="Submit Update"
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default Update;