import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa";

const SemiCircularProgress = ({
  value = 0,
  max = 10000,
  initialThreshold = 7000,
  size = 700,
  thickness = 80,
  color = "#4BB543",
  thresholdColor = "#FF0000",
  backgroundColor = "#f5f5f5",
  showValue = true,
  unit = "Rs",
  label = "Total Cost",
  animationDuration = 0.8,
  showThresholdMarker = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [threshold, setThreshold] = useState(initialThreshold);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setThreshold(initialThreshold);
  }, [initialThreshold]);

  const handleSetThreshold = async () => {
    if (!inputValue || isNaN(inputValue)) {
      toast.error("Please enter a valid threshold value.");
      return;
    }

    const newThreshold = Number(inputValue);
    if (newThreshold <= 0 || newThreshold > max) {
      toast.error(`Threshold must be between 0 and ${max}`);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/set-threshold`,
        { threshold: newThreshold },
        { withCredentials: true }
      );
      setThreshold(newThreshold);
      toast.success("Threshold set successfully!");
      setShowModal(false);
      setInputValue("");
    } catch (err) {
      toast.error("Failed to set threshold. Please try again.");
    }
  };

  // Responsive sizing calculations
  const responsiveSize = isMobile ? 350 : isTablet ? 650 : size;
  const responsiveTextSize = isMobile ? "35%" : "40%";
  const responsiveThickness = isMobile ? 40 : isTablet ? 45 : thickness;
  const radius = responsiveSize / 2 - responsiveThickness / 2;
  const circumference = Math.PI * radius;

  // Value calculations
  const displayValue = Math.min(Math.max(value, 0), max);
  const progressRatio = displayValue / max;
  const thresholdRatio = threshold / max;
  const isOverThreshold = displayValue > threshold;

  // Progress dash offset calculation
  const progressDashOffset = circumference - progressRatio * circumference;

  // Center point calculation
  const centerX = responsiveSize / 2;
  const centerY = responsiveSize / 2 + responsiveThickness / 2;

  // Threshold marker calculations
  const thresholdAngle = Math.PI * (1 - thresholdRatio);
  const getMarkerPosition = (angle, distanceFromArc) => ({
    x: centerX + (radius + distanceFromArc) * Math.cos(angle),
    y: centerY - (radius + distanceFromArc) * Math.sin(angle),
  });

  const thresholdPosition = getMarkerPosition(thresholdAngle, 0);
  const markerTipPosition = getMarkerPosition(
    thresholdAngle,
    responsiveThickness * 0.8
  );
  const labelPosition = getMarkerPosition(
    thresholdAngle,
    responsiveThickness * 1.5
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: responsiveSize,
          height: isMobile?responsiveSize/2:responsiveSize / 2.5 ,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
          px: isMobile ? 1 : 2,
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center w-full mb-2">
          <Typography variant="h6" className="dark:text-white" ml={responsiveTextSize}>
            {label}
          </Typography>
          <FaPlus
            className="text-neutral-400 cursor-pointer hover:text-neutral-600"
            onClick={() => {
              setInputValue(threshold.toString());
              setShowModal(true);
            }}
            aria-label="Set threshold"
          />
        </div>

        {/* Progress Visualization */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: responsiveSize / 2,
            mb: isMobile ? 1 : 2,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${responsiveSize} ${responsiveSize}`}
            style={{ overflow: "visible" }}
          >
            {/* Background Track */}
            <path
              d={`M ${centerX - radius},${centerY} 
                 A ${radius} ${radius} 0 0 1 ${centerX + radius},${centerY}`}
              fill="none"
              stroke={backgroundColor}
              strokeWidth={responsiveThickness}
              strokeLinecap="round"
            />

            {/* Progress Track */}
            <motion.path
              d={`M ${centerX - radius},${centerY} 
                 A ${radius} ${radius} 0 0 1 ${centerX + radius},${centerY}`}
              fill="none"
              stroke={isOverThreshold ? thresholdColor : color}
              strokeWidth={responsiveThickness}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressDashOffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progressDashOffset }}
              transition={{ duration: animationDuration }}
            />

            {/* Threshold Marker */}
            {showThresholdMarker && threshold > 0 && (
              <>
                <line
                  x1={thresholdPosition.x}
                  y1={thresholdPosition.y}
                  x2={markerTipPosition.x}
                  y2={markerTipPosition.y}
                  stroke={thresholdColor}
                  strokeWidth={2}
                  strokeDasharray="10 10"
                />
                <circle
                  cx={markerTipPosition.x}
                  cy={markerTipPosition.y}
                  r={6}
                  fill={thresholdColor}
                  stroke="#fff"
                  strokeWidth={1}
                />
              </>
            )}
          </svg>

          {/* Threshold Label */}
          {showThresholdMarker && threshold > 0 && (
            <div
              style={{
                position: "absolute",
                left: `${(labelPosition.x / responsiveSize) * 100}%`,
                top: `${(labelPosition.y / responsiveSize) * 100}%`,
                transform:isMobile?"translate(-85%,-150%)" : "translate(-120%, -50%)",
                color: thresholdColor,
                fontSize: theme.typography.pxToRem(12),
                fontWeight: 600,
                backgroundColor: theme.palette.background.paper,
                padding: "2px 8px",
                borderRadius: "12px",
                boxShadow: theme.shadows[2],
                whiteSpace: "nowrap",
                border: `1px solid ${thresholdColor}`,
              }}
            >
              Limit: {formatCurrency(threshold)}
              {unit}
            </div>
          )}
        </Box>

        {/* Value Display */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            textAlign: "center",
          }}
        >
          {showValue && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                color: isOverThreshold
                  ? thresholdColor
                  : theme.palette.text.primary,
              }}
              transition={{ delay: animationDuration * 0.5 }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  color: isOverThreshold ? thresholdColor : color,
                  lineHeight: 1.1,
                }}
                marginTop={isMobile?"-150%":"-220%"}
              >
                {formatCurrency(displayValue)}
                {unit}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1 }}
              >
                of {formatCurrency(max)}
                {unit}
              </Typography>
              {isOverThreshold && (
                <Typography variant="caption" sx={{ color: thresholdColor }}>
                  {formatCurrency(displayValue - threshold)}
                  {unit} over
                </Typography>
              )}
            </motion.div>
          )}
        </Box>
      </Box>

      {/* Threshold Setting Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4">Set Threshold</h2>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder={`Enter threshold (0-${max})`}
              min="0"
              max={max}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSetThreshold}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default SemiCircularProgress;
