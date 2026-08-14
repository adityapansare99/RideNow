import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import twilio from "twilio";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { storeOtp, verifyStoredOtp } from "../service/otpStore.js";
import { Ride } from "../model/ride.model.js";
import mongoose from "mongoose";

const registeruser = asynchandler(async (req, res) => {
  const { firstname, lastname, email, password, mobile } = req.body;

  if ([firstname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const exists = await User.findOne({ email });

  if (exists) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    mobile,
  });

  if (!user) {
    throw new ApiError(500, "User registration failed. Please try again");
  }

  const userData = await User.findById(user._id).select(
    "-password -refreshtoken",
  );

  const { accesstoken, refreshtoken } = await Generatingaccessandrefreshtoken(
    userData.email,
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiResponse(
        201,
        { userData, accesstoken, refreshtoken },
        "User created successfully",
      ),
    );
});

const Generatingaccessandrefreshtoken = async (userEmail) => {
  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const refreshtoken = user.Generatingrefershtoken();
    const accesstoken = user.Generatingaccesstoken();

    user.refreshtoken = refreshtoken;

    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (err) {
    throw new ApiError(500, "Failed to generate authentication tokens");
  }
};

const userLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials. Please check your password");
  }

  const { accesstoken, refreshtoken } = await Generatingaccessandrefreshtoken(
    user.email,
  );

  const loggeduser = await User.findOne({ email: user.email }).select(
    "-password -refreshtoken",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

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

const refreshaccesstoken = asynchandler(async (req, res) => {
  const serversidetoken = req.cookies.refreshtoken || req.body.refreshtoken;
  if (!serversidetoken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  const decodetoken = jwt.verify(serversidetoken, process.env.refreshtoken);

  const user = await User.findOne({ email: decodetoken?.email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (serversidetoken !== user.refreshtoken) {
    throw new ApiError(401, "Refresh token is invalid or expired");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  const { accesstoken, refreshtoken: newrefreshtoken } =
    await Generatingaccessandrefreshtoken(user.email);

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", newrefreshtoken, options)
    .json(
      new ApiResponse(
        200,
        {
          accesstoken,
          refreshtoken: newrefreshtoken,
        },
        "access token successful",
      ),
    );
});

const logout = asynchandler(async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
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

const profile = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshtoken",
  );

  if (!user) {
    throw new ApiError(404, "User profile not found");
  }

  res.status(200).json(new ApiResponse(200, { user }, "User profile"));
});

const client = twilio(process.env.Twilio_SID, process.env.Twilio_AUTH_TOKEN);

const sendOtpToMobile = async (mobile, otp) => {
  const response = await client.messages.create({
    body: `RideNow OTP: ${otp}\n\nUse this code to verify your phone number. Valid for 5 minutes. Do not share it with anyone.`,
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

const editProfile = asynchandler(async (req, res) => {
  const { firstname, lastname, password } = req.body;
  const imagefile = req.file;

  if (!firstname || !lastname) {
    throw new ApiError(400, "All fields are required");
  }

  const user = req.user;

  const userToUpdate = await User.findById(user._id);
  if (!userToUpdate) {
    throw new ApiError(404, "User not found");
  }

  let UpdatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      fullname: {
        firstname,
        lastname,
      },
    },
    { new: true },
  );

  if (password) {
    UpdatedUser.password = password;

    await UpdatedUser.save({ validateBeforeSave: false });
  }

  if (imagefile) {
    const response = await uploadoncloudinary(imagefile.path);

    if (!response) {
      throw new ApiError(502, "Failed to upload image. Please try again");
    }

    UpdatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        image: response.url,
      },
      { new: true },
    );
  }

  const FinalUser = await User.findById(UpdatedUser._id).select(
    "-password -refreshtoken",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, FinalUser, "Profile updated successfully"));
});

const deleteUser = asynchandler(async (req, res) => {
  const user = req.user;
  const response = await User.findByIdAndDelete(user._id);

  if (!response) {
    throw new ApiError(500, "Failed to delete user account. Please try again");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

const rideHistory = asynchandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized. User not found in request");
  }

  const rideData1 = await Ride.find({ user: user._id })
    .populate("captain")
    .sort({ createdAt: -1 })
    .select("+otp");

  if (!rideData1) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No ride history found for this user"));
  }

  const rideData = await Promise.all(
    rideData1.map(async (ride) => {
      const rideObj = ride.toObject();

      if (rideObj.status === "completed" && rideObj.captain) {
        const averageRating = await Ride.aggregate([
          {
            $match: {
              captain: ride.captain._id,
              isRated: true,
            },
          },
          {
            $group: {
              _id: null,
              totalRating: { $sum: "$rating" },
              count: { $sum: 1 },
            },
          },
        ]);

        const avgRating =
          averageRating.length > 0
            ? (averageRating[0].totalRating / averageRating[0].count).toFixed(1)
            : 0;

        const count = averageRating.length > 0 ? averageRating[0].count : 0;

        rideObj.captainAverageRating = {
          avgRating: parseFloat(avgRating),
          count: count,
        };
      }

      return rideObj;
    }),
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, rideData, "Ride history retrieved successfully"),
    );
});

const driverRating = asynchandler(async (req, res) => {
  const { captainId } = req.body;

  if (!captainId) {
    throw new ApiError(400, "Captain not found");
  }

  const averageRating = await Ride.aggregate([
    {
      $match: {
        captain: new mongoose.Types.ObjectId(captainId),
        isRated: true,
      },
    },
    {
      $group: {
        _id: null,
        totalRating: { $sum: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating =
    averageRating.length > 0
      ? (averageRating[0].totalRating / averageRating[0].count).toFixed(1)
      : 0;

  const count = averageRating.length > 0 ? averageRating[0].count : 0;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avgRating: parseFloat(avgRating), count },
        "Driver rating retrieved successfully",
      ),
    );
});

export {
  registeruser,
  userLogin,
  refreshaccesstoken,
  logout,
  profile,
  generateOtp,
  editProfile,
  verifyOtp,
  deleteUser,
  rideHistory,
  driverRating,
};
