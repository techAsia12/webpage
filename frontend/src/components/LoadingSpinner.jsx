import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      className="loading-spinner dark:bg-gray-800 dark:text-white"
    >
      <ElectricBoltIcon className="z-50 transform translate-x-14 dark:text-white" />
      <CircularProgress size={80} color="inherit" className="dark:text-white" />
    </Box>
  );
};

export default LoadingSpinner;
