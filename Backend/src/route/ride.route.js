import express from "express";
import { createride } from "../controller/ride.controller.js";
import { body } from "express-validator";
import { auth } from "../middleware/auth.middleware.js";

const riderrouter = express.Router();

riderrouter
  .route("/create-ride")
  .post(auth,
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

export { riderrouter };
