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
} from "../controller/captain.controller.js";

const caprouter = Router();

caprouter.route("/register").post(captainvalidation, registercaptain);
caprouter.route("/login").post(caploginresult, logincaptain);
caprouter.route("/logout").post(authc, logout);
caprouter.route("/profile").get(authc, profile);

export { caprouter };
