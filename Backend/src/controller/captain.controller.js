import { Captain } from "../model/captain.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import Histroy from "../model/captainHistroy.model.js";
import twilio from "twilio";
import { storeOtp, verifyStoredOtp } from "../service/otpStore.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { Ride } from "../model/ride.model.js";

const registercaptain = asynchandler(async (req, res) => {
  const { fullname, email, password, vehicle, mobile } = req.body;

  const exists = await Captain.findOne({ email });

  if (exists) {
    throw new ApiError(409, "Captain with this email already exists");
  }

  const captain = await Captain.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicletype: vehicle.vehicletype,
    },
    mobile,
  });

  if (!captain) {
    throw new ApiError(500, "Captain registration failed. Please try again");
  }

  await Histroy.create({
    captain_id: captain._id,
    dist: [0],
    time: [0],
    earning: [0],
  });

  const captainid = await Captain.findById(captain._id).select(
    "-password -refreshtoken",
  );

  if (!captainid) {
    throw new ApiError(500, "Captain registration failed. Please try again");
  }

  const { accesstoken, refreshtoken } = await Generatingaccessandrefreshtoken(
    captainid.email,
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(201)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiResponse(
        201,
        { captain: captainid, accesstoken, refreshtoken },
        "captain registered successfully",
      ),
    );
});

const logincaptain = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const captain = await Captain.findOne({ email });

  if (!captain) {
    throw new ApiError(404, "No captain found with this email");
  }

  const isPasswordCorrect = await captain.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials. Please check your password");
  }

  const { accesstoken, refreshtoken } = await Generatingaccessandrefreshtoken(
    captain.email,
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  const loggeduser = await Captain.findOne({ email: captain.email }).select(
    "-password -refreshtoken",
  );

  if (!loggeduser) {
    throw new ApiError(500, "Failed to retrieve captain data after login");
  }

  res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggeduser, accesstoken, refreshtoken },
        "successfully logged in",
      ),
    );
});

const Generatingaccessandrefreshtoken = async (capEmail) => {
  try {
    const captain = await Captain.findOne({ email: capEmail });

    if (!captain) {
      throw new ApiError(404, "Captain not found");
    }
    const refreshtoken = captain.Generatingrefershtoken();
    const accesstoken = captain.Generatingaccesstoken();

    captain.refreshtoken = refreshtoken;

    await captain.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (err) {
    throw new ApiError(500, "Failed to generate authentication tokens");
  }
};

const profile = asynchandler(async (req, res) => {
  const captain = await Captain.findById(req.captain._id).select(
    "-password -refreshtoken",
  );

  if (!captain) {
    throw new ApiError(404, "Captain profile not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { captain }, "Captain profile fetched successfully"),
    );
});

const logout = asynchandler(async (req, res) => {
  await Captain.findOneAndUpdate(
    req.captain._id,
    {
      $unset: { refreshtoken: 1 },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "logged out successfully"));
});

const captainHistroy = asynchandler(async (req, res) => {
  const captain_id = req.captain._id;

  if (!captain_id) {
    throw new ApiError(404, "Captain not found");
  }

  const history = await Histroy.findOne({ captain_id }).select("-captain_id");

  if (!history) {
    throw new ApiError(404, "No history record found for this captain");
  }

  const totalDist = Number(
    history.dist.reduce((sum, val) => sum + val, 0).toFixed(2),
  );
  const totalTime = Number(
    history.time.reduce((sum, val) => sum + val, 0).toFixed(2),
  );
  const totalEarning = Number(
    history.earning.reduce((sum, val) => sum + val, 0).toFixed(2),
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalDist, totalTime, totalEarning },
        "Captain stats fetched successfully",
      ),
    );
});

const client = twilio(process.env.Twilio_SID, process.env.Twilio_AUTH_TOKEN);

const sendOtpToMobile = async (mobile, otp) => {
  const response = await client.messages.create({
    body: `RideNow Rider OTP: ${otp}\n\nUse this code to verify your phone number. Valid for 5 minutes. Do not share it with anyone.`,
    from: process.env.Twilio_PHONE_NUMBER,
    to: `+91${mobile}`,
  });

  return response;
};

const generateOtp = asynchandler(async (req, res) => {
  const { mobile } = req.body;

  if (!mobile || mobile.length !== 10) {
    throw new ApiError(400, "A valid 10-digit mobile number is required");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await storeOtp(mobile, otp);

  const response = await sendOtpToMobile(mobile, otp);

  if (!response) {
    throw new ApiError(502, "Failed to send OTP. Please try again later");
  }

  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const verifyOtp = asynchandler(async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    throw new ApiError(400, "Mobile number and OTP are required");
  }

  const isValid = await verifyStoredOtp(mobile, otp);

  if (!isValid) {
    throw new ApiError(400, "Invalid or expired OTP. Please request a new one");
  }

  res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

const deleteCaptain = asynchandler(async (req, res) => {
  const captain = req.captain;
  const response = await Captain.findByIdAndDelete(captain._id);
  if (!response) {
    throw new ApiError(
      500,
      "Failed to delete captain account. Please try again",
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Captain account deleted successfully"));
});

const editProfile = asynchandler(async (req, res) => {
  const captain = req.captain;

  const {
    firstname,
    lastname,
    password,
    vehicleColor,
    vehicleType,
    vehiclePlate,
    vehicleCapacity,
  } = req.body;

  const profilepic = req.file;

  const captainToUpdate = await Captain.findById(captain._id);
  if (!captainToUpdate) {
    throw new ApiError(404, "Captain not found");
  }

  let updatedData = await Captain.findByIdAndUpdate(
    captain._id,
    {
      fullname: {
        firstname,
        lastname,
      },
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicletype: vehicleType,
      },
    },
    { new: true },
  );

  if (!updatedData) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Captain profile not updated"));
  }

  if (password) {
    updatedData.password = password;
    await updatedData.save({ validateBeforeSave: false });
  }

  if (profilepic) {
    const response = await uploadoncloudinary(profilepic.path);
    if (!response?.url) {
      throw new ApiError(
        502,
        "Failed to upload profile picture. Please try again",
      );
    }
    updatedData.profilepic = response.url;
    await updatedData.save({ validateBeforeSave: false });
  }

  const updatedCaptain = await Captain.findById(captain._id).select(
    "-password -refreshtoken",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCaptain, "Profile updated successfully"));
});

const rideHistory = asynchandler(async (req, res) => {
  const captain = req.captain;

  if (!captain) {
    throw new ApiError(401, "Unauthorized. Captain not found in request");
  }

  const RideData = await Ride.find({ captain: captain._id })
    .populate("user")
    .sort({ createdAt: -1 });

  if (!RideData) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No ride history found for this captain"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, RideData, "Ride history found"));
});

export {
  registercaptain,
  logincaptain,
  profile,
  logout,
  captainHistroy,
  verifyOtp,
  generateOtp,
  deleteCaptain,
  editProfile,
  rideHistory,
};
