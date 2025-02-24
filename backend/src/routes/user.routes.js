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
  retriveState,
  deleteUser,
  updateProfile,
  verifyCode
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/authUser.middlerware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/data").get(verifyJWT, getData);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/google-login").post(googleLogin);

router.route("/add-phoneno").post(addPhoneno);

router.route("/update").post(verifyJWT, upload.single("profile"), update);

router.route("/send-mail").get(sendMail);

router.route("/verifyCode").post(verifyCode);

router.route("/reset-password").post(resetPassword);

router.route("/insert-hourly").post(insertHourly);

router.route("/insert-weekly").post(insertWeekly);

router.route("/insert-yearly").post(insertYearly);

router.route("/sentData").get(sentData);

router.route("/retrive-hourly").get(verifyJWT, retiveHourlyUsage);

router.route("/retrive-weekly").get(verifyJWT, retiveWeeklyUsage);

router.route("/retrive-yearly").get(verifyJWT, retiveYearlyUsage);

router.route("/retrive-user").get(verifyJWT, getUserData);

router.route("/retrive-stateDets").get(retriveState);

router.route("/delete").delete(verifyJWT, deleteUser);

router
  .route("/profileUpdate")
  .post(verifyJWT, upload.single("profile"), updateProfile);

export default router;
