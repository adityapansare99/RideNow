import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import { Captain } from "../model/captain.model.js";

const auth = asynchandler(async (req, _, next) => {
  const token =
    req.cookies.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body.accesstoken;

  if (!token) {
    throw new ApiError(400, "token not found");
  }

  try {
    const decodedtoken = jwt.verify(token, process.env.accesstoken);
    if (!decodedtoken) {
      throw new ApiError(400, "invalid token");
    }

    const user = await User.findById(decodedtoken._id);
    if (!user) {
      throw new ApiError(400, "user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(400, "invalid token");
  }
});

const authc = asynchandler(async (req, _, next) => {
  const token =
    req.cookies.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body.accesstoken;

  if (!token) {
    throw new ApiError(400, "token not found");
  }

  try {
    const decodedtoken = jwt.verify(token, process.env.accesstoken);
    if (!decodedtoken) {
      throw new ApiError(400, "invalid token");
    }

    const captain = await Captain.findById(decodedtoken._id);
    if (!captain) {
      throw new ApiError(400, "user not found");
    }
    req.captain = captain;
    next();
  } catch (err) {
    throw new ApiError(400, "invalid token");
  }
});

export { auth, authc };
