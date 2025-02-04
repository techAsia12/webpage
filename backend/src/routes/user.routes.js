import express from "express";
import {
  getData,
  googleLogin,
  login,
  register,
  addPhoneno,
  update,
  sendMail,
  resetPassword,
  insertHourly,
  insertWeekly,
  insertYearly,
  sentData,
  retiveHourlyUsage,
  retiveYearlyUsage,
  retiveWeeklyUsage,
  getUserData,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/authUser.middlerware.js";
import { verifyCode } from "../middleware/authCode.middleware.js";

const router = express.Router();

router.route("/data").get(verifyJWT, getData);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/google-login").post(googleLogin);

router.route("/add-phoneno").post(addPhoneno);
  
router.route("/update").post(verifyJWT, update);

router.route("/send-mail").get(sendMail);

router.route("/reset-password").post(verifyCode, resetPassword);

router.route("/insert-hourly").post(insertHourly);

router.route("/insert-weekly").post(insertWeekly);

router.route("/insert-yearly").post(insertYearly);

router.route("/sentData").get(sentData);

router.route("/retrive-hourly").get(verifyJWT,retiveHourlyUsage);

router.route("/retrive-weekly").get(verifyJWT,retiveWeeklyUsage);

router.route("/retrive-yearly").get(verifyJWT,retiveYearlyUsage);

router.route("/retrive-user").get(verifyJWT,getUserData);

export default router;
