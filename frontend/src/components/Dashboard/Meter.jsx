import { React, useState, useEffect } from "react";
import { Box, Typography, CardContent } from "@mui/material";
import { motion } from "framer-motion";


const Meter = ({
  outerColor = "#ed9d00",       
  innerColor = "#34d399",       
  outerValue = 0,               
  innerValue = 0,               
  outerMax = 350,               
  innerMax = 30,                
  outerUnit = "V",              
  innerUnit = "A",              
  outerLabel = "Voltage",       
  innerLabel = "Current",        
  initial = { y: 100, opacity: 0 },
  animate = { y: 0, opacity: 1 },
  transition = { duration: 1, delay: 1.2 },
  date                           
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const outerProgress = Math.min((outerValue / outerMax) * 100, 100);
  const innerProgress = Math.min((innerValue / innerMax) * 100, 100);

  const displayDate = date || new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = screenWidth < 600;
  const size = isSmallScreen ? 220 : 320;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.75;
  const ringWidth = isSmallScreen ? 10 : 14;

  return (
    <motion.Card
      className="w-full shadow-none rounded-3xl bg-transparent"
      initial={initial}
      animate={animate}
      transition={transition}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
         
          <Box sx={{
            position: "relative",
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Voltage Ring (Orange) - Outer */}
            <Ring 
              radius={outerRadius}
              width={ringWidth}
              progress={outerProgress}
              color={outerColor}
            />
            
            {/* Current Ring (Green) - Inner */}
            <Ring 
              radius={innerRadius}
              width={ringWidth}
              progress={innerProgress}
              color={innerColor}
              offset={30}
            />

            {/* Center Display */}
            <Box sx={{
              position: "absolute",
              width: innerRadius * 0.9,
              height: innerRadius * 0.9,
              borderRadius: "50%",
              zIndex: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold",
                color: outerColor,
                fontSize: isSmallScreen ? "1.8rem" : "2.5rem",
                lineHeight: 1
              }}>
                {outerValue.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: outerColor,
                fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
                mb: 1
              }}>
                {outerUnit}
              </Typography>
              
              <Typography variant="h6" sx={{ 
                fontWeight: "bold",
                color: innerColor,
                fontSize: isSmallScreen ? "1.8rem" : "2.5rem",
                lineHeight: 1,
                mt: 1
              }}>
                {innerValue.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: innerColor,
                fontSize: isSmallScreen ? "0.7rem" : "0.9rem"
              }}>
                {innerUnit}
              </Typography>
            </Box>
          </Box>

          {/* Labels and Date */}
          <Box sx={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            mt: 1
          }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: outerColor,
                marginRight: 1
              }} />
              <Typography variant="caption" color={outerColor}>{outerLabel}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: innerColor,
                marginRight: 1
              }} />
              <Typography variant="caption" color={innerColor}>{innerLabel}</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </motion.Card>
  );
};

// Ring component using SVG for perfect circles
const Ring = ({ radius, width, progress, color, offset = 0 }) => {
  const circumference = 2 * Math.PI * (radius - width/2);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box sx={{
      position: "absolute",
      width: radius * 2,
      height: radius * 2,
    }}>
      <svg
        width={radius * 2}
        height={radius * 2}
        style={{ transform: `rotate(${offset}deg)` }}
      >
        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - width/2}
          fill="none"
          stroke={`${color}30`}
          strokeWidth={width}
        />
        {/* Progress circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius - width/2}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
    </Box>
  );
};

export default Meter;