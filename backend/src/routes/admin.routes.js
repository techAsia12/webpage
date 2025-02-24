import express from "express";
import {
  addDets,
  addRangeDets,
  getDets,
  addPhoneno,
  googleLogin,
  login,
  register,
  update,
  getClientDets,
  updateBilldets,
  updateProfile,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/authUser.middlerware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/bill-dets").post(addDets);

router.route("/range-dets").post(addRangeDets);

router.route("/data-dets").get(verifyJWT, getDets);

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/google-login").post(googleLogin);

router.route("/add-phoneno").post(addPhoneno);

router.route("/update").post(verifyJWT,update);

router.route("/getClientDets").get(getClientDets);

router.route("/update-bill").put(updateBilldets)

router.route("/profileUpdate").post(verifyJWT,upload.single('profile') ,updateProfile);

export default router;
