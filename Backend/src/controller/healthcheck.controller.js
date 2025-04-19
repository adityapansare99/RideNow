import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const healthcheck = asynchandler((req, res) => {
  res.status(200).json(new ApiResponse(200, {}, "Server Running Fine"));
});

export { healthcheck };
