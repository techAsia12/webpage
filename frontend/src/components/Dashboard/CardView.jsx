import {Card,CardContent} from "@mui/material"
import React from 'react'

const CardTemp = ({color,name,value,unit}) => {
  return (
    <>
    <Card className="sm:w-4/5 lg:w-full shadow-lg rounded-3xl mb-8 pr-1 dark:bg-gray-800">
        <CardContent>
          <h1 className="lg:text-3xl text-xl text-neutral-400 w-full">{name}</h1>
          <p className={`ml-14 lg:text-6xl text-2xl ${color}`}>{value} {unit}</p>
        </CardContent>
    </Card>
    </>
  )
}

export default CardTemp