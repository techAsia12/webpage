import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express()

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://smartenergymeter.techasiamechatronics.com", 
      "https://webpage-pearl-sigma.vercel.app", 
    ],
    methods: "GET,POST,PUT,DELETE", 
    credentials: true, 
  })
);

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.set("trust proxy",1);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
//"C:\Users\priye\AndroidStudioProjects\SmartEnergyMeter\app\build\outputs\apk\debug\app-debug.apk"
import  userRoute from "./routes/user.routes.js";
import  adminRoute from "./routes/admin.routes.js";
import {errorHandler} from "./middleware/errorHandling.middleware.js"

app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);
app.use(errorHandler);

export default app;