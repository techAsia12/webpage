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
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Check as CheckIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { updatePage } from "../Features/pages/pages.slice";
import CancelIcon from "@mui/icons-material/Cancel";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

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

  const options = {
    withCredentials: true,
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedServiceProvider("");
  };

  const getStateName = (stateString) => stateString.split("_")[1];
  const getServiceProvider = (stateString) => stateString.split("_")[0];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/retrive-stateDets`)
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

  const uniqueStates = Array.from(
    new Set(states.map((stateObj) => getStateName(stateObj.state)))
  );

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
    />
  );

  if (loading) {
    return (
      <div className="fixed w-full h-full bg-black/50 flex justify-center items-center z-40">
        <ElectricBoltIcon className="z-50" />
        <CircularProgress size={80} color="inherit" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center  dark:text-white lg:p-40  pt-20 ">
      <CancelIcon
        className="absolute top-10 lg:top-24 right-1 lg:right-1/3 cursor-pointer"
        color="error"
        onClick={() => dispatch(updatePage())}
        fontSize="large"
      />

      <Box className="flex flex-col items-center justify-center space-y-10 w-3/4 lg:w-1/3 lg:p-10 p-5 border  rounded-3xl ">
        <Avatar alt="User Avatar" src="" sx={{ width: 60, height: 60 }} />

        {renderTextField("Name", name, setName, isNameReadOnly, "name")}
        {renderTextField("Email", email, setEmail, isEmailReadOnly, "email")}

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
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default Update;
