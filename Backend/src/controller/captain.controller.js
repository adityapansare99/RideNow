import { Captain } from "../model/captain.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import Histroy from "../model/captainHistroy.model.js";
import twilio from "twilio";

const registercaptain = asynchandler(async (req, res) => {
  const { fullname, email, password, vehicle, mobile } = req.body;

  const exists = await Captain.findOne({ email });

  if (exists) {
    throw new ApiError(400, "Captain already exists");
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

  const hist = await Histroy.create({
    captain_id: captain._id,
    dist: [0],
    time: [0],
    earning: [0],
  });

  if (!captain) {
    throw new ApiError(400, "Captain not created");
  }

  const captainid = await Captain.findById(captain._id).select(
    "-password -refershtoken"
  );

  if (!captainid) {
    throw new ApiError(400, "Captain not created");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { captain: captainid },
        "captain registered successfully"
      )
    );
});

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
    captain.email
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  const loggeduser = await Captain.findOne({email:captain.email}).select(
    "-password -refreshtoken"
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

const Generatingaccessandrefreshtoken = async (capEmail) => {
  try {
    const captain = await Captain.findOne({email:capEmail});

    if (!captain) {
      res.status(404).json(new ApiResponse(404, null, "Captain not found"));
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

const profile = asynchandler(async (req, res) => {
  const captainid = await Captain.findById(req.captain).select(
    "-password -refreshtoken"
  );
  res.status(200).json(new ApiResponse(200, { captainid }, "captain profile"));
});

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

const captainHistroy = asynchandler(async (req, res) => {
  const captainid = await Captain.findById(req.captain).select(
    "-password -refreshtoken"
  );

  const captain_id = captainid._id;

  if (!captain_id) {
    throw new ApiError(400, "captain not found");
  }

  const histroy = await Histroy.findOne({ captain_id }).select("-captain_id");

  if (!histroy) {
    throw new ApiError(400, "histroy not found");
  }

  const totalDist = Number(
    histroy.dist.reduce((sum, val) => sum + val, 0).toFixed(2)
  );
  const totalTime = Number(
    histroy.time.reduce((sum, val) => sum + val, 0).toFixed(2)
  );
  const totalEarning = Number(
    histroy.earning.reduce((sum, val) => sum + val, 0).toFixed(2)
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, { totalDist, totalTime, totalEarning }, "histroy")
    );
});

const client = twilio(process.env.Twilio_SID, process.env.Twilio_AUTH_TOKEN);

const sendOtpToMobile = async (mobile, otp) => {
  const response = await client.messages.create({
    body: `RideNow Rider OTP: ${otp}\n\nUse this code to verify your phone number. Valid for 5 minutes. Do not share it with anyone.`,
    from: process.env.Twilio_PHONE_NUMBER,
    to: `+91${mobile}`,
  });
};

const generateOtp = asynchandler(async (req, res) => {
  const { mobile } = req.body;

  if (mobile.length !== 10) {
    throw new ApiError(400, "Enter valid mobile number");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await sendOtpToMobile(mobile, otp);

  res.status(200).json(new ApiResponse(200, otp, "otp generated successfully"));
});

export {
  registercaptain,
  logincaptain,
  profile,
  logout,
  captainHistroy,
  generateOtp,
};
