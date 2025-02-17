import { React, useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion } from "motion/react";

const Meter = ({ color, value, maxValue, unit,initial,animate,transition }) => {
  const data = [
    { name: "Used", value: value },
    { name: "Remaining", value: Math.min(maxValue - value) },
  ];

  const COLORS = [color, "#e0e0e0"];
  const minValue = 0;
  const progress = Math.min(value, maxValue);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setAnimationDelay(1200); 
    }, 500); 

    return () => clearTimeout(delayTimer); 
  }, []);

  const isSmallScreen = screenWidth < 600 ? true : false;
  const [animationDelay, setAnimationDelay] = useState(0);

  return (
    <>
      <motion.Card className={`w-full sm:w-4/5 shadow-lg rounded-3xl p-4 mb-8 dark:bg-gray-800 dark:text-neutral-400`}
      initial={initial}
      animate={animate}
      transition={transition}
      >
        <CardContent>
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: isSmallScreen ? "80%" : "100%",
            }}
          >
            <PieChart
              width={isSmallScreen ? 200 : 400}
              height={isSmallScreen ? 150 : 250}
            >
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={isSmallScreen ? 50 : 130}
                outerRadius={isSmallScreen ? 80 : 200}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                animationDuration={3000}
                animationEasing="ease-in-out"
                isAnimationActive={animationDelay>0}
                animationBegin={animationDelay}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                align="center"
                layout={isSmallScreen ? "vertical" : "horizontal"}
                wrapperStyle={{
                  fontSize: isSmallScreen ? "0.6rem" : "1.2rem",
                  display: "block",
                  paddingTop: isSmallScreen ? "10px" : "10px",
                  marginLeft: isSmallScreen ? "-10px" : "0px",
                }}
              />
            </PieChart>

            <Box
              sx={{
                position: "absolute",
                top: isSmallScreen ? "65%" : "70%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{ fontSize: isSmallScreen ? "1rem" : "2rem" }}
                color={color}
              >
                {`${Math.round(progress)}${unit}`}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: isSmallScreen ? "75%" : "100%",
                left: isSmallScreen ? "15%" : "6%",
                transform: "translate(-20%, -80%)",
                fontSize: isSmallScreen ? "0.8rem" : "1.2rem",
              }}
            >
              {`${minValue}`}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: isSmallScreen ? "75%" : "100%",
                right: isSmallScreen ? "12%" : "2%",
                transform: "translate(20%, -80%)",
                fontSize: isSmallScreen ? "0.8rem" : "1.2rem",
              }}
            >
              {`${maxValue}`}
            </Typography>
          </Box>
        </CardContent>
      </motion.Card>
    </>
  );
};

export default Meter;
