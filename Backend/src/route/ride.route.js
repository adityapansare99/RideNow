import express from "express";
import {
  createride,
  farevalue,
  confirmRide,
} from "../controller/ride.controller.js";
import { body, query } from "express-validator";
import { auth, authc } from "../middleware/auth.middleware.js";

const riderrouter = express.Router();

riderrouter
  .route("/create-ride")
  .post(
    auth,
    body("pickup")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Invalid pickup"),
    body("destination")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Invalid destination"),
    body("vehicleType")
      .isString()
      .isIn(["car", "auto", "moto"])
      .withMessage("Invalid vehicle type"),
    createride
  );

riderrouter
  .route("/get-fare")
  .get(
    auth,
    query("pickup")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Invalid pickup"),
    query("destination").isString().isLength({ min: 3 }),
    farevalue
  );

riderrouter
  .route("/confirm")
  .post(
    authc,
    body("rideId").isMongoId().withMessage("Invalid rideId"),
    confirmRide
  );

export { riderrouter };
