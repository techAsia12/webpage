import express from "express";
import {
  getData,
  googleLogin,
  login,
  register,
  addPhoneno,
  update,
  sendVerificationMail,
  resetPassword,
  sentData,
  retiveHourlyUsage,
  retiveYearlyUsage,
  retiveWeeklyUsage,
  getUserData,
  retriveState,
  deleteUser,
  updateProfile,
  retiveCostToday,
  sendMail,
  setThershold,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/authUser.middlerware.js";
import { verifyCode } from "../middleware/authCode.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/data").get(verifyJWT, getData);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/google-login").post(googleLogin);

router.route("/add-phoneno").post(addPhoneno);

router.route("/update").post(verifyJWT, upload.single("profile"), update);

router.route("/receive-mail").get(sendVerificationMail);

router.route("/verifyCode").post(verifyCode);

router.route("/reset-password").post(resetPassword);

router.route("/sentData").get(sentData);

router.route("/retrive-hourly").get(verifyJWT, retiveHourlyUsage);

router.route("/retrive-weekly").get(verifyJWT, retiveWeeklyUsage);

router.route("/retrive-yearly").get(verifyJWT, retiveYearlyUsage);

router.route("/retrive-user").get(verifyJWT, getUserData);

router.route("/retrive-costToday").get(verifyJWT, retiveCostToday);

router.route("/retrive-stateDets").get(retriveState);

router.route("/delete").delete(verifyJWT, deleteUser);

router.route("/send-Mail").post(sendMail);

router
  .route("/profileUpdate")
  .post(verifyJWT, upload.single("profile"), updateProfile);

router.route("/set-threshold").post(verifyJWT, setThershold);

export default router;
