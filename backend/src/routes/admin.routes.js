import express from "express";
import {
  addDets,
  addRangeDets,
  getDets,
  addPhoneno,
  googleLogin,
  login,
  register,
  resetPassword,
  sendMail,
  update,
  getClientDets,
  updateBilldets,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/authUser.middlerware.js";
import { verifyCode } from "../middleware/authCode.middleware.js";

const router = express.Router();

router.route("/bill-dets").post(addDets);

router.route("/range-dets").post(addRangeDets);

router.route("/data-dets").get(verifyJWT, getDets);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/google-login").post(googleLogin);

router.route("/add-phoneno").post(addPhoneno);

router.route("/update").post(verifyJWT, update);

router.route("/send-mail").get(sendMail);

router.route("/reset-password").post(verifyCode, resetPassword);

router.route("/getClientDets").get(getClientDets);

router.route("/update-bill").put(updateBilldets)

export default router;
