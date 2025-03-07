import { Card, CardContent } from "@mui/material";
import React from "react";

const CardTemp = ({ color, name, value, unit }) => {
  return (
    <>
      <Card className="sm:w-4/5 lg:w-full shadow-lg rounded-full mb-8 pr-1 bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,0,0,0.2),rgba(0,0,0,0))] dark:bg-neutral-950 dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] border">
        <CardContent>
          <h1 className="lg:text-3xl text-xl text-neutral-400 w-full">
            {name}
          </h1>
          <p className={`ml-14 lg:text-6xl text-2xl ${color}`}>
            {value || 0} {unit}
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default CardTemp;
