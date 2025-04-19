import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

import { router } from "./route/healthcheck.route.js";
app.use('/uber/api/v1/healthcheck',router);

export { app };
