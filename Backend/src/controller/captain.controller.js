import { Captain } from "../model/captain.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { authc } from "../middleware/auth.middleware.js";

//register captain
const registercaptain = asynchandler(async (req, res) => {
  const { fullname, email, password, vehicle } = req.body;

  const exists = await Captain.findOne({ email });

  if (exists) {
    throw new ApiError(400, "Captain already exists");
  }

  const captain = await Captain.create({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vechiletype: vehicle.vechiletype,
  });

  if (!captain) {
    throw new ApiError(400, "Captain not created");
  }

  const captainid = await Captain.findById(captain._id);

  if (!captainid) {
    throw new ApiError(400, "Captain not created");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accesstoken, refreshtoken },
        "captain registered successfully"
      )
    );
});

//login captain
const logincaptain = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const captain = await Captain.findOne({ email });

  if (!captain) {
    throw new ApiError(400, "Captain not found");
  }

  const isPasswordCorrect = await captain.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is wrong");
  }

  const { accesstoken, refreshtoken } = await Generatingaccessandrefreshtoken(
    captain._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  const loggeduser = await Captain.findOne(captain._id).select(
    "-password -refershtoken"
  );

  if (!loggeduser) {
    throw new ApiError(400, "Captain not found");
  }

  res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggeduser, accesstoken, refreshtoken },
        "successfully logged in"
      )
    );
});

//token generation
const Generatingaccessandrefreshtoken = async (capid) => {
  try {
    const captain = await Captain.findById(capid);

    if (!captain) {
      console.log("Captain not found in data base , first register to app");
      return null;
    }
    const refreshtoken = captain.Generatingrefershtoken();
    const accesstoken = captain.Generatingaccesstoken();

    captain.refreshtoken = refreshtoken;

    await captain.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (err) {
    throw new ApiError(404, "NOT able to generate the tokens");
  }
};

//get captain profile
const profile = asynchandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.captain, "captain profile"));
});

//logout captain
const logout = asynchandler(async (req, res) => {
  await Captain.findOneAndUpdate(
    req.captain._id,
    {
      $set: {
        refreshtoken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refereshtoken", options)
    .json(new ApiResponse(200, {}, "logged out successfully"));
});

export{
    registercaptain,
    logincaptain,
    profile,
    logout}
