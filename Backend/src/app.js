import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true                
}));

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

export { app };
