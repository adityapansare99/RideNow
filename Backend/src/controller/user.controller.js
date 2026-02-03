import { User } from "../model/user.model.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import twilio from "twilio";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { storeOtp, verifyStoredOtp } from "../service/otpStore.js";

const registeruser = asynchandler(async (req, res) => {
  const { firstname, lastname, email, password, mobile } = req.body;

  if ([firstname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const exists = await User.findOne({ email });

  if (exists) {
    throw new ApiError(400, "User already exists");
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
    throw new ApiError(400, "User not created");
  }

  const userId = await User.findById(user._id);

  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User created successfully"));
});

const Generatingaccessandrefreshtoken = async (userEmail) => {
  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      res.status(404).json(new ApiResponse(404, null, "User not found"));
      return null;
    }
    const refreshtoken = user.Generatingrefershtoken();
    const accesstoken = user.Generatingaccesstoken();

    user.refreshtoken = refreshtoken;

    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (err) {
    throw new ApiError(404, "NOT able to generate the tokens");
  }
};

const userLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    [email, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(404, "field is empty");
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(500, "password is wrong");
  }

  const { accesstoken, refreshtoken } = await Generatingaccessandrefreshtoken(
    user.email,
  );

  const loggeduser = await User.findOne({ email: user.email }).select(
    "-password -refershtoken",
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
    throw new ApiError(500, "token not found to server");
  }

  try {
    const decodetoken = jwt.verify(serversidetoken, process.env.refreshtoken);

    const user = await User.findOne({ email: decodetoken?.email });
    if (!user) {
      throw new ApiError(500, "user not found");
    }
    if (serversidetoken !== user.refreshtoken) {
      throw new ApiError(500, "not same token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accesstoken, refershtoken: newrefreshtoken } =
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
            refreshatoken: newrefreshtoken,
          },
          "access token successful",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "fail to decode");
  }
});

const logout = asynchandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: undefined,
      },
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
    .clearCookie("refereshtoken", options)
    .json(new ApiResponse(200, {}, "logged out successfully"));
});

const profile = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshtoken",
  );

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
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
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Mobile number is required and should be 10 digits",
        ),
      );
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await storeOtp(mobile, otp);

  const response = await sendOtpToMobile(mobile, otp);

  if (!response) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to send OTP"));
  }

  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const verifyOtp = asynchandler(async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Mobile and OTP are required"));
  }

  const isValid = await verifyStoredOtp(mobile, otp);

  if (!isValid) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or expired OTP"));
  }

  res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

const editProfile = asynchandler(async (req, res) => {
  try {
    const { firstname, lastname, password } = req.body;
    const imagefile = req.file;

    if (!firstname || !lastname) {
      throw new ApiError(400, "All fields are required");
    }

    const user = req.user;

    const OldData = User.findById(user._id);

    if (!OldData) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "User not found!"));
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
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Image not uploaded"));
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
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
});

const deleteUser = asynchandler(async (req, res) => {
  try {
    const user = req.user;
    const response=await User.findByIdAndDelete(user._id);
    if(!response){
      return res.status(404).json(new ApiResponse(404,null,"User not found"));
    }

    return res.status(200).json(new ApiResponse(200,null,"User deleted successfully"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
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
};
