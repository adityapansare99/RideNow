import { Router } from "express";
import {
  registeruser,
  userLogin,
  refreshaccesstoken,
  logout,
  profile,
  generateOtp
} from "../controller/user.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import {
  uservalidation,
  loginvalidationresult,
} from "../middleware/validator.middleware.js";
const userrouter = Router();

userrouter.route("/register").post(uservalidation, registeruser);
userrouter.route("/login").post(loginvalidationresult, userLogin);
userrouter.route("/logout").post(auth, logout);
userrouter.route("/profile").get(auth, profile);
userrouter.route("/otp").post(generateOtp);

export { userrouter };
