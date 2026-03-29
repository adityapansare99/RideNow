import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import { router } from "./route/healthcheck.route.js";
app.use("/", router);

import { userrouter } from "./route/user.route.js";
app.use("/users", userrouter);

import { caprouter } from "./route/captain.route.js";
app.use("/captains", caprouter);

import { maprouter } from "./route/map.route.js";
app.use("/maps", maprouter);

import { riderrouter } from "./route/ride.route.js";
app.use("/rides", riderrouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err.errors || [],
    data: null,
  });
});


export { app };
