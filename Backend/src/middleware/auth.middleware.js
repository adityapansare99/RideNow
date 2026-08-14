import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import { Captain } from "../model/captain.model.js";

const auth = asynchandler(async (req, _, next) => {
  const token =
    req.cookies?.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body?.accesstoken;

  if (!token) {
    throw new ApiError(401, "Access token is missing");
  }

  try {
    const decodedtoken = jwt.verify(token, process.env.accesstoken);
    if (!decodedtoken) {
      throw new ApiError(401, "Invalid or expired access token");
    }

    const user = await User.findOne({ email: decodedtoken.email });
    if (!user) {
      throw new ApiError(401, "Unauthorized. User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }
});

const authAny = asynchandler(async (req, _, next) => {
  const token =
    req.cookies?.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body?.accesstoken;

  if (!token) {
    throw new ApiError(401, "Access token is missing");
  }

  let decodedtoken;
  try {
    decodedtoken = jwt.verify(token, process.env.accesstoken);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  if (!decodedtoken?.email) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const [user, captain] = await Promise.all([
    User.findOne({ email: decodedtoken.email }),
    Captain.findOne({ email: decodedtoken.email }),
  ]);

  if (user) {
    req.user = user;
  } else if (captain) {
    req.captain = captain;
  } else {
    throw new ApiError(401, "Unauthorized. User not found");
  }

  next();
});

const authc = asynchandler(async (req, _, next) => {
  const token =
    req.cookies?.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body?.accesstoken;

  if (!token) {
    throw new ApiError(401, "Access token is missing");
  }

  try {
    const decodedtoken = jwt.verify(token, process.env.accesstoken);

    if (!decodedtoken) {
      throw new ApiError(401, "Invalid or expired access token");
    }

    const captain = await Captain.findOne({ email: decodedtoken.email });
    if (!captain) {
      throw new ApiError(401, "Unauthorized. Captain not found");
    }
    req.captain = captain;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }
});

export { auth, authc, authAny };
