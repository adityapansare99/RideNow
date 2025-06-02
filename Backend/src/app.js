import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

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

export { app };
