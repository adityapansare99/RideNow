import { Router } from "express";
import {
  registeruser,
  userLogin,
  refreshaccesstoken,
  logout,
  profile,
  generateOtp,
  editProfile,
  verifyOtp,
  deleteUser,
  rideHistory
} from "../controller/user.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import {
  uservalidation,
  loginvalidationresult,
} from "../middleware/validator.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const userrouter = Router();

userrouter.route("/register").post(uservalidation, registeruser);
userrouter.route("/login").post(loginvalidationresult, userLogin);
userrouter.route("/logout").post(auth, logout);
userrouter.route("/profile").get(auth, profile);
userrouter.route("/Generate-otp").post(generateOtp);
userrouter.route("/verify-otp").post(verifyOtp);
userrouter.route("/delete-user").delete(auth, deleteUser);
userrouter
  .route("/edit-profile")
  .put(auth, upload.single("image"), editProfile);

userrouter.route("/ride-history").get(auth, rideHistory);
userrouter.route("/refresh-token").post(refreshaccesstoken);

export { userrouter };
