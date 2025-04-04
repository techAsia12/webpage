import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

const SemiCircularProgress = ({
  value = 0,
  max = 10000,
  initialThreshold = 7000,
  size = 700,
  thickness = 80,
  color = "#4BB543",
  thresholdColor = "#FF0000",
  backgroundColor = "#d1d5db",
  showValue = true,
  unit = " ₹",
  label = "Total Cost",
  animationDuration = 0.8,
  showThresholdMarker = true,
  innerValue = 0,
  innerMax = 100,
  innerColor = "#3b82f6",
  innerUnit = "₹",
  innerLabel = "Cost Today",
  showInnerRing = false,
}) => {
  const theme = useTheme();
  const mode = useSelector((state) => state.theme.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [threshold, setThreshold] = useState(initialThreshold);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const progressPathRef = useRef(null);
  const innerProgressPathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [innerPathLength, setInnerPathLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMax, setCurrentMax] = useState(innerMax);

  // Initialize with safe defaults
  const safeValue = isNaN(value) ? 0 : Math.max(0, value);
  const safeMax = isNaN(max) ? 10000 : Math.max(1, max);
  const safeThreshold = isNaN(threshold)
    ? initialThreshold
    : Math.max(0, threshold);
  const safeInnerValue = isNaN(innerValue) ? 0 : Math.max(0, innerValue);
  const safeInnerMax = isNaN(currentMax) ? 100 : Math.max(1, currentMax);

  const handleSetThreshold = async () => {
    if (!inputValue || isNaN(inputValue)) {
      toast.error("Please enter a valid threshold value.");
      return;
    }

    const newThreshold = Number(inputValue);
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (innerValue >= currentMax * 0.8) {
      setCurrentMax((prevMax) => prevMax + prevMax * 0.5);
    }
  }, [innerValue]);

  const responsiveSize = isMobile ? 350 : isTablet ? 650 : size;
  const responsiveTextSize = isMobile ? "35%" : "40%";
  const responsiveThickness = isMobile ? 40 : isTablet ? 45 : thickness;
  const innerThickness = responsiveThickness * 0.6;
  const radius = responsiveSize / 2 - responsiveThickness / 2;
  const innerRadius = radius * 0.7;
  const circumference = Math.PI * radius;
  const innerCircumference = Math.PI * innerRadius;

  const displayValue = Math.min(Math.max(safeValue, 0), safeMax);
  const progressRatio = Math.min(displayValue / safeMax, 1);
  const thresholdRatio = Math.min(safeThreshold / safeMax, 1);
  const isOverThreshold = displayValue > safeThreshold;

  const innerDisplayValue = Math.min(Math.max(safeInnerValue, 0), safeInnerMax);
  const innerProgressRatio = Math.min(innerDisplayValue / safeInnerMax, 1);

  const effectiveLength = pathLength || circumference;
  const innerEffectiveLength = innerPathLength || innerCircumference;
  const progressDashOffset = effectiveLength * (1 - progressRatio);
  const innerProgressDashOffset =
    innerEffectiveLength * (1 - innerProgressRatio);

  const centerX = responsiveSize / 2;
  const centerY = responsiveSize / 2 + responsiveThickness / 2;

  const arcPath = `M ${
    centerX - radius
  },${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius},${centerY}`;

  const innerArcPath = `M ${
    centerX - innerRadius
  },${centerY} A ${innerRadius} ${innerRadius} 0 0 1 ${
    centerX + innerRadius
  },${centerY}`;

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
    return isNaN(amount)
      ? "0"
      : new Intl.NumberFormat("en-IN", {
          maximumFractionDigits: 0,
        }).format(amount);
  };

  useEffect(() => {
    setThreshold(initialThreshold);
    setIsLoading(false);
  }, [initialThreshold]);

  useLayoutEffect(() => {
    if (progressPathRef.current) {
      const length = progressPathRef.current.getTotalLength();
      setPathLength(length);
    }
    if (innerProgressPathRef.current) {
      const length = innerProgressPathRef.current.getTotalLength();
      setInnerPathLength(length);
    }
  }, [responsiveSize, responsiveThickness]);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: responsiveSize,
          height: responsiveSize / 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: responsiveSize,
          height: isMobile ? responsiveSize / 2 : responsiveSize / 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
          px: isMobile ? 1 : 2,
        }}
      >

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
              d={arcPath}
              fill="none"
              stroke={backgroundColor}
              strokeWidth={responsiveThickness}
              strokeLinecap="round"
            />

            {/* Progress Track */}
            <motion.path
              ref={progressPathRef}
              d={arcPath}
              fill="none"
              stroke={isOverThreshold ? thresholdColor : color}
              strokeWidth={responsiveThickness}
              strokeLinecap="round"
              strokeDasharray={effectiveLength}
              strokeDashoffset={progressDashOffset}
              initial={{ strokeDashoffset: effectiveLength }}
              animate={{ strokeDashoffset: progressDashOffset }}
              transition={{ duration: animationDuration }}
            />

            {/* Inner Ring - Background */}
            {showInnerRing && (
              <path
                d={innerArcPath}
                fill="none"
                stroke={`${backgroundColor}80`} // Slightly transparent
                strokeWidth={innerThickness}
                strokeLinecap="round"
              />
            )}

            {/* Inner Ring - Progress */}
            {showInnerRing && (
              <motion.path
                ref={innerProgressPathRef}
                d={innerArcPath}
                fill="none"
                stroke={innerColor}
                strokeWidth={innerThickness}
                strokeLinecap="round"
                strokeDasharray={innerEffectiveLength}
                strokeDashoffset={innerProgressDashOffset}
                initial={{ strokeDashoffset: innerEffectiveLength }}
                animate={{ strokeDashoffset: innerProgressDashOffset }}
                transition={{ duration: animationDuration * 1.2 }}
              />
            )}

            {/* Threshold Marker */}
            {showThresholdMarker && safeThreshold > 0 && (
              <>
                <line
                  x1={
                    isMobile
                      ? thresholdPosition.x - 16
                      : thresholdPosition.x - 40
                  }
                  y1={thresholdPosition.y + 20}
                  x2={markerTipPosition.x}
                  y2={markerTipPosition.y + 9}
                  stroke={thresholdColor}
                  strokeWidth={isMobile ? 5 : 10}
                  strokeDasharray="1 0.5"
                />
                <path
                  d={`M ${markerTipPosition.x} ${markerTipPosition.y} 
         L ${markerTipPosition.x + 15} ${markerTipPosition.y - 10}
         L ${markerTipPosition.x + 15} ${markerTipPosition.y + 10} Z`}
                  fill={thresholdColor}
                  stroke="#fff"
                  strokeWidth={1.5}
                  transform={`rotate(${thresholdAngle * (180 / Math.PI) + 90} ${
                    markerTipPosition.x
                  } ${markerTipPosition.y})`}
                  style={{
                    filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
                  }}
                />
              </>
            )}
          </svg>

          {/* Threshold Label */}
          {showThresholdMarker && safeThreshold > 0 && (
            <div
              style={{
                position: "absolute",
                left: `${(labelPosition.x / responsiveSize) * 100}%`,
                top: `${(labelPosition.y / responsiveSize) * 100}%`,
                transform: isMobile
                  ? "translate(-110%,-200%)"
                  : "translate(-160%, -50%)",
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
              className="cursor-pointer"
              onClick={() => {
                setInputValue(safeThreshold.toString());
                setShowModal(true);
              }}
            >
              Limit:{unit} {formatCurrency(safeThreshold)}
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
                marginTop={isMobile ? "-200%" : "-280%"}
              >
                {unit}
                {formatCurrency(displayValue)}
              </Typography>

              {/* Inner Ring Value Display */}
              {showInnerRing && (
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 600,
                    color: innerColor,
                    lineHeight: 1,
                    mt: 1,
                  }}
                >
                  {innerUnit}
                  {innerDisplayValue.toFixed(1)}
                </Typography>
              )}

              {isOverThreshold && (
                <Typography variant="caption" sx={{ color: thresholdColor }}>
                  {unit} over
                  {formatCurrency(displayValue - safeThreshold)}
                </Typography>
              )}
            </motion.div>
          )}
        </Box>

        {/* Labels and Date */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            mt:"-20%"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: color,
                marginRight: 1,
              }}
            />
            <Typography variant="caption" color={color}>
              {label}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: innerColor,
                marginRight: 1,
              }}
            />
            <Typography variant="caption" color={innerColor}>
              {innerLabel}
            </Typography>
          </Box>
        </Box>

      </Box>

      {/* Threshold Setting Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-4">Set Threshold</h2>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border p-2 w-full mb-4 dark:bg-gray-600"
              placeholder={`Enter threshold (0-${safeMax})`}
              min="0"
              max={safeMax}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white dark:bg-black dark:hover:bg-gray-900 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleSetThreshold}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-black border dark:hover:bg-gray-900 text-white rounded"
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
