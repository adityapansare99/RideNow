import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { query } from "express-validator";
import {
  getcoordinates,
  getdistancetime,
  autocompletesuggestions,
} from "../controller/map.controller.js";

const maprouter = express.Router();

maprouter
  .route("/get-coordinates")
  .get(query("address").isString().isLength({ min: 3 }), auth, getcoordinates);

maprouter
  .route("/get-distance-time")
  .get(
    query("origin").isString().isLength({ min: 3 }),
    query("destination").isString().isLength({ min: 3 }),
    auth,
    getdistancetime
  );

maprouter
  .route("/get-suggestions")
  .get(
    query("input").isString().isLength({ min: 3 }),
    auth,
    autocompletesuggestions
  );

export { maprouter };
