import express from "express";
import {
  createride,
  farevalue,
  confirmRide,
  startRide,
  endRide,
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

riderrouter
  .route("/start-ride")
  .get(
    authc,
    query("rideId").isMongoId().withMessage("Invalid rideId"),
    query("otp")
      .isString()
      .isLength({ min: 6, max: 6 })
      .withMessage("Invalid otp"),
    startRide
  );

riderrouter
  .route("/end-ride")
  .post(
    authc,
    body("rideId").isMongoId().withMessage("Invalid rideId"),
    endRide
  );

export { riderrouter };
