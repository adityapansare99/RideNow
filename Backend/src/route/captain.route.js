import { Router } from "express";
import { authc } from "../middleware/auth.middleware.js";
import {
  captainvalidation,
  caploginresult,
} from "../middleware/validator.middleware.js";
import {
  registercaptain,
  logincaptain,
  profile,
  logout,
  captainHistroy,
  verifyOtp,
  generateOtp,
  deleteCaptain,
  editProfile,
  rideHistory,
  getAverageRating
} from "../controller/captain.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const caprouter = Router();

caprouter.route("/register").post(captainvalidation, registercaptain);
caprouter.route("/login").post(caploginresult, logincaptain);
caprouter.route("/logout").post(authc, logout);
caprouter.route("/profile").get(authc, profile);
caprouter.route("/history").get(authc, captainHistroy);
caprouter.route("/Generate-otp").post(generateOtp);
caprouter.route("/verify-otp").post(verifyOtp);
caprouter.route("/delete-captain").delete(authc, deleteCaptain);
caprouter.route("/edit-profile").put(authc,upload.single("profilepic"),editProfile);
caprouter.route("/ride-history").get(authc,rideHistory);
caprouter.route("/average-rating").get(authc,getAverageRating);
export { caprouter };
